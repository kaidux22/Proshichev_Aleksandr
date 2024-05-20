import requests as req
import json
import random as rd
import re
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
import pickle

class FakeReviews():

    def __init__(self):
        s3_hook = S3Hook("my_conn_S3")
        pickle_production_obj = s3_hook.download_file(key="data/products.pkl", bucket_name="fake-reviews")

        with open(pickle_production_obj, "rb") as prod:
            self.products = pickle.load(prod)

        self.ids = []
            
        self.emotion = ['негативный', "позитивный", "нейтральный"]
        
        self.costumers = [
        "Домохозяйка, 30 лет, заботливая, флегматик", 
        "Студент, 20 лет, любознательный, холерик", 
        "Инженер, 40 лет, ответственный, сангвиник", 
        "Предприниматель, 35 лет, решительный, сангвиник", 
        "Неизвестна, 50 лет, добрая, меланхолик", 
        "Врач, 33 года, внимательный, сангвиник", 
        "Учитель, 45 лет, терпеливый, флегматик", 
        "Дизайнер, 28 лет, креативный, холерик", 
        "Продавец, 25 лет, общительный, сангвиник", 
        "Строитель, 38 лет, трудолюбивый, флегматик", 
        "Менеджер, 42 года, организованный, сангвиник", 
        "Спортсмен, 32 года, целеустремленный, холерик", 
        "Пенсионер, 65 лет, мудрый, флегматик", 
        "Безработный, 37 лет, веселый, сангвиник", 
        "Неизвестна, 27 лет, дружелюбная, холерик",
        "Продавец, 30 лет, ответственный, флегматик", 
        "Домохозяйка, 45 лет, заботливая, сангвиник", 
        "Студент, 20 лет, любознательный, холерик", 
        "Строитель, 35 лет, трудолюбивый, сангвиник", 
        "Водитель, 50 лет, опытный, флегматик", 
        "Не известна, 27 лет, добрая, меланхолик", 
        "Менеджер, 33 года, коммуникабельный, сангвиник", 
        "Пенсионер, 65 лет, мудрый, флегматик", 
        "Программист, 25 лет, креативный, холерик", 
        "Врач, 40 лет, внимательный, сангвиник", 
        "Бухгалтер, 42 года, организованный, флегматик", 
        "Учитель, 37 лет, терпеливый, флегматик", 
        "Спортсмен, 23 года, активный, сангвиник", 
        "Дизайнер, 31 год, творческий, холерик", 
        "Предприниматель, 47 лет, решительный, сангвиник"
        ]
        
        self.dest = ["себе",
        "себе",
        "себе",
        "себе",
        "себе",
        "себе",
        "себе",
        "себе",
        "себе",
        "себе",
        "себе",
        "себе",
        "жене",
        "мужу",
        "сыну",
        "дочке",
        "брату",
        "сестре",
        "коллеге",
        "соседу",
        "другу",
        "подруге",
        "матери",
        "отцу",
        "тёще",
        "свёкру",
        "свекрови",
        "однокласснику",
        "приятелю",
        "учительнице",
        "тренеру",
        "психотерапевту",
        "лечащему врачу"
        ]

    def get_reviews(self, count : int):
        self.ids = [0] * count

        for idx in range(count):
            prompt = {
            "modelUri": "gpt://**код**/yandexgpt-lite",
            "completionOptions": {
                "stream": False,
                "temperature": 0.4,
                "maxTokens": "2000"
            },
            
            "messages": [
                {
                    "role": "system",
                    "text": "Какой бы" + self.emotion[rd.randint(0, 2)] + "отзыв ты бы оставил? Отзыв должен быть не больше 30 символов. Ответ дай в виде json-файла. Проверяй отзыв на логичность и естественность. Не начинай отзыв со слов 'Купил' или 'Купила'" 
                },
                {
                    "role": "user",
                    "text": "Представь, что ты покупатель в интернет магазине со следующими характеристиками: " + self.costumers[rd.randint(0, 29)] + ". Приобретаешь следующую вещь: " + self.products[rd.randint(0, 203)] + ". Купил ты это вещь для " + self.dest[rd.randint(0, 32)] + ". Можешь использовать не всю предоставленную о человеке информацию. Постарайся сделать естественный отзыв. Выбирай неформальный стиль общения в Интернете, но не нужно приводить в пример оба варианта. Возможно использовать не часто сленг, ругательства и просторечия. Общаться только с продавцом существующих интернет-магазинов или другими покупателями. Если требуется имя, придумай его сам. Пример json-файла: { 'отзыв': 'сгененированный отзыв' }.\
                          Нельзя использовать следующие слова ['заявленному', 'маска', 'набор', 'рюкзак', 'покрывало', 'оказался', 'подошёл', 'доволен', 'кроссовки', 'ожиданий', 'эту', 'книга', 'наушники', 'дорого', 'приве', 'неудобная', 'неудобно', '—', 'куртка-рубашка', 'купил']. Старайся писать больше длинных предложений. Периодически ощущай сомнения в своих словах. Иногда делай ошибки в словах.\
                          Пример реальных отзывов:\
                            1) На сезон хватает, уже второй год заказываю\
                            2) Хорошая этажерка. Собрала сама и быстро. Немного есть то ли царапки, то ли... Не знаю как назвать, но в эксплуатации не мешают и общего вида не портят\
                            3) Сам товар пришёл целый, выполнен качественно,но упаковка (во всём заказе) была вскрыта. Видно, как переклеивали пакеты. Моим котикам понравилось, вычесывает шесть отлично. Очень радует, что не нужно мучиться и выбирать шерсть с расчёски, просто кнопочку нажал и всё ))) Подарочки тоже положили(как на картинке), большое спасибо продавцу. Жаль только один, мои котики теперь отбирают друг у друга))) Товар рекомендую!\
                            4) Пока сказать тяжело, в полне приличный телефон за свои деньги, для пожилого человека, когда удалишь все лишние предложения то что надо. Остальное будит видно в процессе эксплуатации.\
                            5) Красивые , но на этом - всё. Спустя 14 дней использования (ничего сверхъестественного с кроссовками не делали точно) полностью отошла подошва и мысы.. зачем выставлять товар за оригинал , если это совершенно не так? Оригинальные кроссовки носятся годами и не теряют свой внешний вид , а данный товар - просто развод наивных людей и выброшенные в мусорку деньги. Не покупайте у этого продавца , если не хотите нарваться на очевидную подделку , которая и месяца вам не прослужит."
                          
                }
            ]
        }
    
            url = "https://llm.api.cloud.yandex.net/foundationModels/v1/completionAsync"
            headers = {
                "Content-Type": "application/json",
                "Authorization": "Api-Key **ключ**"

        
            }
    
            response = req.post(url, headers=headers, json=prompt)
            print(idx + 1)
            self.ids[idx] = json.loads(response.text)['id']
        s3_hook = S3Hook("my_conn_S3")
        pickle_ids_obj = pickle.dumps(self.ids)
        s3_hook.load_bytes(pickle_ids_obj, "data/ids1.pkl", bucket_name="fake-reviews", replace=True)