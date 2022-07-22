import json
from functools import wraps
from urllib.request import urlopen

from flask import abort, request
from jose import jwt

AUTH0_DOMAIN = 'dev-k3iu6ckt.us.auth0.com'
ALGORITHMS = ['RS256']
API_AUDIENCE = 'http://localhost:5000'


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def get_token_auth_header():
    if 'Authorization' not in request.headers:
        abort(401)

    print('header found')

    auth_header = request.headers.get('Authorization')
    header_parts = auth_header.split(' ')

    if len(header_parts) != 2:
        print(len(header_parts))
        abort(401)
    elif header_parts[0].lower() != 'bearer':
        print(header_parts[0].lower())
        abort(401)

    return header_parts[1]


def check_permissions(permission, payload):
    if 'permissions' not in payload:
        abort(400)
        raise AuthError({
            'code': 'invalid_claims',
            'description': 'Permissions not included in JWT.'
        }, 400)

    if permission not in payload['permissions']:
        abort(403)
        raise AuthError({
            'code': 'unauthorized',
            'description': 'Permission not found'
        }, 403)

    return True


def verify_decode_jwt(token):
    jsonurl = urlopen(f'https://{AUTH0_DOMAIN}/.well-known/jwks.json')
    jwks = json.loads(jsonurl.read())

    unverified_header = jwt.get_unverified_header(token)

    rsa_key = {}
    if 'kid' not in unverified_header:
        print('kid')
        print(unverified_header)
        abort(401)
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization malformed.'
        }, 401)

    for key in jwks['keys']:
        if key['kid'] == unverified_header['kid']:
            rsa_key = {
                'kty': key['kty'],
                'kid': key['kid'],
                'use': key['use'],
                'n': key['n'],
                'e': key['e']
            }

    if rsa_key:
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=API_AUDIENCE,
                issuer=f'https://{AUTH0_DOMAIN}/'
            )

            return payload
        except jwt.ExpiredSignatureError:
            print('token_expired')
            abort(401)
            raise AuthError({
                'code': 'token_expired',
                'description': 'Token expired.'
            }, 401)
        except jwt.JWTClaimsError:
            print('invalid_claims')
            abort(401)
            raise AuthError({
                'code': 'invalid_claims',
                'description': 'Incorrect claims. Please, check the audience and issuer.'
            }, 401)
        except Exception:
            abort(400)
            raise AuthError({
                'code': 'invalid_header',
                'description': 'Unable to parse authentication token.'
            }, 400)
    abort(403)
    raise AuthError({
        'code': 'invalid_header',
        'description': 'Unable to find the appropriate key.'
    }, 403)


def requires_auth(permission=''):
    def requires_auth_decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = get_token_auth_header()
            payload = verify_decode_jwt(token)
            print(payload)
            check_permissions(permission, payload)
            print('allowed')
            return f(payload, *args, **kwargs)

        return wrapper

    return requires_auth_decorator

