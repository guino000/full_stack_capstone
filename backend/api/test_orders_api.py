import os
import unittest

from flask_sqlalchemy import SQLAlchemy

from app import create_app
from models import setup_db


class OrdersApiTestCase(unittest.TestCase):
    """This class represents the orders api test case"""

    auth_header_manager = {
        'Authorization': "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1yS3ZKeU1weUJIZ0xBd2ROZ2pGbiJ9.eyJodHRwOi8vZGVtb3plcm8ubmV0L3JvbGVzIjpbIk1hbmFnZXIiXSwiaXNzIjoiaHR0cHM6Ly9kZXYtazNpdTZja3QudXMuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDYyZGE5ZTAzZTUxOGViYjY3NzVlOTUyNyIsImF1ZCI6WyJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJodHRwczovL2Rldi1rM2l1NmNrdC51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjYwNjkzMDYzLCJleHAiOjE2NjA3Nzk0NjMsImF6cCI6IlpEenNuUW5BZEh0d2JMeVBEUzB5RjliS2I5dzl6dThQIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBwb3N0OnByb2R1Y3RzIHBhdGNoOnByb2R1Y3RzIGRlbGV0ZTpwcm9kdWN0cyIsInBlcm1pc3Npb25zIjpbImRlbGV0ZTpwcm9kdWN0cyIsInBhdGNoOnByb2R1Y3RzIiwicG9zdDpwcm9kdWN0cyJdfQ.WFTzEHckEmn467AgwWCiI7PHkUbp46ZeKSCEpR75Uylc1qSP3XLKlUgz4BoDuHhfq_vynNwSigJGfulBeT5gLzYbI8l7x0RO6doyfTIOMHiQXa4kzmKfsbTFj25oe0D7rwWb1boRuJ8URtxmm4NfZV0NJjog683TcsZHRnWt4oJpA2rOYkNCGVpsEw0qibrdOHOkGDpVqkGGaYmMiWYdM8P8DEN7rP9QGz1Dkm3zfrEztXRytZkuBfMr-99YTM32Scbiq8viRqlupCdriPD3lL9iUoD8eg-k-eF3VMC1wDvmqdfUZmSTQLfJ7pOn48X6sJnna_foLqzLx1zTzy7uOQ"}

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

    def test_create_order_success(self):
        # Prepare
        res = self.client.post('/users/', json={
            'name': 'Test User Order',
            'email': 'testorder@user.com',
        })
        created = res.get_json().get('users')[0]

        res = self.client.post('/products/', headers=self.auth_header_manager, json={
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

    def test_create_order_error(self):
        # Test Create
        res = self.client.post('/orders/')
        self.assertEqual(res.status_code, 422)

    def test_get_order_success(self):
        # Test Read
        res = self.client.get(f'/orders/')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        orders = data.get('orders', [])
        res = self.client.get(f'/orders/{orders[0].get("id")}')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('order' in data)

    def test_get_order_error(self):
        # Test Read
        res = self.client.get(f'/orders/99')
        self.assertEqual(res.status_code, 404)

    def test_delete_order_success(self):
        # Test Delete
        res = self.client.get('/users/')
        data = res.get_json()
        users = data.get('users', [])
        self.client.delete(f'/users/{users[0].get("id")}')
        self.client.delete(f'/products/{users[0].get("id")}')

    def test_delete_order_error(self):
        # Test Delete
        res = self.client.delete(f'/users/99')
        self.assertEqual(res.status_code, 404)
        res = self.client.delete(f'/products/99')
        self.assertEqual(res.status_code, 401)


if __name__ == '__main__':
    unittest.main()
