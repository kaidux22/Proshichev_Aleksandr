import requests as req
import json
import random as rd
import re

feedback = open("feedbacks.txt", 'w')
ids = open("ids.txt")
cnt = 1

for line in ids:

    url = "https://llm.api.cloud.yandex.net/operations/" + line.strip()
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Api-Key ..."

    }

    response = req.get(url, headers=headers)
    result = json.loads(response.text)['response']['alternatives'][0]['message']['text']

    try:
        key = re.search("\"отзыв\": .*|'отзыв': .*", result).group()[:-2]
        feedback.write(key[10:] + '\n')
    except AttributeError:
        print('error', line.strip())
        continue
    
    print(cnt)
    cnt += 1

feedback.close()
ids.close()