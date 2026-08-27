# Quick Start Examples

Get started with the Gamaliel API in minutes.

## Python

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-...",  # Optional BYOK OpenAI key
    base_url="https://api.gamaliel.ai/v1"
)

response = client.chat.completions.create(
    model="gpt-5.6-luna",
    messages=[
        {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ],
    theology="default",
    profile="universal_explorer"
)

print(response.choices[0].message.content)
```

## JavaScript/TypeScript

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-...',  // Optional BYOK OpenAI key; omit Authorization for hosted (3/min/IP)
  baseURL: 'https://api.gamaliel.ai/v1'
});

const response = await openai.chat.completions.create({
  model: 'gpt-5.6-luna',
  messages: [
    { role: 'user', content: 'What does the Bible say about forgiveness?' }
  ],
  theology: 'default',
  profile: 'universal_explorer'
} as any);

console.log(response.choices[0].message.content);
```

## Raw HTTP

```bash
curl https://api.gamaliel.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-..." \
  -d '{
    "model": "gpt-5.6-luna",
    "messages": [
      {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ],
    "theology": "default",
    "profile": "universal_explorer"
  }'
```

## Hosted key (no BYOK)

Omit `Authorization`. Gamaliel uses a hosted OpenAI key, capped at **3 requests per minute per IP**, with **no availability guarantees**.

```bash
curl https://api.gamaliel.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6-luna",
    "messages": [
      {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ]
  }'
```

## Anthropic (Claude) BYOK

Use your **Anthropic** API key and an `anthropic/<id>` model (ids from **GET /v1/models**; example below uses a common Sonnet id):

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-ant-...",
    base_url="https://api.gamaliel.ai/v1"
)

response = client.chat.completions.create(
    model="anthropic/claude-sonnet-4-20250514",
    messages=[
        {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ],
    theology="default",
    profile="universal_explorer"
)

print(response.choices[0].message.content)
```

## Next Steps

- See [Python SDK Examples](python-sdk.md) for more Python examples
- See [JavaScript SDK Examples](javascript-sdk.md) for more JavaScript/TypeScript examples
- See [Raw HTTP Examples](raw-http.md) for more HTTP examples
- See [Advanced Examples](advanced.md) for scripture context, custom instructions, and more
