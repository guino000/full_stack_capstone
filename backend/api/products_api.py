import os

from flask import jsonify, abort, request, Blueprint

from auth import requires_auth
from models import Product, ProductPicture, db

products_api = Blueprint('products_api', __name__)


@products_api.route('/', methods=['GET'])
def get_products():
    products = Product.query.all()

    return jsonify({
        'success': True,
        'products': [p.format() for p in products],
        'count': len(products)
    })


@products_api.route('/<int:product_id>', methods=['GET'])
def get_product_details(product_id):
    product = Product.query.filter(Product.id == product_id).one_or_none()

    if product is None:
        abort(404)

    return jsonify({
        'success': True,
        'product': product.format()
    })


@products_api.route('/', methods=['POST'])
@requires_auth('post:products')
def create_product(self):
    body = request.get_json()

    new_name = body.get('name', None)
    new_description = body.get('description', None)
    new_cost = body.get('cost', None)
    new_size = body.get('size', None)
    new_picture_urls = body.get('pictures', '')

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


@products_api.route('/<int:product_id>', methods=['PATCH'])
@requires_auth('patch:products')
def update_product(self, product_id):
    product = Product.query.filter(Product.id == product_id).one_or_none()

    if product is None:
        abort(404)

    body = request.get_json()
    new_name = body.get('name', None)
    new_description = body.get('description', None)
    new_cost = body.get('cost', None)
    new_size = body.get('size', None)
    new_picture_urls = body.get('pictures', '')

    try:
        if new_name:
            product.name = new_name
        if new_description:
            product.description = new_description
        if new_cost:
            product.cost = new_cost
        if new_size:
            product.size = new_size
        if new_picture_urls:
            product.pictures = [ProductPicture(url) for url in new_picture_urls]

        db.session.commit()

        return jsonify({
            'success': True,
            'products': [product.format()]
        })
    except Exception as e:
        print(str(e))
        db.session.rollback()
        abort(422)


@products_api.route('/<int:product_id>', methods=['DELETE'])
@requires_auth('delete:products')
def delete_product(self, product_id):
    product = Product.query.filter(Product.id == product_id).one_or_none()

    if product is None:
        abort(404)

    try:
        db.session.delete(product)
        db.session.commit()

        return jsonify({
            'success': True,
            'deleted': product.format()
        })
    except Exception as e:
        print(str(e))
        db.session.rollback()
        abort(422)
