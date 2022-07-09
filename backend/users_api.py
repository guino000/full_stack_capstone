from flask import Blueprint, jsonify, abort, request

from models import User, db, Cart, Product, CartItem

users_api = Blueprint('users_api', __name__)


@users_api.route('/', methods=['GET'])
def get_users():
    users = User.query.all()

    return jsonify({
        'success': True,
        'users': [u.format() for u in users],
        'count': len(users)
    })


@users_api.route('/<int:user_id>', methods=['GET'])
def get_user_details(user_id):
    user = User.query.filter(User.id == user_id).one_or_none()

    if user is None:
        abort(404)

    return jsonify({
        'success': True,
        'user': user.format()
    })


@users_api.route('/<int:user_id>', methods=['PATCH'])
def update_user(user_id):
    user = User.query.filter(User.id == user_id).one_or_none()

    if user is None:
        abort(404)

    body = request.get_json()

    try:
        new_name = body.get('name')
        new_email = body.get('email')

        user.name = new_name if new_name else user.name
        user.email = new_email if new_email else user.email

        db.session.commit()

        return jsonify({
            'success': True,
            'users': [user.format()]
        })
    except Exception as e:
        print(str(e))
        db.session.rollback()
        abort(422)


@users_api.route('/', methods=['POST'])
def create_user():
    body = request.get_json()

    try:
        new_name = body.get('name')
        new_email = body.get('email')

        new_user = User(name=new_name, email=new_email)
        new_user.cart = Cart()

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'success': True,
            'users': new_user.format()
        })
    except Exception as e:
        print(str(e))
        db.session.rollback()
        abort(422)


@users_api.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.filter(User.id == user_id).one_or_none()

    if user is None:
        abort(404)

    try:
        db.session.delete(user)
        db.session.commit()

        return jsonify({
            'success': True,
            'deleted': user.format()
        })
    except Exception as e:
        print(str(e))
        db.session.rollback()
        abort(422)


@users_api.route('/<int:user_id>/cart', methods=['GET'])
def get_user_cart(user_id):
    user = User.query.filter(User.id == user_id).one_or_none()

    if user is None:
        abort(404)

    return jsonify({
        'success': True,
        'user': user_id,
        'products': [p.format() for p in user.cart.products]
    })


@users_api.route('/<int:user_id>/cart', methods=['POST'])
def add_item_to_cart(user_id):
    user = User.query.filter(User.id == user_id).one_or_none()

    if user is None:
        abort(404)

    body = request.get_json()
    product_id = body.get('product')
    quantity = body.get('quantity', 1)

    if product_id is None:
        abort(422)

    product = Product.query.filter(Product.id == product_id).one_or_none()

    if product is None:
        abort(404)

    try:
        cart_item = CartItem()
        cart_item.cart = user.cart
        cart_item.product = product
        cart_item.quantity = quantity

        db.session.add(cart_item)
        db.session.commit()

        return jsonify({
            'success': True,
            'cart_items': [ci.format() for ci in user.cart.cart_items]
        })
    except Exception as e:
        print(str(e))
        db.session.rollback()
        abort(422)

