def clean_text(text):
    from razdel import tokenize
    from pymorphy3 import MorphAnalyzer
    from nltk.corpus import stopwords

    text = text.lower()

    sw_to_drop = ['не']
    
    morph = MorphAnalyzer()
    sws = set(stopwords.words('russian'))

    for sw in sw_to_drop:
        sws.remove(sw)
    
    tokens = tokenize(text)
    tokens = [morph.parse(token.text)[0].normal_form for token in tokens]
    tokens = [token for token in tokens if token not in sws]

    return ' '.join(tokens) 