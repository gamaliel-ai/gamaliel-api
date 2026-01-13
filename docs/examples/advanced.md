# Advanced Examples

Advanced usage patterns and features.

## Scripture Context

Provide specific Bible passages as context for the AI response.

### Python SDK

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-...",
    base_url="https://api.gamaliel.ai/v1"
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "Explain the meaning of these verses"}
    ],
    book_id="MAT",
    chapter=5,
    verses=[1, 2, 3],
    bible_id="eng-web",
    theology_slug="reformed"
)

print(response.choices[0].message.content)
```

### JavaScript SDK

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-...',
  baseURL: 'https://api.gamaliel.ai/v1'
});

const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'Explain the meaning of these verses' }
  ],
  book_id: 'MAT',
  chapter: 5,
  verses: [1, 2, 3],
  bible_id: 'eng-web',
  theology_slug: 'reformed'
} as any);

console.log(response.choices[0].message.content);
```

## Custom System Instructions

Customize the tone, format, and audience-specific guidance without overriding theological guardrails.

### Python SDK

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-...",
    base_url="https://api.gamaliel.ai/v1"
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "What does the Bible say about peer pressure?"}
    ],
    system_instructions="You are speaking to high school students (ages 14-18) in a Christian youth group. They are familiar with basic Bible stories but may struggle with applying biblical principles to their daily lives. Use relatable examples, avoid theological jargon, and focus on practical application.",
    max_words=200
)

print(response.choices[0].message.content)
```

### JavaScript SDK

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-...',
  baseURL: 'https://api.gamaliel.ai/v1'
});

const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'What does the Bible say about peer pressure?' }
  ],
  system_instructions: 'You are speaking to high school students in a youth group. Keep responses concise (under 200 words), use relatable examples, and avoid theological jargon.',
  max_words: 200
} as any);

console.log(response.choices[0].message.content);
```

## Disabling Preflight Validation

Skip preflight validation for testing or when you're certain your inputs are valid.

### Python SDK

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-...",
    base_url="https://api.gamaliel.ai/v1"
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "Hello"}
    ],
    skip_preflight=True  # Bypass preflight validation
)

print(response.choices[0].message.content)
```

### JavaScript SDK

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-...',
  baseURL: 'https://api.gamaliel.ai/v1'
});

const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'Hello' }
  ],
  skip_preflight: true  // Bypass preflight validation
} as any);

console.log(response.choices[0].message.content);
```

## Conversation History

Maintain conversation history by including previous messages (stateless API pattern).

### Python SDK

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-...",
    base_url="https://api.gamaliel.ai/v1"
)

# First message
response1 = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ]
)

assistant_message = response1.choices[0].message.content
print(f"Assistant: {assistant_message}")

# Follow-up message with history
response2 = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "What does the Bible say about forgiveness?"},
        {"role": "assistant", "content": assistant_message},
        {"role": "user", "content": "Can you give me a specific example?"}
    ]
)

print(f"Assistant: {response2.choices[0].message.content}")
```

### JavaScript SDK

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-...',
  baseURL: 'https://api.gamaliel.ai/v1'
});

// First message
const response1 = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'What does the Bible say about forgiveness?' }
  ]
} as any);

const assistantMessage = response1.choices[0].message.content;
console.log(`Assistant: ${assistantMessage}`);

// Follow-up message with history
const response2 = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'What does the Bible say about forgiveness?' },
    { role: 'assistant', content: assistantMessage },
    { role: 'user', content: 'Can you give me a specific example?' }
  ]
} as any);

console.log(`Assistant: ${response2.choices[0].message.content}`);
```
