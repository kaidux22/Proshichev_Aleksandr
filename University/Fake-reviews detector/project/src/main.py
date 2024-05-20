from sklearn.metrics import accuracy_score, recall_score, precision_score, f1_score
from sklearn.model_selection import train_test_split
from Training.Vectorizer import Vectorizer
from Training.Learning import Models
import pandas as pd
import json


def train_model(model, X_train, y_train):
    if model == 'log-reg':
        model.log_reg(X_train, y_train)
    elif model == 'xgb':
        model.train_xgb(X_train, y_train)
    else:
        model.train_rf(X_train, y_train)


def calculate_model_scores(y_true, y_pred):
    scores = {'accuracy': .0, 'recall': .0, 'precision': .0, 'f1': .0}
    scores['accuracy'] = accuracy_score(y_true, y_pred)
    scores['recall'] = recall_score(y_true, y_pred)
    scores['precision'] = precision_score(y_true, y_pred)
    scores['f1'] = f1_score(y_true, y_pred)
    return scores


def calculate_scores(model, X_train, y_train, X_val, y_val):
    # Векторизация
    vec = Vectorizer()
    X_train_tf_idf = vec.tfidf(X_train, True)
    X_val_tf_idf = vec.tfidf(X_val)
    X_train_fast_text = vec.fasttext(X_train, True)
    X_val_fast_text = vec.fasttext(X_val)
    X_train_bow = vec.bag_of_words_embeddings(X_train, True)
    X_val_bow = vec.bag_of_words_embeddings(X_val)

    model = Models()

    model_scores = {}

    ## tf-idf
    train_model(model, X_train_tf_idf, y_train)
    y_pred_tf_idf = model.predict(X_val_tf_idf)
    model_scores['tf-idf'] = calculate_model_scores(y_val, y_pred_tf_idf)

    ## fasttext
    train_model(model, X_train_fast_text, y_train)
    y_pred_fast_text = model.predict(X_val_fast_text)
    model_scores['fasttext'] = calculate_model_scores(y_val, y_pred_fast_text)

    ## bow
    train_model(model, X_train_bow, y_train)
    y_pred_bow = model.predict(X_val_bow)
    model_scores['bow'] = calculate_model_scores(y_val, y_pred_bow)

    return model_scores

def print_scores(scores):
    for key, value in scores.items():
        print(f'type of vectorization - {key.upper()}')
        for score_type, score_value in value.items():
            print(f'\t{score_type} = {score_value}')
        print('\n')

if __name__ == '__main__':
    data = pd.read_csv('../data/dataset.csv')[['review', 'is_AI']]
    X_train, X_val, y_train, y_val = train_test_split(data.review, data.is_AI, test_size=0.2, random_state=42)
    scores = {}
    for model_type in ['log-reg', 'xgb', 'rf']:
        scores[model_type] = calculate_scores(model_type, X_train, y_train, X_val, y_val)
        print(f'model type is {model_type.upper()}')
        print_scores(scores[model_type])

    with open('scores.json', 'w') as fp:
        json.dump(scores, fp)