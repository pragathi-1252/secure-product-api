# Secure Product Catalog API

## API Structure

The API is built using **Node.js, Express.js, and TypeScript** with API versioning.

Base URL:

`/api/v1/products`

The API provides the following endpoints:

* `GET /products` – Get all products
* `GET /products/:id` – Get a product by ID
* `POST /products` – Create a product
* `PUT /products/:id` – Update a product
* `DELETE /products/:id` – Delete a product

## Validation Rules

Product data is validated using **express-validator**.

* `name` – Required, minimum 2 characters
* `price` – Required and greater than 0
* `category` – Required
* `stock` – Required integer, minimum 0
* `description` – Optional, maximum 500 characters

Invalid input returns **422 Unprocessable Entity**.

## Security Measures

* **Helmet** is used for security headers.
* JSON and URL-encoded request bodies are limited to **10KB**.
* Input strings are sanitized using `trim()` and `escape()`.
* **Rate limiting** allows 50 requests per 10 minutes per IP.
* Requests exceeding the limit return **429 Too Many Requests**.
* A centralized error handler provides consistent error responses.
