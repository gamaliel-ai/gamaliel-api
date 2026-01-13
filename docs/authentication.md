# Authentication

## BYOK (Bring Your Own Key) - Required

The API uses a **Bring Your Own Key** (BYOK) model where you **must** provide your own OpenAI API key:

- **Header:** `Authorization: Bearer sk-...` (required, standard OpenAI format)
- **No persistence:** We never store your OpenAI key - it's used per-request only
- **No rate limiting:** OpenAI handles rate limiting for your own keys
- **Privacy-friendly:** We never log or track which keys are used

## Why BYOK?

- **Client control:** You manage your own costs and rate limits via OpenAI
- **Privacy-friendly:** We never store or track which keys are used
- **Transparency:** You continue using OpenAI's own reporting, tracing, and usage tooling for full visibility
- **Simpler integration and secure:** No need to manage or register for a separate Gamaliel API key; your OpenAI API key is never stored or persisted by us, ensuring your credentials remain private and secure.
- **Future-proof:** Will support other compatible providers (Anthropic, etc.) in the future

## Usage

Include your OpenAI API key in the `Authorization` header:

```http
Authorization: Bearer sk-...
```

### Example with OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-...",  # Your OpenAI API key (required)
    base_url="https://api.gamaliel.ai/v1"
)
```

### Example with Raw HTTP

```python
import requests

response = requests.post(
    'https://api.gamaliel.ai/v1/chat/completions',
    headers={
        'Authorization': 'Bearer sk-...'  # Required
    },
    json={...}
)
```

## Error Responses

If the API key is missing or invalid, you'll receive a `401 Unauthorized` error. See [Error Responses](errors.md) for details.
