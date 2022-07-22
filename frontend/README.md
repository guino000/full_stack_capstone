# Clothes Shop Website

## Motivation

My wife sells vintage clothes online but currently she does it all manually by text messages.
I want to help her be faster and better with a website for selling clothes online.

### URL Location

`https://full-stack-capstone-udacity.herokuapp.com/`

## Project dependencies

### Preparing Backend

Dependencies for backend are all listed in `pipfile`

In order to run the backend you must create a pipenv environment
and install dependencies.

Set the following variables in `auth.py` to configure Authentication:

- **AUTH0_DOMAIN:** Your Auth0 Domain
- **ALGORITHMS:** The algorithms used in your domain
- **API_AUDIENCE:** API audience configured in Auth0

Setup the following environment variables to run flask:

- **DATABASE_URL**: Your database url
- **FLASK_APP**: Should be `app.py`
- **FLASK_ENV**: Should be `development`

Use `flask run` to start locally.

### Preparing Frontend

Dependencies for front are all listed in `package.json`

In order to run the frontend you must execute `npm install` to get all dependencies.

Create a file in the frontend root called `.env.local` containing:

```text
AUTH0_SECRET='<Generate your own secret>'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://<your auth0 domain>.com'
AUTH0_CLIENT_ID='<Your auth0 client id>'
AUTH0_CLIENT_SECRET='<Your auth0 client secret>'
AUTH0_AUDIENCE='http://localhost:5000'
```

Use `next dev` to start locally.

## API behavior and RBAC

### Application Roles

- **Manager**
    - Can perform all actions.
    - Permissions:
        - `post:product`: Can create products
        - `patch:product`: Can update products
        - `delete:product`: Can delete products

- **Maintainer**
    - Can maintain website data.
    - Permissions:
        - `patch:product`: Can update products

### Product API Endpoints

- `@products_api.route('/', methods=['GET'])`
    - Returns a list of all products

- `@products_api.route('/<int:product_id>', methods=['GET'])`
    - Returns information about a single product

- `@products_api.route('/', methods=['POST'])`
    - `@requires_auth('post:products')`
    - Creates a new product

- `@products_api.route('/<int:product_id>', methods=['PATCH'])`
    - `@requires_auth('patch:products')`
    - Updates a product

- `@products_api.route('/<int:product_id>', methods=['DELETE'])`
    - `@requires_auth('delete:products')`
    - Deletes a product

### Cart API Endpoints

- `@cart_api.route('/<int:user_id>/cart', methods=['GET'])`
    - Get cart information of a given user

- `@cart_api.route('/<int:user_id>/cart', methods=['POST'])`
    - Add an item to a user cart

- `@cart_api.route('/<int:user_id>/cart_items/<int:product_id>', methods=['DELETE'])`
    - Delete an item from a user cart

- `@cart_api.route('/<int:user_id>/cart', methods=['DELETE'])`
    - Clean the user's cart

### Order API Endpoints

- `@orders_api.route('/<int:order_id>', methods=['GET'])`
    - Get a single order
- `@orders_api.route('/', methods=['POST'])`
    - Create a new order
- `@orders_api.route('/<int:order_id>', methods=['PATCH'])`
    - Update order

### User API Endpoints

- `@users_api.route('/', methods=['GET'])`
    - Get all users
- `@users_api.route('/<int:user_id>', methods=['GET'])`
    - Get a single user
- `@users_api.route('/<int:user_id>', methods=['PATCH'])`
    - Update user information
- `@users_api.route('/', methods=['POST'])`
    - Create a new user
- `@users_api.route('/<int:user_id>', methods=['DELETE'])`
    - Delete a user

## Application Pages

- **Index**:
    - Shows a list of all products.
    - Any user can see it.
- **Product Details**:
    - Shows detailed information about a product.
    - Anyone can see it.
- **Product List**:
    - Displays a list of all products registered in the database.
    - Enables creation, edition and deletion of any product.
    - Can only be seen by a Manager or a Maintainer.
    - Maintainers can only see the edition button.
- **Create Product Form**:
    - Form for the creation of a new product.
    - Can only be seen by a Manager.
- **Update Product Form**:
    - Form for the update of a product.
    - Can be seen by Managers and Maintainers.
- **Profile Page**:
    - Displays information about the current logged user.
    - Can only be seen by someone logged in the application.
- **Login Page**:
    - Handles user login.
    - Will be automatically accessed whenever the users tries to perform an action that requires auth
