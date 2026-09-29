
## Robust Error Handling & Logging

### Overview
This project is a Secure Product Catalog REST API built using Node.js, Express.js, and TypeScript.

This update introduces centralized error handling, custom application errors, and structured logging.

### Error Handling
- Custom `AppError` class for handling application errors.
- Centralized error-handling middleware.
- Consistent JSON error responses.
- Unknown routes return a 404 error.
- Stack traces are displayed only in development mode.

### Logging
- Winston is used for application logging.
- Morgan is integrated with Winston for HTTP request logging.
- Error logs are stored in `logs/error.log`.
- Combined logs are stored in `logs/combined.log`.
- Timestamps are included in log entries.

### Validation
- Product request data is validated before processing.
- Invalid product data returns a 422 response.

### API Base URL
```text
http://localhost:4000/api/v1/products
```

### Error Response Example
```json
{
  "status": "fail",
  "message": "Product not found"
}
```

### Technologies Used
- Node.js
- Express.js
- TypeScript
- Winston
- Morgan
- Express Validator