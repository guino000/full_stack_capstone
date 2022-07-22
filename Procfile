web: gunicorn app:app
web: cd frontend && npm i && npm start
server: cd backend && pipenv install && gunicorn app:app