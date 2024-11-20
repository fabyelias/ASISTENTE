from flask import Flask
from config import Config
from models.User import db
from routes.auth import auth
from routes.google import google

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

app.register_blueprint(auth, url_prefix='/api/auth')
app.register_blueprint(google, url_prefix='/api/google')

if __name__ == '__main__':
    app.run(debug=True)  