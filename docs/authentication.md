# Authentication

## BYOK (Bring Your Own Key) - Required

The API uses a **Bring Your Own Key** (BYOK) model. You must provide **your own** LLM provider key in the `Authorization` header. Gamaliel supports:

| Provider   | Key shape (examples)     | Use with `model` |
|------------|----------------------------|------------------|
| **OpenAI** | `sk-...`, `sk-proj-...`    | Plain id (e.g. `gpt-4.1-mini`) or `openai/<id>` |
| **Anthropic** | `sk-ant-...`            | `anthropic/<id>` (Sonnet/Opus; Haiku not supported) |

- **Header:** `Authorization: Bearer <your-key>` (required)
- **No persistence:** Keys are not stored — used per request only
- **Provider match:** The key family must match the model provider. For example, `anthropic/claude-sonnet-4-20250514` requires an Anthropic key; default OpenAI models require an OpenAI key
- **No Gamaliel API key:** Integration is BYOK-only for chat completions

## Why BYOK?

- **Client control:** You manage costs and rate limits with the provider
- **Privacy-friendly:** We do not store or track which keys are used
- **Transparency:** You use the provider’s own reporting and usage tooling
- **Simple integration:** No separate Gamaliel API key for chat; use the same OpenAI SDK with `base_url` pointed at Gamaliel

## Usage

### OpenAI key

```http
Authorization: Bearer sk-...
```

### Anthropic key

```http
Authorization: Bearer sk-ant-...
```

### Example with OpenAI SDK (OpenAI or Anthropic key)

The official OpenAI Python/JavaScript clients work with Gamaliel’s base URL. Pass the API key for the provider that matches your `model`:

```python
from openai import OpenAI

# OpenAI-backed request
client = OpenAI(
    api_key="sk-...",  # OpenAI API key
    base_url="https://api.gamaliel.ai/v1"
)

# Anthropic-backed request (same client pattern, different key and model)
client_claude = OpenAI(
    api_key="sk-ant-...",  # Anthropic API key
    base_url="https://api.gamaliel.ai/v1"
)
```

Use **GET /v1/models** to see which model ids your deployment advertises for each provider.

### Example with Raw HTTP

```python
import requests

response = requests.post(
    'https://api.gamaliel.ai/v1/chat/completions',
    headers={
        'Authorization': 'Bearer sk-ant-...'  # or OpenAI sk-...
    },
    json={...}
)
```

## Error Responses

Missing/invalid headers, wrong key shape, or **key provider does not match `model`** yield `401 Unauthorized` with an OpenAI-style error body. See [Error Responses](errors.md) for details.
