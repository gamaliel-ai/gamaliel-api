# Error Responses

The API uses standard HTTP status codes and OpenAI-compatible error formats.

## 401 Unauthorized

### Missing OpenAI API Key

```json
{
  "error": {
    "message": "Missing or invalid Authorization header. Expected format: Authorization: Bearer <key>",
    "type": "invalid_request_error",
    "code": "missing_api_key"
  }
}
```

### Invalid API Key Format

```json
{
  "error": {
    "message": "Invalid API key format. OpenAI API keys must start with 'sk-'",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

## 400 Bad Request

### Invalid Request Format

```json
{
  "error": {
    "message": "Invalid request format: messages array is required",
    "type": "invalid_request_error",
    "code": "invalid_request"
  }
}
```

### Invalid Parameter

```json
{
  "error": {
    "message": "Invalid theology_slug: 'invalid_theology'. Use GET /v1/theologies to see available options.",
    "type": "invalid_request_error",
    "code": "invalid_parameter"
  }
}
```

### Invalid or Inappropriate Input (Preflight Rejection)

```json
{
  "error": {
    "message": "Invalid or inappropriate input",
    "type": "invalid_request_error",
    "code": "content_filter"
  }
}
```

This error is returned when preflight validation detects:
- `hacker_activity` - Malicious input (SQL injection, XSS, etc.)
- `inappropriate` - Explicit or inappropriate content
- `invalid` - Not a legitimate Bible question (phone numbers, emails, random text)

See [Chat Completions - Preflight Validation](endpoints/chat-completions.md#preflight-validation) for more details.

## 500 Internal Server Error

```json
{
  "error": {
    "message": "Internal server error",
    "type": "server_error",
    "code": "internal_error"
  }
}
```

## Error Handling

When using the OpenAI SDKs, errors are raised as exceptions:

### Python SDK

```python
from openai import OpenAI, APIError

client = OpenAI(
    api_key="sk-...",
    base_url="https://api.gamaliel.ai/v1"
)

try:
    response = client.chat.completions.create(...)
except APIError as e:
    print(f"Error {e.status_code}: {e.message}")
    print(f"Error code: {e.code}")
```

### JavaScript SDK

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-...',
  baseURL: 'https://api.gamaliel.ai/v1'
});

try {
  const response = await openai.chat.completions.create({...});
} catch (error) {
  if (error instanceof OpenAI.APIError) {
    console.error(`Error ${error.status}: ${error.message}`);
    console.error(`Error code: ${error.code}`);
  }
}
```
