import os
from flask import Flask, abort, jsonify, request
from models import setup_db, Product, db, ProductPicture
from flask_cors import CORS


def create_app(test_config=None):
    app = Flask(__name__)
    setup_db(app)
    CORS(app)

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

    @app.route('/products', methods=['GET'])
    def get_products():
        products = Product.query.all()

        return jsonify({
            'success': True,
            'products': [p.format() for p in products],
            'count': len(products)
        })

    @app.route('/products/<int:product_id>', methods=['GET'])
    def get_product_details(product_id):
        product = Product.query.filter(Product.id == product_id).one_or_none()

        if product is None:
            abort(404)

        return jsonify({
            'success': True,
            'product': product.format()
        })

    @app.route('/products', methods=['POST'])
    def create_product():
        body = request.get_json()

        new_name = body.get('name', None)
        new_description = body.get('description', None)
        new_cost = body.get('cost', None)
        new_size = body.get('size', None)
        new_picture_urls = body.get('pictures', '').split(';')

        try:
            product = Product(new_name, new_description, new_cost, new_size)
            pictures = [ProductPicture(url) for url in new_picture_urls]
            product.pictures = pictures
            db.session.add(product)
            db.session.commit()

            return jsonify({
                'success': True,
                'products': [product.format()]
            })
        except Exception as e:
            print(str(e))
            db.session.rollback()
            abort(422)

    return app


app = create_app()

if __name__ == '__main__':
    app.run()
