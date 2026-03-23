# Raw HTTP Examples

Examples using raw HTTP requests (no SDK).

## Non-Streaming (Python requests)

```python
import requests

response = requests.post(
    'https://api.gamaliel.ai/v1/chat/completions',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-...'  # Required
    },
    json={
        'model': 'gpt-4.1-mini',
        'messages': [
            {'role': 'user', 'content': 'What does the Bible say about forgiveness?'}
        ],
        'stream': False,
        'profile': 'universal_explorer',
        'theology': 'default',
        'max_words': 300
    }
)

data = response.json()
print(data['choices'][0]['message']['content'])
print(f"Tokens used: {data['usage']['total_tokens']}")
```

## Streaming (JavaScript fetch)

```javascript
const response = await fetch('https://api.gamaliel.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-...' // Required
  },
  body: JSON.stringify({
    model: 'gpt-4.1-mini',
    messages: [
      { role: 'user', content: 'What does the Bible say about forgiveness?' }
    ],
    stream: true,
    book_id: 'MAT',
    chapter: 6,
    verses: [14, 15]
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
let buffer = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  buffer += decoder.decode(value, { stream: true });
  const lines = buffer.split('\n');
  buffer = lines.pop(); // Keep incomplete line in buffer
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') {
        console.log('Stream complete');
        break;
      }
      try {
        const chunk = JSON.parse(data);
        const content = chunk.choices?.[0]?.delta?.content;
        if (content) {
          process.stdout.write(content);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }
}
```

## Disabling Scripture Links (Python requests)

By default, scripture references are automatically converted to markdown links that point to the Gamaliel reader (e.g., `[Matthew 5:1-16](/read/MAT/5?verse=1-16)`). To disable this and get plain text references instead, set `disable_scripture_links: true`:

```python
import requests

response = requests.post(
    'https://api.gamaliel.ai/v1/chat/completions',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-...'
    },
    json={
        'model': 'gpt-4.1-mini',
        'messages': [
            {'role': 'user', 'content': 'What does the Bible say about forgiveness?'}
        ],
        'disable_scripture_links': True  # Disable automatic link conversion
    }
)

data = response.json()
print(data['choices'][0]['message']['content'])
```

## Using cURL

```bash
curl https://api.gamaliel.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-..." \
  -d '{
    "model": "gpt-4.1-mini",
    "messages": [
      {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ],
    "theology": "default",
    "profile": "universal_explorer"
  }'
```

## Anthropic (Claude) BYOK (cURL)

Use `Authorization: Bearer sk-ant-...` and `anthropic/<id>` in the JSON body (check **GET /v1/models** for ids; Haiku is not supported):

```bash
curl https://api.gamaliel.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-ant-..." \
  -d '{
    "model": "anthropic/claude-sonnet-4-20250514",
    "messages": [
      {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ],
    "theology": "default",
    "profile": "universal_explorer"
  }'
```

## Streaming with cURL

```bash
curl https://api.gamaliel.ai/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-..." \
  -d '{
    "model": "gpt-4.1-mini",
    "messages": [
      {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ],
    "stream": true
  }'
```
