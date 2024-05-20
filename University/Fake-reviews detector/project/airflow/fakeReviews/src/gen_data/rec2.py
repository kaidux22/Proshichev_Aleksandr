import requests as req
import json
import random as rd
import pandas as pd
import time
import re
import pickle
from airflow.providers.amazon.aws.hooks.s3 import S3Hook


class RecFakeReviews:
    def __init__(self):
        self.feedbacks = []
        
        s3_hook = S3Hook("my_conn_S3")
        self.queue = pd.read_pickle(s3_hook.download_file(key="data/ids2.pkl", bucket_name="fake-reviews"))

    def parse(self):    
        
        for i in range(5):
            n = len(self.queue)
            for i in range(n):
                ID = self.queue.pop(0)

                url = "https://llm.api.cloud.yandex.net/operations/" + ID.strip()
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": "Api-Key **код**"
            
                }
            
                response = req.get(url, headers=headers)
                result = json.loads(response.text)
                
                if result['done']:
                    self.feedbacks.append(result['response']['alternatives'][0]['message']['text'])
                else:
                    self.queue.append(ID)
            if len(self.queue) == 0:
                break
            else:
                time.sleep(5)
                
        for idx in range(len(self.feedbacks)): 
            try:
                key = re.search("\"отзыв\": .*|'отзыв': .*", self.feedbacks[idx]).group()[:-2]
                self.feedbacks[idx] = key[10:]
            except AttributeError:
                print('error')
                continue
        s3_hook = S3Hook("my_conn_S3")
        pickle_feedbacks_obj = pickle.dumps(pd.DataFrame(self.feedbacks))
        s3_hook.load_bytes(pickle_feedbacks_obj, "data/feedbacks2.pkl", bucket_name="fake-reviews", replace=True)
