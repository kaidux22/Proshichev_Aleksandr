import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
import pickle

def clean_string(line):
    spec1 = ['\n', '\t', '\\n', '\\t', '\r']
    for sym in spec1:
        line = line.replace(sym, ' ')
    
    spec2 = ['#', '$', '*', '%']
    for sym in spec2:
        line = line.replace(sym, '')
    return line.strip()

class Mark:
    def __init__(self, df_bots, df_people):
        self.gpt_dataset = df_bots
        self.human_dataset = df_people
        

    
    def make_dataset(self):           
        
        
        # определяем размер датасета
        human_len = self.human_dataset.shape[0]
        gpt_len = self.gpt_dataset.shape[0]

        size = min(human_len, gpt_len)

        # берём одинаковые выборки
        self.human_dataset = self.human_dataset.sample(size)
        self.human_dataset.columns = ['review']
        self.human_dataset['is_AI'] = np.zeros(size, dtype=int)
        self.gpt_dataset = self.gpt_dataset.sample(size)
        self.gpt_dataset.columns = ['review']
        self.gpt_dataset['is_AI'] = np.ones(size, dtype=int)

        print(self.gpt_dataset.shape)
        self.gpt_dataset = self.gpt_dataset[self.gpt_dataset['review'].apply((lambda x: len(x) >= 3))]
        print(self.gpt_dataset.shape)
    
        # очищаем выборки
        self.human_dataset.review = self.human_dataset.review.apply(clean_string)
        self.gpt_dataset.review = self.gpt_dataset.review.apply(clean_string)
    
        # склеиваем и записываем
        final_dataset = pd.concat([self.human_dataset, self.gpt_dataset])
        
        x_train, x_test, y_train, y_test = train_test_split(final_dataset, final_dataset['is_AI'], test_size=0.25)
        
        s3_hook = S3Hook("my_conn_S3")
        pickle_train_obj = pickle.dumps(x_train)
        s3_hook.load_bytes(pickle_train_obj, "data/x_train.pkl", 
                              bucket_name="fake-reviews", replace=True)
    
        pickle_test_obj = pickle.dumps(x_test)
        s3_hook.load_bytes(pickle_test_obj, "data/x_test.pkl", 
                              bucket_name="fake-reviews", replace=True)


