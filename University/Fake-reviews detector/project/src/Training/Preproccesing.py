from nltk.corpus import stopwords
from nltk.tokenize import RegexpTokenizer
import re

import pandas as pd
import nltk
#nltk.download('stopwords') 

class Preproccesing:
    def __init__(self, df: pd.DataFrame):
        self.stop_words = set(stopwords.words('russian'))
        self.df = [RegexpTokenizer(r'\w+').tokenize(str(text.lower())) for text in df]
    
    def dlt_stop_words(self):
        self.df = [[ word for word in sent if word not in self.stop_words] for sent in self.df]
        return self
    
    def dlt_digs(self):
        self.df = [[re.sub(r'[0-9]', '', word) for word in sent] for sent in self.df]
        return self
    
    def clean_empty_space(self):
        self.df = [sent for sent in self.df if len(sent) != 0]

        self.df = [[word for word in sent if len(word) != 0] for sent in self.df]

    def get_dict(self):
        self.clean_empty_space()
        return self.df

    def get_sent(self):
        self.clean_empty_space()
        return pd.Series([' '.join(sent) for sent in self.df])
    