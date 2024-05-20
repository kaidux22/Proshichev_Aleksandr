import streamlit as st
from PIL import Image
import pickle
import pandas as pd
import time

# import nltk
# nltk.download('punkt')

with open('finalized_model.pkl', 'rb') as f:
    count_vec, clf = pickle.load(f)

df = pd.DataFrame({"Вероятность": [0, 0]}, index=["Человек", "YaGPT"])

bot_words = ['заявленному', 'маска', 'набор', 'рюкзак', 'покрывало', 'оказался',
             'подошёл', 'доволен', 'кроссовки', 'ожиданий', 'эту', 'книга',
             'наушники', 'дорого', 'приве', 'неудобная', 'неудобно', '—',
             'куртка-рубашка', 'купил']

human_words = ['продавца', 'синтетика', 'доставка', 'пришло', 'рост', 'пришел',
               'свитер', 'вернули', 'заказ', 'кофта', 'спасибо', 'фото',
               'подошел', 'до', 'все', 'продавец', 'пришли', 'заказала', 'рукава',
               'прислали']

st.header("Определение сгенерированных отзывов")
image = Image.open('wordcloud4.png')
st.image(image)
text = st.text_area(label="Введите отзыв", height=200)


data = clf.predict_proba(count_vec.transform([text]))
df.iloc[:, 0] = data.T
prob = data[0][1]
if len(text.strip()) > 0:
    st.write(f"Отзыв сгенерирован с вероятностью {round(prob * 100, 2)}%")

chart = st.empty()
chart.bar_chart(df, y="Вероятность")
