from flask import Blueprint, request, jsonify
import pickle
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import warnings
warnings.filterwarnings('ignore')
spam_blueprint = Blueprint('spam', __name__)

ps = PorterStemmer()

def transform_text(text):
    text = text.lower()
    text = nltk.word_tokenize(text)

    y = []
    for i in text:
        if i.isalnum():
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
        if i not in stopwords.words('english') and i not in string.punctuation:
            y.append(i)

    text = y[:]
    y.clear()

    for i in text:
        y.append(ps.stem(i))

    return " ".join(y)

# Load the trained model and vectorizer
with open('vectorizer.pkl','rb') as f:
    tfidf = pickle.load(f)

with open('model.pkl','rb') as f:
    model = pickle.load(f)

@spam_blueprint.route('/predict', methods=['POST'])
def predict():
    # Get data from request
    data = request.json
    print(data)
    
    # Get the message from the data
    input_sms = data.get('text', '')

    # Preprocess
    transformed_sms = transform_text(input_sms)

    # Vectorize
    vector_input = tfidf.transform([transformed_sms]).toarray()

    # Predict
    result = model.predict(vector_input)[0]
    print(result)

    # Return the prediction as JSON
    if result == 1:
        prediction = "Spam"
    else:
        prediction = "Not Spam"

    return jsonify({'prediction': prediction})
