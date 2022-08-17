import os
import unittest

from flask_sqlalchemy import SQLAlchemy

from app import create_app
from models import setup_db


class ProductsTestCase(unittest.TestCase):
    """This class represents the products api1 test case"""

    auth_header_manager = {
        'Authorization': "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1yS3ZKeU1weUJIZ0xBd2ROZ2pGbiJ9.eyJodHRwOi8vZGVtb3plcm8ubmV0L3JvbGVzIjpbIk1hbmFnZXIiXSwiaXNzIjoiaHR0cHM6Ly9kZXYtazNpdTZja3QudXMuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDYyZGE5ZTAzZTUxOGViYjY3NzVlOTUyNyIsImF1ZCI6WyJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJodHRwczovL2Rldi1rM2l1NmNrdC51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjYwNjkzMDYzLCJleHAiOjE2NjA3Nzk0NjMsImF6cCI6IlpEenNuUW5BZEh0d2JMeVBEUzB5RjliS2I5dzl6dThQIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBwb3N0OnByb2R1Y3RzIHBhdGNoOnByb2R1Y3RzIGRlbGV0ZTpwcm9kdWN0cyIsInBlcm1pc3Npb25zIjpbImRlbGV0ZTpwcm9kdWN0cyIsInBhdGNoOnByb2R1Y3RzIiwicG9zdDpwcm9kdWN0cyJdfQ.WFTzEHckEmn467AgwWCiI7PHkUbp46ZeKSCEpR75Uylc1qSP3XLKlUgz4BoDuHhfq_vynNwSigJGfulBeT5gLzYbI8l7x0RO6doyfTIOMHiQXa4kzmKfsbTFj25oe0D7rwWb1boRuJ8URtxmm4NfZV0NJjog683TcsZHRnWt4oJpA2rOYkNCGVpsEw0qibrdOHOkGDpVqkGGaYmMiWYdM8P8DEN7rP9QGz1Dkm3zfrEztXRytZkuBfMr-99YTM32Scbiq8viRqlupCdriPD3lL9iUoD8eg-k-eF3VMC1wDvmqdfUZmSTQLfJ7pOn48X6sJnna_foLqzLx1zTzy7uOQ"}

    auth_header_maintainer = {
        'Authorization': "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1yS3ZKeU1weUJIZ0xBd2ROZ2pGbiJ9.eyJodHRwOi8vZGVtb3plcm8ubmV0L3JvbGVzIjpbIk1haW50YWluZXIiXSwiaXNzIjoiaHR0cHM6Ly9kZXYtazNpdTZja3QudXMuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDYyZGExMTEzNmYyZWY2ZDgzY2I1N2ExOCIsImF1ZCI6WyJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJodHRwczovL2Rldi1rM2l1NmNrdC51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjYwNzUxNTIwLCJleHAiOjE2NjA4Mzc5MjAsImF6cCI6IlpEenNuUW5BZEh0d2JMeVBEUzB5RjliS2I5dzl6dThQIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCBwYXRjaDpwcm9kdWN0cyIsInBlcm1pc3Npb25zIjpbInBhdGNoOnByb2R1Y3RzIl19.BB3bBprdUAxgLnNgu_z1btZwTKpYnCRVuJcM_Tk0S4kCa82zY7IjiSQJTndJvFql6m62gQH1_VhogkQdtkH3I7ww5rax1vhYvC1vVTwJ9fdxDv-1zPdJqWGKkpG41Y8i726y-9_K0tMGZfEPNHtWqVc60hW6wcfSJz051XOVBSwz4H4Tobh__GaX7Sp_09z9zbaMbQo2j65YewRZno2VZlIcw29Vqdd_QI9S3B3rNmeQUcOUSRk-qxi0ZI1T-70-Pjghl-QymfvNSdwVcarQumwPdAKHal9-VDzM7JFxowqUJyQKRfiV6AFsRMXjwpZRHURAmb17RrNnWN3WwJqWNQ"
    }

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

    def test_create_product_success(self):
        # Test Create
        res = self.client.post('/products/', headers=self.auth_header_manager, json={
            'name': 'Test Product',
            'description': 'This is a test product',
            'cost': 45.55,
            'size': 43
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('products' in data)

    def test_create_product_error_claims(self):
        # Test Create
        res = self.client.post('/products/', headers=self.auth_header_maintainer, json={
            'name': 'Test Product',
            'description': 'This is a test product',
            'cost': 45.55,
            'size': 43
        })
        self.assertEqual(res.status_code, 403)

    def test_create_product_error_auth(self):
        # Test Create
        res = self.client.post('/products/', json={
            'name': 'Test Product',
            'description': 'This is a test product',
            'cost': 45.55,
            'size': 43
        })
        self.assertEqual(res.status_code, 401)

    def test_create_product_error(self):
        # Test Create
        res = self.client.post('/products/', headers=self.auth_header_manager)
        self.assertEqual(res.status_code, 422)

    def test_get_product_success(self):
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

    def test_get_product_error(self):
        # Test Read
        res = self.client.get(f'/products/99')
        self.assertEqual(res.status_code, 404)

    def test_update_product_success_manager(self):
        # Test Update
        res = self.client.get('/products/')
        data = res.get_json()
        products = data.get('products', [])

        res = self.client.patch(f'/products/{products[0].get("id", 0)}', headers=self.auth_header_manager, json={
            'name': 'Test Product Updated',
            'cost': 99
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('products' in data)

    def test_update_product_success_maintainer(self):
        # Test Update
        res = self.client.get('/products/')
        data = res.get_json()
        products = data.get('products', [])

        res = self.client.patch(f'/products/{products[0].get("id", 0)}', headers=self.auth_header_maintainer, json={
            'name': 'Test Product Updated',
            'cost': 99
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('products' in data)

    def test_update_product_error(self):
        # Test Update
        res = self.client.patch(f'/products/99', headers=self.auth_header_manager, json={
            'name': 'Test Product Updated',
            'cost': 99
        })
        self.assertEqual(res.status_code, 404)

    def test_update_product_auth_error(self):
        # Test Update
        res = self.client.patch(f'/products/99', json={
            'name': 'Test Product Updated',
            'cost': 99
        })
        self.assertEqual(res.status_code, 401)

    def test_delete_products_success(self):
        # Test Delete
        res = self.client.get('/products/')
        data = res.get_json()
        products = data.get('products', [])

        res = self.client.delete(f'/products/{products[0].get("id", 0)}', headers=self.auth_header_manager)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('deleted' in data)

    def test_delete_products_error(self):
        # Test Delete
        res = self.client.delete(f'/products/99', headers=self.auth_header_manager)
        self.assertEqual(res.status_code, 404)

    def test_delete_products_claims_error(self):
        # Test Delete
        res = self.client.get('/products/')
        data = res.get_json()
        products = data.get('products', [])

        res = self.client.delete(f'/products/{products[0].get("id", 0)}', headers=self.auth_header_maintainer)
        self.assertEqual(res.status_code, 403)

    def test_delete_products_auth_error(self):
        # Test Delete
        res = self.client.delete(f'/products/99')
        self.assertEqual(res.status_code, 401)


if __name__ == '__main__':
    unittest.main()
