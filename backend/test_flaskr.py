import os
import unittest

from flask_sqlalchemy import SQLAlchemy

from backend.app import create_app
from backend.models import setup_db


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
        res = self.client.post('/products', json={
            'name': 'Test Product',
            'description': 'This is a test product',
            'cost': 45.55,
            'size': 43,
            'pictures': 'http://pic1.jpg;http://pic2.jpg;http://pic3.jpg;'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('products' in data)
        products = data.get('products', [])

        # Test Read
        res = self.client.get('/products')
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