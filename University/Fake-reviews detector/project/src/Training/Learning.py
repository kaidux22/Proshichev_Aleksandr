from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier
import pandas as pd
import pickle
import os

class Models:
    def __init__(self):
        self.model = None

    def __load_model(self, path):
        if os.path.exists(path):
            with open(path, 'rb') as file:
                self.model = pickle.load(file)
        else:
            print('Нет такой модели:)')

    def __save_model(self, path):
        with open(path, 'wb') as file:
            pickle.dump(self.model, file)

    def log_reg(self, x_data=None, y_data=None):
        path = './Training/models/log_reg.pkl'
        if x_data is not None and y_data is not None:
            self.model = LogisticRegression()
            self.model.fit(x_data, y_data)
            self.__save_model(path)
        else:
            self.__load_model(path)

    def train_xgb(self, x_data=None, y_data=None):
        path = './Training/models/xgb_classifier.pkl'
        if x_data is not None and y_data is not None:
            self.model = XGBClassifier(
                learning_rate=0.02,
                n_estimators=10,
                objective="binary:logistic",
                nthread=3
            )
            self.model.fit(x_data, y_data)
            self.__save_model(path)
        else:
            self.__load_model(path)

    def train_rf(self, x_data=None, y_data=None):
        path = './Training/models/rf.pkl'
        if x_data is not None and y_data is not None:
            self.model = RandomForestClassifier()
            self.model.fit(x_data, y_data)
            self.model.fit(x_data, y_data)
            self.__save_model(path)
        else:
            self.__load_model(path)

    def predict(self, data):
        assert (self.model is not None)
        return self.model.predict(data)