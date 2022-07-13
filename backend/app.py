import os

from flask import Flask

from cart_api import cart_api
from users_api import users_api
from products_api import products_api
from models import setup_db
from flask_cors import CORS


def create_app(test_config=None):
    app = Flask(__name__)
    setup_db(app)
    CORS(app)

    app.register_blueprint(products_api, url_prefix='/products')
    app.register_blueprint(users_api, url_prefix='/users')
    app.register_blueprint(cart_api, url_prefix='/users')

    @app.route('/')
    def get_greeting():
        excited = os.environ['EXCITED']
        greeting = "Hello"
        if excited == 'true':
            greeting = greeting + "!!!!! You are doing great in this Udacity project."
        return greeting

    @app.route('/coolkids')
    def be_cool():
        return "Be cool, man, be coooool! You're almost a FSND grad!"

    return app


app = create_app()

if __name__ == '__main__':
    app.run()
