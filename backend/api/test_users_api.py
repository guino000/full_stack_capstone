import os
import unittest

from flask_sqlalchemy import SQLAlchemy

from app import create_app
from models import setup_db


class UsersApiTestCase(unittest.TestCase):
    """This class represents the users api1 test case"""

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

    def test_create_user_success(self):
        # Test Create
        res = self.client.post('/users/', json={
            'name': 'Test User',
            'email': 'test@user.com',
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('users' in data)

    def test_create_user_error(self):
        # Test Create
        res = self.client.post('/users/')
        self.assertEqual(res.status_code, 422)

    def test_get_user_success(self):
        # Test Read
        res = self.client.get('/users/')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('users' in data)

    def test_get_user_error(self):
        # Test Read
        res = self.client.get('/users/99')
        self.assertEqual(res.status_code, 404)

    def test_update_user_success(self):
        # Test Update
        res = self.client.get('/users/')
        data = res.get_json()
        users = data.get('users', [])
        res = self.client.patch(f'/users/{users[0].get("id", 0)}', json={
            'email': 'test2@user.com'
        })
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('users' in data)

    def test_update_user_error(self):
        # Test Update
        res = self.client.patch(f'/users/99', json={
            'email': 'test2@user.com'
        })
        self.assertEqual(res.status_code, 404)

    def test_delete_user_success(self):
        # Test Delete
        res = self.client.get('/users/')
        data = res.get_json()
        users = data.get('users', [])
        res = self.client.delete(f'/users/{users[0].get("id", 0)}')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue('success' in data)
        self.assertTrue('deleted' in data)

    def test_delete_user_error(self):
        # Test Delete
        res = self.client.delete(f'/users/99')
        self.assertEqual(res.status_code, 404)


if __name__ == '__main__':
    unittest.main()
