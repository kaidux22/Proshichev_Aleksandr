from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier
import pandas as pd
import pickle
import os



class Models:
    def __init__(self):
        self.model = None

    def __save_model(self, path="models/train.pkl"):
        s3_hook = S3Hook("my_conn_S3")

        pickle_model_obj = pickle.dumps(self.model)
        s3_hook.load_bytes(pickle_model_obj, path, 
                              bucket_name="fake-reviews", replace=True)

    def log_reg(self, x_data=None, y_data=None):
        self.model = LogisticRegression(max_iter=9999)
        self.model.fit(x_data, y_data)
        self.__save_model()

    def train_xgb(self, x_data=None, y_data=None):
        self.model = XGBClassifier(
            learning_rate=0.02,
            n_estimators=10,
            objective="binary:logistic",
            nthread=3
        )
        self.model.fit(x_data, y_data)
        self.__save_model()

    def train_rf(self, x_data=None, y_data=None):
        self.model = RandomForestClassifier()
        self.model.fit(x_data, y_data)
        self.model.fit(x_data, y_data)
        self.__save_model()


    def predict(self, data):
        assert (self.model is not None)
        return self.model.predict(data)