from flask import Blueprint, abort, jsonify, request

from backend.models import Cart, db, CartItem, User, Product

cart_api = Blueprint('cart_api', __name__)


@cart_api.route('/<int:user_id>/cart', methods=['GET'])
def get_user_cart(user_id):
    cart = Cart.query.filter(Cart.user_id == user_id).one_or_none()

    if cart is None:
        abort(404)

    return jsonify({
        'success': True,
        'user': user_id,
        'products': [p.format() for p in cart.cart_items]
    })


@cart_api.route('/<int:user_id>/cart', methods=['POST'])
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
        cart_item.product = product
        cart_item.quantity = quantity
        user.cart.cart_items.append(cart_item)
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


@cart_api.route('/<int:user_id>/cart_items/<int:product_id>', methods=['DELETE'])
def delete_cart_item(user_id, product_id):
    user = User.query.filter(User.id == user_id).one_or_none()

    if user is None:
        abort(404)

    cart_item = CartItem.query.filter(CartItem.cart_id == user.cart.id, CartItem.product_id == product_id).one_or_none()

    if cart_item is None:
        abort(404)

    try:
        db.session.delete(cart_item)
        db.session.commit()

        return jsonify({
            'success': True,
            'deleted': cart_item.format()
        })
    except Exception as e:
        print(str(e))
        db.session.rollback()
        abort(422)


@cart_api.route('/<int:user_id>/cart', methods=['DELETE'])
def clean_user_cart(user_id):
    cart = Cart.query.filter(Cart.user_id == user_id).one_or_none()

    if cart is None:
        abort(404)

    try:
        formatted_ci = [ci.format() for ci in cart.cart_items]
        for ci in cart.cart_items:
            db.session.delete(ci)
        db.session.commit()

        return jsonify({
            'success': True,
            'deleted': formatted_ci
        })
    except Exception as e:
        print(str(e))
        db.session.rollback()
        abort(422)
