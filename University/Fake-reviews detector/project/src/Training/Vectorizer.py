from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
import pandas as pd
from Training.Preproccesing import Preproccesing
from gensim.models.fasttext import FastText
import os
import pickle

class Vectorizer:
    def __init__(self):
        self.dict = None

    def get_emb(self, df: pd.DataFrame):
        assert (self.dict is not None)
        preproc = Preproccesing(df)
        if type(self.dict) == type(FastText()):
            return self.dict.wv[df]
        else:
            return self.dict.transform(preproc.get_sent())

    def bag_of_words_embaddings(self, df: pd.DataFrame, retrain=False):
        preproc = Preproccesing(df)
        path = './Training/models/bow'
        if os.path.exists(path) and not retrain:
            self.dict = pickle.load(open(path, 'rb'))
        else:
            self.dict = CountVectorizer()
            self.dict.fit(preproc.get_sent())

            with open(path, 'wb') as bow:
                pickle.dump(self.dict, bow)

        return self.dict.transform(preproc.get_sent())

    def tfidf(self, df: pd.DataFrame, retrain=False):
        preproc = Preproccesing(df)
        path = './Training/models/tfidf'
        if os.path.exists(path) and not retrain:
            self.dict = pickle.load(open(path, 'rb'))
        else:
            self.dict = TfidfVectorizer()
            self.dict.fit(preproc.get_sent())

            with open(path, "wb") as tfidf:
                pickle.dump(self.dict, tfidf)

        return self.dict.transform(preproc.get_sent())

    def fasttext(self, df: pd.DataFrame, retrain=False):
        preproc = Preproccesing(df)
        path = './Training/models/fasttext'
        if os.path.exists(path) and not retrain:
            self.dict = FastText.load(path)
        else:
            self.dict = FastText()
            self.dict.build_vocab(preproc.get_dict())
            self.dict.train(preproc.get_dict(), epochs=10, total_words=self.dict.corpus_total_words)
            self.dict.save(path)
        return self.dict.wv[df]

