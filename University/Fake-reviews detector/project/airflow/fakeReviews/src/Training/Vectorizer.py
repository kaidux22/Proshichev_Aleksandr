from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
import pandas as pd
from fakeReviews.src.Training.Preproccesing import Preproccesing
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from gensim.models.fasttext import FastText
import os
import pickle

class Vectorizer:
    def __init__(self):
        self.dict = None

    def __save_model(self, path="models/vec.pkl"):
        s3_hook = S3Hook("my_conn_S3")

        pickle_dict_obj = pickle.dumps(self.dict)
        s3_hook.load_bytes(pickle_dict_obj, path, 
                              bucket_name="fake-reviews", replace=True)

    def get_emb(self, df: pd.DataFrame):
        assert (self.dict is not None)
        preproc = Preproccesing(df)
        if type(self.dict) == type(FastText()):
            return self.dict.wv[df]
        else:
            return self.dict.transform(preproc.get_sent())

    def bag_of_words_embaddings(self, df: pd.DataFrame, retrain=False):
        preproc = Preproccesing(df)
        self.dict = CountVectorizer(min_df=3)
        self.dict.fit(preproc.get_sent())
        self.__save_model()
        
        return self.dict.transform(preproc.get_sent())

    def tfidf(self, df: pd.DataFrame, retrain=False):
        preproc = Preproccesing(df)
        self.dict = TfidfVectorizer()
        self.dict.fit(preproc.get_sent())
        self.__save_model()

        return self.dict.transform(preproc.get_sent())

    def fasttext(self, df: pd.DataFrame, retrain=False):
        preproc = Preproccesing(df)
        self.dict = FastText()
        self.dict.build_vocab(preproc.get_dict())
        self.dict.train(preproc.get_dict(), epochs=10, total_words=self.dict.corpus_total_words)
        return self.dict.wv[df]

