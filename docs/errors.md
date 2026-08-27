# Error Responses

The API uses standard HTTP status codes and OpenAI-compatible error formats.

## 401 Unauthorized

### Invalid API key format

Omitting `Authorization` uses the hosted key (not a 401). A present Bearer token must start with `sk-` (covers OpenAI and Anthropic `sk-ant-...`).

```json
{
  "error": {
    "message": "Invalid API key format. Key must start with 'sk-'",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

### API key does not match model provider

Using an **OpenAI** key with `model` `anthropic/...`, or an **Anthropic** key with a default/OpenAI model:

```json
{
  "error": {
    "message": "Model requires an Anthropic API key (sk-ant-...).",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

```json
{
  "error": {
    "message": "Model requires an OpenAI API key (not an Anthropic key).",
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
    "message": "Invalid theology: 'invalid_theology'. Use GET /v1/theologies to see available options.",
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

## 429 Too Many Requests

### Hosted key IP rate limit

When `Authorization` is omitted, Gamaliel provides the API key and caps **3 requests per minute per IP**. BYOK (caller provides `sk-…`) is not subject to this cap.

```json
{
  "error": {
    "message": "Rate limit exceeded. Requests without an API key are limited to 3 per minute per IP. ...",
    "type": "rate_limit_error",
    "code": "rate_limit_exceeded"
  }
}
```

We may tighten this limit or disable hosted access if we detect abuse. BYOK is optional; use it when you need stable throughput above the hosted cap.

### Conversation Limit Exceeded

```json
{
  "error": {
    "message": "Conversation limit reached: this API accepts at most 20 user messages per request. Start a new conversation to continue.",
    "type": "invalid_request_error",
    "code": "conversation_limit_exceeded",
    "limit": 20,
    "count": 21
  }
}
```

Gamaliel is designed as a focused question-and-answer service, not a generalized chat agent. To maintain quality and safety, individual conversations are limited to **20 user messages**. When the `messages` array contains more than 20 messages with `"role": "user"`, the API returns this error.

**What to do:** Start a new conversation. Each new request with a fresh `messages` array resets the count.

See [Chat Completions – Conversation Limit](endpoints/chat-completions.md#conversation-limit) for more details.

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
