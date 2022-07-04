import os

from flask import jsonify
from flask_migrate import Migrate
from sqlalchemy import Column, create_engine, String, DateTime, DECIMAL, Integer, ForeignKey
from flask_sqlalchemy import SQLAlchemy
import json

from sqlalchemy.orm import relationship

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


order_items = db.Table('order_items',
                       db.Column('order_id', Integer, db.ForeignKey('orders.id'), primary_key=True),
                       db.Column('product_id', Integer, db.ForeignKey('products.id'), primary_key=True)
                       )

cart_items = db.Table('cart_items',
                      db.Column('cart_id', Integer, db.ForeignKey('carts.id'), primary_key=True),
                      db.Column('product_id', Integer, db.ForeignKey('products.id'), primary_key=True)
                      )


class User(db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    cart = relationship('carts', back_populates='users', uselist=False)
    orders = relationship('orders', backref='users', lazy=True)

    def __int__(self, name, email):
        self.name = name
        self.email = email

    def format(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email
        }


class Product(db.Model):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    cost = Column(DECIMAL, nullable=False)
    size = Column(String)
    pictures = relationship('product_pictures', backref='products', lazy=True)

    def __init__(self, name, description, cost, size):
        self.name = name
        self.description = description,
        self.cost = cost
        self.size = size

    def format(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'cost': self.cost,
            'size': self.size,
            'pictures': jsonify(self.pictures)
        }


class ProductPictures(db.Model):
    __tablename__ = 'product_pictures'

    id = Column(Integer, primary_key=True)
    url = Column(String)
    product_id = Column(Integer, ForeignKey('products.id'))


class Order(db.Model):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True)
    order_number = Column(Integer)
    order_date = Column(DateTime)
    status = Column(String)
    tracking_code = Column(String)
    products = relationship("products", secondary=order_items,
                            backref=db.backref('orders', lazy=True))
    user_id = Column(Integer, ForeignKey('users.id'))

    def __init__(self, order_number, order_date, status, tracking_code):
        self.order_number = order_number,
        self.order_date = order_date,
        self.status = status,
        self.tracking_code = tracking_code

    def format(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'order_date': self.order_date,
            'status': self.status,
            'tracking_code': self.tracking_code,
            'products': jsonify(self.products)
        }


class Cart(db.Model):
    __tablename__ = 'carts'

    id = Column(Integer, primary_key=True)
    products = relationship("Products", secondary=order_items,
                            backref=db.backref('carts', lazy=True))
    user = relationship('users', back_populates='carts')

    def format(self):
        return {
            'id': self.id,
            'products': jsonify(self.products)
        }
