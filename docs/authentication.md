# Authentication

Chat completions support two modes on the same endpoint (`POST /v1/chat/completions`). **A caller API key is optional.**

## BYOK (Bring Your Own Key) — optional, recommended for applications

Send **your own** LLM provider key. You pay the provider; Gamaliel does **not** apply an IP rate limit on this path.

| Provider   | Key shape (examples)     | Use with `model` |
|------------|----------------------------|------------------|
| **OpenAI** | `sk-...`, `sk-proj-...`    | Plain id (e.g. `gpt-5.6-luna`) or `openai/<id>` |
| **Anthropic** | `sk-ant-...`            | `anthropic/<id>` (Sonnet/Opus; Haiku not supported) |

- **Header:** `Authorization: Bearer <your-key>`
- **No persistence:** Keys are not stored — used per request only
- **Provider match:** The key family must match the model provider
- **Recommended** for production apps, evals, and anything that needs stable throughput (optional — hosted mode works without a key)

## Hosted key — no caller key

If you omit `Authorization` (or send an empty Bearer), Gamaliel **provides** the server OpenAI key.

- **Limits:** **3 requests per minute per IP**
- **No guarantees:** we may tighten rate limits or **shut off** hosted access at any time if we detect abuse (eval-suite bursts, scraping, open proxies, etc.)
- **OpenAI models only** for this path. Anthropic (`anthropic/<id>`) still requires a caller `sk-ant-...` key
- Suitable for first-party clients (e.g. a Chrome extension) that cannot ship a provider key

A product token in a client bundle is not used and is not required.

Optional `X-Gamaliel-Client` (e.g. `chrome-extension`) is for **metrics only**, not authentication.

## Usage

### OpenAI key (BYOK)

```http
Authorization: Bearer sk-...
```

### Anthropic key (BYOK)

```http
Authorization: Bearer sk-ant-...
```

### Hosted (no key)

Omit the `Authorization` header. Subject to the hosted IP cap above.

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
        'Authorization': 'Bearer sk-ant-...'  # or OpenAI sk-...; omit for hosted
    },
    json={...}
)
```

## Error Responses

Present but invalid headers, wrong key shape, or **key provider does not match `model`** yield `401 Unauthorized` with an OpenAI-style error body. Hosted IP caps yield `429` with `code: rate_limit_exceeded`. See [Error Responses](errors.md) for details.
