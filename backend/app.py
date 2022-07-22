import os

from flask import Flask, jsonify

from api.cart_api import cart_api
from api.orders_api import orders_api
from api.users_api import users_api
from api.products_api import products_api
from models import setup_db
from flask_cors import CORS


def create_app(test_config=None):
    app = Flask(__name__)
    setup_db(app)
    CORS(app)

    app.register_blueprint(products_api, url_prefix='/products')
    app.register_blueprint(users_api, url_prefix='/users')
    app.register_blueprint(cart_api, url_prefix='/users')
    app.register_blueprint(orders_api, url_prefix='/orders')

    return app


app = create_app()

@app.errorhandler(422)
def unprocessable(error):
    return jsonify({
        "success": False,
        "error": 422,
        "message": f"unprocessable: {error}"
    }), 422


@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 404,
        'message': 'resource not found'
    }), 404


@app.errorhandler(400)
def invalid_claims(error):
    return jsonify({
        'success': False,
        'error': 400,
        'message': 'invalid claims'
    }), 400


@app.errorhandler(403)
def unauthorized(error):
    return jsonify({
        'success': False,
        'error': 403,
        'message': 'unauthorized'
    }), 403


@app.errorhandler(401)
def unauthorized(error):
    return jsonify({
        'success': False,
        'error': 401,
        'message': 'unauthorized'
    }), 401


if __name__ == '__main__':
    app.run()
