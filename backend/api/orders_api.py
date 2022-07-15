import datetime
import string
import random

from flask import Blueprint, abort, jsonify, request

from models import db, User, Order, OrderItem

orders_api = Blueprint('orders_api', __name__)


@orders_api.route('/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.filter(Order.id == order_id).one_or_none()

    if order is None:
        abort(404)

    return jsonify({
        'success': True,
        'order': order.format(),
    })


def generate_unique_order_number():
    order_number = ''.join(random.choice(string.digits) for _ in range(6))
    if Order.query.filter(Order.order_number == order_number).one_or_none():
        return generate_unique_order_number()
    return order_number


@orders_api.route('/', methods=['POST'])
def create_order():
    body = request.get_json()
    user_id = body.get('user')
    if user_id is None:
        abort(400)

    user = User.query.filter(User.id == user_id).one_or_none()

    if user is None:
        abort(404)

    try:
        order = Order(
            order_number=generate_unique_order_number(),
            order_date=datetime.datetime.utcnow(),
            status='PENDENTE'
        )
        order_items = [OrderItem(ci.product, ci.quantity) for ci in user.cart.cart_items]
        for item in order_items:
            order.order_items.append(item)

        db.session.add(order)
        db.session.commit()

        return jsonify({
            'success': True,
            'created': order.format()
        })
    except Exception as e:
        print(str(e))
        db.session.rollback()
        abort(422)


@orders_api.route('/<int:order_id>', methods=['POST'])
def update_order(order_id):
    body = request.get_json()
    new_status = body.get('status')
    new_tracking_code = body.get('tracking_code')

    if not new_status and not new_tracking_code:
        abort(400)

    order = Order.query.filter(Order.id == order_id).one_or_none()

    if order is None:
        abort(404)

    try:
        if new_status:
            order.status = new_status

        if new_tracking_code:
            order.tracking_code = new_tracking_code

        db.session.commit()

        return jsonify({
            'success': True,
            'order': order.format()
        })
    except Exception as e:
        print(str(e))
        db.session.rollback()
        abort(422)
