# S3Hook для коннекта к S3. Требует установки apache-airflow-providers-amazon!
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
# S3Hook для коннекта к базе Postgres. Требует установки apache-airflow-providers-postgres!
from airflow.providers.postgres.hooks.postgres import PostgresHook
# Основа DAG'a.
from airflow.models import DAG
# Оператор для исполнения python-кода.
from airflow.operators.python_operator import PythonOperator
# Date утилита от airflow.
from airflow.utils.dates import days_ago
from datetime import timedelta
from typing import NoReturn
import os

import pandas as pd
import pickle

DEFAULT_ARGS = {
    "owner": "Aleksandr Proshichev",  # Ваше имя и фамилия
    "email": "kaidux22@gmail.com",  # email в случае настройки алертов на почту
    "email_on_failure": False,  # Алерт по неудачам
    "email_on_retry": False,  # Алерт по попыткам
    "retry": 3,  # Количество попыток
    "retry_delay": timedelta(minutes=1)  # Задержка между попытками
}

BUCKET = "fake-reviews"
FEEDBACKS_COUNT = 7500

dag = DAG(
    dag_id="fake_reviews",  # Имя DAG'a
    schedule_interval="0 1 * * *",  # Расписание запусков (ежедневно в полночь)
    start_date=days_ago(2),  # Дата запуска
    catchup = False,
    tags=["detector"],  # Теги
    default_args=DEFAULT_ARGS)  # Параметры по умолчанию

def init() -> NoReturn:
    print("Pipeline started!")

def sent_req1() -> NoReturn:
    from fakeReviews.src.gen_data.gen1 import FakeReviews
    
    fake_rev = FakeReviews()
    fake_rev.get_reviews(FEEDBACKS_COUNT // 2)

def sent_req2() -> NoReturn:
    from fakeReviews.src.gen_data.gen2 import FakeReviews
    
    fake_rev = FakeReviews()
    fake_rev.get_reviews(FEEDBACKS_COUNT // 2)

def rec_req1() -> NoReturn:
    from fakeReviews.src.gen_data.rec1 import RecFakeReviews

    fake_rev = RecFakeReviews()
    fake_rev.parse()
    
def rec_req2() -> NoReturn:
    from fakeReviews.src.gen_data.rec2 import RecFakeReviews

    fake_rev = RecFakeReviews()
    fake_rev.parse()

def marking() -> NoReturn:
    from fakeReviews.src.gen_data.dataset_marking import Mark
    
    s3_hook = S3Hook("my_conn_S3")
    df_bots = pd.concat([pd.read_pickle(s3_hook.download_file(key="data/feedbacks1.pkl", bucket_name=BUCKET)), pd.read_pickle(s3_hook.download_file(key="data/feedbacks2.pkl", bucket_name=BUCKET))], ignore_index=True)
    
    pickle_revs_obj = s3_hook.download_file(key="data/people_riew.pkl", bucket_name="fake-reviews")

    with open(pickle_revs_obj, "rb") as people:
        df_people = pickle.load(people)

    make_ds = Mark(df_bots, df_people)
    make_ds.make_dataset()

def vectorization() -> NoReturn:
    from fakeReviews.src.Training.Vectorizer import Vectorizer
    
    s3_hook = S3Hook("my_conn_S3")
    x_train = pd.read_pickle(s3_hook.download_file(key="data/x_train.pkl",
                                     bucket_name=BUCKET))
    x_test = pd.read_pickle(s3_hook.download_file(key="data/x_test.pkl",
                                     bucket_name=BUCKET))

    
    vectorizer = Vectorizer()
    x_train_vec = vectorizer.bag_of_words_embaddings(x_train['review'])
    x_test_vec = vectorizer.get_emb(x_test['review'])

    print(x_train_vec.shape, x_train.shape)
    pickle_train_obj = pickle.dumps(x_train_vec)
    s3_hook.load_bytes(pickle_train_obj, "data/x_train_vec.pkl", 
                          bucket_name=BUCKET, replace=True)

    pickle_test_obj = pickle.dumps(x_test_vec)
    s3_hook.load_bytes(pickle_test_obj, "data/x_test_vec.pkl", 
                          bucket_name=BUCKET, replace=True)

def model_train() -> NoReturn:
    from sklearn.metrics import classification_report
    from fakeReviews.src.Training.Learning import Models
    
    s3_hook = S3Hook("my_conn_S3")
    x_train_vec = pd.read_pickle(s3_hook.download_file(key="data/x_train_vec.pkl",
                                     bucket_name=BUCKET))
    x_test_vec = pd.read_pickle(s3_hook.download_file(key="data/x_test_vec.pkl",
                                     bucket_name=BUCKET))
    x_train = pd.read_pickle(s3_hook.download_file(key="data/x_train.pkl",
                                     bucket_name=BUCKET))
    x_test = pd.read_pickle(s3_hook.download_file(key="data/x_test.pkl",
                                     bucket_name=BUCKET))

    model = Models()
    model.log_reg(x_train_vec, x_train['is_AI'])  

    train = pd.read_pickle(s3_hook.download_file(key="models/train.pkl",
                                     bucket_name=BUCKET))
    vec = pd.read_pickle(s3_hook.download_file(key="models/vec.pkl",
                                     bucket_name=BUCKET))

    pickle_model_obj = pickle.dumps((vec, train))
    s3_hook.load_bytes(pickle_model_obj, "model.pkl", bucket_name=BUCKET, replace=True)

    y_pred = model.predict(x_test_vec)
    print(classification_report(x_test['is_AI'], y_pred))

task_init = PythonOperator(task_id = "init", python_callable = init, dag = dag)
task_sent_req1 = PythonOperator(task_id = "gen_req1", python_callable = sent_req1, dag=dag)
task_sent_req2 = PythonOperator(task_id = "gen_req2", python_callable = sent_req2, dag=dag)
task_rec_req1 = PythonOperator(task_id = "rec_ans1", python_callable = rec_req1, dag=dag)
task_rec_req2 = PythonOperator(task_id = "rec_ans2", python_callable = rec_req2, dag=dag)
task_marking = PythonOperator(task_id = "marking", python_callable = marking, dag=dag)
task_vectorization = PythonOperator(task_id="vectorization", python_callable=vectorization, dag = dag)
task_model_train = PythonOperator(task_id="model_train", python_callable=model_train, dag = dag)

task_init >> task_sent_req1 >> task_rec_req1 >> marking
task_init >> task_sent_req2 >> task_rec_req2 >> marking >> task_vectorization >> task_model_train
task_init >> task_marking >> task_vectorization >> task_model_train
