from flask import Flask, request
from flask_cors import CORS
from vulnerability import vulnurabilities
from encript import encript
from decrypt import decrypt
from login import login_bp
from flask_jwt_extended import JWTManager
from spam import spam_blueprint
from news import new


app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your-long-random-secret-key'
jwt = JWTManager(app)



CORS(app, supports_credentials=True)
app.register_blueprint(vulnurabilities)
app.register_blueprint(encript)
app.register_blueprint(new)
app.register_blueprint(decrypt)
app.register_blueprint(login_bp, url_prefix='/auth')
app.register_blueprint(spam_blueprint, url_prefix='/spam')


if __name__ == '__main__':
    #DEBUG is SET to TRUE. CHANGE FOR PROD
    app.run(host='192.168.21.232',port=3000,debug=True)
