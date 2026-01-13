# Quick Start Examples

Get started with the Gamaliel API in minutes.

## Python

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-...",  # Your OpenAI API key (required)
    base_url="https://api.gamaliel.ai/v1"
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ],
    theology_slug="default",
    profile_slug="universal_explorer"
)

print(response.choices[0].message.content)
```

## JavaScript/TypeScript

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-...',  // Your OpenAI API key (required)
  baseURL: 'https://api.gamaliel.ai/v1'
});

const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'What does the Bible say about forgiveness?' }
  ],
  theology_slug: 'default',
  profile_slug: 'universal_explorer'
} as any);

console.log(response.choices[0].message.content);
```

## Raw HTTP

```bash
curl https://api.gamaliel.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-..." \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ],
    "theology_slug": "default",
    "profile_slug": "universal_explorer"
  }'
```

## Next Steps

- See [Python SDK Examples](python-sdk.md) for more Python examples
- See [JavaScript SDK Examples](javascript-sdk.md) for more JavaScript/TypeScript examples
- See [Raw HTTP Examples](raw-http.md) for more HTTP examples
- See [Advanced Examples](advanced.md) for scripture context, custom instructions, and more
