import os
import unittest

from flask_sqlalchemy import SQLAlchemy

from app import create_app
from models import setup_db


class OrdersApiTestCase(unittest.TestCase):
    """This class represents the orders api test case"""

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

    def test_crud_order(self):
        # Prepare
        res = self.client.post('/users/', json={
            'name': 'Test User Order',
            'email': 'testorder@user.com',
        })
        created = res.get_json().get('users')[0]

        res = self.client.post('/products/', json={
            'name': 'Test Product',
            'description': 'This is a test product',
            'cost': 45.55,
            'size': 43,
            'pictures': 'http://pic1.jpg;http://pic2.jpg;http://pic3.jpg;'
        })
        product1 = res.get_json().get('products')[0]

        self.client.post(f'/users/{created.get("id")}/cart', json={
            'product': product1.get('id'),
            'quantity': 50
        })

        # Test Create
        res = self.client.post('/orders/', json={
            'user': created.get('id')
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('created' in data)

        created = data.get('created')

        # Test Read
        res = self.client.get(f'/orders/{created.get("id")}')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('order' in data)
        new_order = data.get('order')

        # Test Cancel
        res = self.client.post(f'/orders/{new_order.get("id")}', json={
            'status': 'CANCELADO'
        })
        data = res.get_json()
        self.assertEqual(res.status_code, 200)
        self.assertTrue('success' in data)
        self.assertTrue('order' in data)

        # Cleanup
        self.client.delete(f'/users/{created.get("id")}')
        self.client.delete(f'/products/{product1.get("id")}')


if __name__ == '__main__':
    unittest.main()
