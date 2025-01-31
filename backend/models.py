import os

from flask import jsonify
from flask_migrate import Migrate
from sqlalchemy import Column, create_engine, String, DateTime, DECIMAL, Integer, ForeignKey
from flask_sqlalchemy import SQLAlchemy
import json

from sqlalchemy.orm import relationship, backref

database_path = os.environ['DATABASE_URL']
if database_path.startswith("postgres://"):
    database_path = database_path.replace("postgres://", "postgresql://", 1)

db = SQLAlchemy()

'''
setup_db(app)
    binds a flask application and a SQLAlchemy service
'''


def setup_db(app, database_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    db.create_all()
    migrate = Migrate(app, db)


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    order_id = Column(Integer, ForeignKey('orders.id'), primary_key=True)
    product_id = Column(Integer, ForeignKey('products.id'), primary_key=True)
    quantity = Column(Integer, nullable=False)

    product = relationship('Product', backref=backref('OrderItem', cascade='delete, delete-orphan'),
                           lazy='subquery', uselist=False)

    def __init__(self, product, quantity):
        self.product = product
        self.quantity = quantity

    def format(self):
        return {
            'product': self.product.format(),
            'quantity': self.quantity
        }

    def create(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class CartItem(db.Model):
    __tablename__ = 'cart_items'

    cart_id = Column(Integer, ForeignKey('carts.id'), primary_key=True)
    product_id = Column(Integer, ForeignKey('products.id'), primary_key=True)
    quantity = Column(Integer, nullable=False)

    product = relationship('Product', backref=backref('CartItem', cascade='delete, delete-orphan'),
                           lazy='subquery', uselist=False)

    def format(self):
        return {
            'product': self.product.format(),
            'quantity': self.quantity
        }

    def create(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class User(db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    cart = relationship('Cart', backref='User', cascade="all,delete", lazy=True, uselist=False)
    orders = relationship('Order', backref='User', cascade="all,delete", lazy=True)

    def __int__(self, name, email):
        self.name = name
        self.email = email

    def format(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email
        }

    def create(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Product(db.Model):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    cost = Column(DECIMAL, nullable=False)
    size = Column(String)
    pictures = relationship('ProductPicture', backref='Product', cascade="all,delete", lazy=True)

    def __init__(self, name, description, cost, size):
        self.name = name
        self.description = description
        self.cost = cost
        self.size = size

    def format(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'cost': float(self.cost),
            'size': self.size,
            'pictures': [p.format() for p in self.pictures]
        }

    def create(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class ProductPicture(db.Model):
    __tablename__ = 'product_pictures'

    id = Column(Integer, primary_key=True)
    url = Column(String)
    product_id = Column(Integer, ForeignKey('products.id'))

    def __init__(self, url):
        self.url = url

    def format(self):
        return {
            'id': self.id,
            'url': self.url,
            'product_id': self.product_id
        }

    def create(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Order(db.Model):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True)
    order_number = Column(Integer)
    order_date = Column(DateTime)
    status = Column(String)
    tracking_code = Column(String)
    order_items = relationship("OrderItem", backref='Order', cascade="all,delete", lazy=True)
    user_id = Column(Integer, ForeignKey('users.id'))

    def __init__(self, order_number, order_date, status):
        self.order_number = order_number,
        self.order_date = order_date,
        self.status = status

    def format(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'order_date': self.order_date,
            'status': self.status,
            'tracking_code': self.tracking_code,
            'products': [oi.format() for oi in self.order_items]
        }

    def create(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Cart(db.Model):
    __tablename__ = 'carts'

    id = Column(Integer, primary_key=True)
    cart_items = relationship("CartItem", backref='Cart', cascade="all,delete", lazy=True)
    user_id = Column(Integer, ForeignKey('users.id'))

    def format(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
        }

    def create(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
