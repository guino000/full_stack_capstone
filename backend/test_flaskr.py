import os
import unittest

from flask_sqlalchemy import SQLAlchemy

from app import create_app
from models import setup_db


class ShopTestCase(unittest.TestCase):
    """This class represents the shop test case"""

    def setUp(self) -> None:
        self.app = create_app()
        self.client = self.app.test_client()
        self.database_path = os.environ.get('DATABASE_URL')
        setup_db(self.app, self.database_path)

        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)
            self.db.create_all()

    def tearDown(self) -> None:
        """Executed after reach test"""
        pass

    def test_crud_products(self):
        # Test Create
        res = self.client.post('/products/', json={
            'name': 'Test Product',
            'description': 'This is a test product',
            'cost': 45.55,
            'size': 43,
            'pictures': 'http://pic1.jpg;http://pic2.jpg;http://pic3.jpg'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('products' in data)

        # Test Read
        res = self.client.get('/products/')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('products' in data)

        products = data.get('products', [])

        res = self.client.get(f'/products/{products[0].get("id", 0)}')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('product' in data)

        # Test Update
        res = self.client.patch(f'/products/{products[0].get("id", 0)}', json={
            'name': 'Test Product Updated',
            'cost': 99
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('products' in data)

        # Test Delete
        res = self.client.delete(f'/products/{products[0].get("id", 0)}')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('deleted' in data)

    def test_crud_users(self):
        # Test Create
        res = self.client.post('/users/', json={
            'name': 'Test User',
            'email': 'test@user.com',
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('users' in data)

        # Test Read
        res = self.client.get('/users/')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('users' in data)

        users = data.get('users', [])

        res = self.client.get(f'/users/{users[0].get("id", 0)}')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('user' in data)

        # Test Update
        res = self.client.patch(f'/users/{users[0].get("id", 0)}', json={
            'email': 'test2@user.com'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('users' in data)

        # Test Delete
        res = self.client.delete(f'/users/{users[0].get("id", 0)}')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('deleted' in data)

    def test_crud_cart(self):
        # Test Create
        res = self.client.post('/users/', json={
            'name': 'Test User Cart',
            'email': 'testcart@user.com',
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('users' in data)

        created = data.get('users')[0]

        # Test Read
        res = self.client.get(f'/users/{created.get("id")}/cart')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('products' in data)

        # Test Update
        res = self.client.post('/products/', json={
            'name': 'Test Product',
            'description': 'This is a test product',
            'cost': 45.55,
            'size': 43,
            'pictures': 'http://pic1.jpg;http://pic2.jpg;http://pic3.jpg;'
        })
        data = res.get_json()
        product1 = data.get('products')[0]

        res = self.client.post('/products/', json={
            'name': 'Test Product 2',
            'description': 'This is a test product 2',
            'cost': 66,
            'size': 30,
            'pictures': 'http://pic1.jpg;http://pic2.jpg;http://pic3.jpg;'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('products' in data)
        product2 = data.get('products')[0]

        res = self.client.post(f'/users/{created.get("id")}/cart', json={
            'product': product1.get('id'),
            'quantity': 50
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('cart_items' in data)

        self.client.post(f'/users/{created.get("id")}/cart', json={
            'product': product2.get('id'),
            'quantity': 50
        })

        # Test Delete
        res = self.client.delete(f'/users/{created.get("id")}/cart_items/{product1.get("id")}')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('deleted' in data)

        # Test Clean Cart
        res = self.client.delete(f'/users/{created.get("id")}/cart')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('deleted' in data)

        # Clean Env
        res = self.client.delete(f'/users/{created.get("id")}')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('deleted' in data)

        res = self.client.delete(f'/products/{product1.get("id")}')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('deleted' in data)


