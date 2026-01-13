# Gamaliel Public API

## Overview

The Gamaliel Public API provides a **biblical OpenAI-compatible API** that allows third-parties to integrate Gamaliel's biblical chat functionality into their own applications. The API serves as a **drop-in replacement** for OpenAI's chat completions API, with optional Gamaliel-specific parameters for biblical context and theological customization.

**Key Features:**
- OpenAI-compatible request/response format
- Streaming and non-streaming support
- Stateless operation (no chat persistence)
- BYOK (Bring Your Own Key) - you provide your own OpenAI API key
- Same prompts, tools, and biblical intelligence as Gamaliel UI

## Base URL

```
https://api.gamaliel.ai
```

## Authentication

### BYOK (Bring Your Own Key) - Required

The API uses a **Bring Your Own Key** (BYOK) model where you **must** provide your own OpenAI API key:

- **Header:** `Authorization: Bearer sk-...` (required, standard OpenAI format)
- **No persistence:** We never store your OpenAI key - it's used per-request only
- **No rate limiting:** OpenAI handles rate limiting for your own keys
- **Privacy-friendly:** We never log or track which keys are used

**Why BYOK?**
- **Client control:** You manage your own costs and rate limits via OpenAI
- **Privacy-friendly:** We never store or track which keys are used
- **Transparency:** You continue using OpenAI's own reporting, tracing, and usage tooling for full visibility
- **Simpler integration and secure:** No need to manage or register for a separate Gamaliel API key; your OpenAI API key is never stored or persisted by us, ensuring your credentials remain private and secure.
- **Future-proof:** Will support other compatible providers and(Anthropic, etc.) in the future

## Same Intelligence as Gamaliel UI

The Public API uses the **exact same underlying system** as the Gamaliel web application:

- **Same prompts:** Uses the same prompt templates from `gamaliel-prompts` (guardrails, theology guidelines, profile instructions)
- **Same tools:** Uses the same biblical search tools (semantic search, keyword search, passage lookup)
- **Same guardrails:** Enforces the same mandatory theological guardrails
- **Same quality:** Provides the same biblical intelligence and accuracy

The only difference is the API interface - under the hood, it's the same proven system that powers Gamaliel's web application.

## Endpoints

### 1. Chat Completions (`POST /v1/chat/completions`)

**OpenAI-Compatible Format** with Gamaliel extensions.

**Request:**
```http
POST https://api.gamaliel.ai/v1/chat/completions
Content-Type: application/json
Authorization: Bearer sk-... (required)

{
  "model": "gpt-4o-mini",  // Optional, defaults to gpt-4o-mini
  "messages": [
    {
      "role": "user",
      "content": "What does the Bible say about forgiveness?"
    }
  ],
  "stream": false,  // Optional, defaults to false (non-streaming)
  
  // Gamaliel-specific optional parameters:
  "book_id": "MAT",  // Optional scripture context
  "chapter": 5,  // Optional
  "verses": [1, 2, 3],  // Optional array of verse numbers
  "bible_id": "eng-web",  // Optional Bible translation ID, defaults to "eng-web"
  "profile_slug": "universal_explorer",  // Optional profile slug
  "theology_slug": "default",  // Optional theology slug
  "max_words": 300,  // Optional response length limit in words
  "system_instructions": "You are speaking to high school students. Keep responses concise and practical."  // Optional tone/format instructions
}
```

**Non-Streaming Response** (when `stream: false` or omitted):
```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-4o-mini",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The Bible teaches that forgiveness is central to the Christian faith. In Matthew 6:14-15, Jesus says that if we forgive others, our heavenly Father will forgive us..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 200,
    "total_tokens": 350
  }
}
```

**Streaming Response** (when `stream: true`):
Uses OpenAI-compatible Server-Sent Events format:

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4o-mini","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4o-mini","choices":[{"index":0,"delta":{"content":" Bible"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4o-mini","choices":[{"index":0,"delta":{"content":" teaches"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4o-mini","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

### 2. List Theologies (`GET /v1/theologies`)

Returns list of available theology slugs for use in chat requests.

**Request:**
```http
GET https://api.gamaliel.ai/v1/theologies
```

**Response:**
```json
{
  "theologies": [
    {
      "slug": "default",
      "name": "Default (Ecumenical)",
      "description": "A broad, ecumenical Christian perspective that emphasizes core Christian doctrines shared across traditions.",
      "is_default": true
    },
    {
      "slug": "reformed",
      "name": "Reformed",
      "description": "Calvinist theology emphasizing God's sovereignty, predestination, and the authority of Scripture.",
      "is_default": false
    },
    {
      "slug": "catholic",
      "name": "Roman Catholic",
      "description": "Roman Catholic perspective emphasizing tradition, sacraments, and magisterial authority.",
      "is_default": false
    }
  ]
}
```

### 3. List Profiles (`GET /v1/profiles`)

Returns list of available profile slugs for use in chat requests.

**Request:**
```http
GET https://api.gamaliel.ai/v1/profiles
```

**Response:**
```json
{
  "profiles": [
    {
      "slug": "universal_explorer",
      "name": "Universal Explorer",
      "description": "Exploring life's big questions, open to biblical wisdom",
      "experience_level": 1,
      "is_default": true
    },
    {
      "slug": "curious_explorer",
      "name": "Curious Explorer",
      "description": "Never read the Bible, curious about faith",
      "experience_level": 0,
      "is_default": false
    },
    {
      "slug": "mature_believer",
      "name": "Mature Believer",
      "description": "Studies Bible daily, seeks advanced theological insights",
      "experience_level": 5,
      "is_default": false
    }
  ]
}
```

## Request Parameters

### Standard OpenAI Parameters

- `model` (string, optional): Model name. Defaults to `gpt-4o-mini`
- `messages` (array, required): Array of message objects with `role` and `content`
  - `role`: `"user"`, `"assistant"`, or `"system"` (system messages are handled via `system_instructions` parameter)
  - `content`: Message content string
- `stream` (boolean, optional): Whether to stream responses. Defaults to `false`

### Gamaliel-Specific Optional Parameters

- `book_id` (string): Scripture context - book ID (e.g., `"MAT"`, `"GEN"`, `"1CO"`)
- `chapter` (integer): Scripture context - chapter number
- `verses` (array of integers): Scripture context - specific verse numbers (e.g., `[1, 2, 3]`)
- `bible_id` (string): Bible translation ID (e.g., `"eng-web"`, `"spa-niv-2022"`). Defaults to `"eng-web"`
- `profile_slug` (string): Pre-defined profile slug (e.g., `"universal_explorer"`, `"mature_believer"`). Defaults to `"universal_explorer"`
- `theology_slug` (string): Theological perspective (e.g., `"default"`, `"reformed"`, `"catholic"`). Defaults to `"default"`
- `max_words` (integer): Maximum response length in words. Defaults to 300
- `system_instructions` (string): Optional tone/format instructions (e.g., `"You are speaking to high school students. Keep responses concise."`). These are appended to the mandatory system message
- `convert_scripture_links` (boolean, optional): Whether to convert scripture references to markdown links. Defaults to `true`. When `true`, references like "Matthew 5:1-16" are converted to `[Matthew 5:1-16](/read/MAT/5?verse=1-16)`. When `false`, references remain as plain text.
- `skip_preflight` (boolean, optional): Whether to skip preflight validation. Defaults to `false`. When `true`, bypasses input validation and categorization. See "Preflight Validation" section below for details.

### Scripture Links Customization

By default, the API automatically converts scripture references (e.g., "Matthew 5:1-16", "Genesis 1:1") into markdown links that point to the Gamaliel reader. You can control this behavior in two ways:

**Option 1: Request Header (Recommended)**
Use the `X-Convert-Scripture-Links` header to control link conversion. The header takes precedence over the body parameter.

```http
X-Convert-Scripture-Links: false
```

Accepted header values (case-insensitive):
- `"true"`, `"1"`, `"yes"` - Enable scripture links (default)
- `"false"`, `"0"`, `"no"` - Disable scripture links

**Option 2: Body Parameter**
Include `convert_scripture_links` in the request body:

```json
{
  "messages": [...],
  "convert_scripture_links": false
}
```

**When to Disable Scripture Links:**
- You want plain text references without markdown formatting
- You're building your own link conversion logic
- You're integrating with systems that don't support markdown links
- You want to process references yourself before displaying

## Preflight Validation

The API includes **preflight validation** that categorizes and validates user input before processing requests. This helps filter invalid inputs, improve security, and reduce costs by catching inappropriate requests early.

### How It Works

Before each request reaches the chat agent, the API:
1. Extracts the prompt from the last user message
2. Categorizes the input using a fast validation model
3. Handles the request based on the category

### Input Categories

The preflight validator categorizes inputs into the following types:

- **`biblical_question`** - Bible study questions (e.g., "What does the Bible say about love?")
- **`passage_request`** - Requests for specific passages (e.g., "John 3:16", "Show me Isaiah 6")
- **`support_question`** - Questions about Gamaliel itself (e.g., "How do I use Gamaliel?", "how much does this cost?")
- **`greeting`** - Greetings or thanks (e.g., "Hi", "Thank you", "Hello")
- **`incomplete_input`** - Very short or incomplete inputs (e.g., "What", "1234")
- **`hacker_activity`** - Obvious malicious activity (e.g., SQL injection attempts, XSS)
- **`inappropriate`** - Explicit or inappropriate content
- **`invalid`** - Not a Bible question or legitimate input (e.g., phone numbers, emails, random text)

### Category Handling

**Passed Through to Agent:**
- `biblical_question` - Processed normally by the chat agent
- `passage_request` - Processed normally by the chat agent

**Intercepted with Special Responses:**
- `support_question` - Returns **blank/empty response** (no content, no chat created)
- `greeting` - Returns helpful greeting message (e.g., "Hello! I'm here to help you explore the Bible. What would you like to know?")
- `incomplete_input` - Returns helpful message asking for complete question

**Rejected with Error:**
- `hacker_activity` - Returns `400 Bad Request` with `content_filter` error code
- `inappropriate` - Returns `400 Bad Request` with `content_filter` error code
- `invalid` - Returns `400 Bad Request` with `content_filter` error code

### Disabling Preflight Validation

You can disable preflight validation by setting `skip_preflight: true` in your request:

```json
{
  "messages": [
    {"role": "user", "content": "Hello"}
  ],
  "skip_preflight": true
}
```

**When to Disable Preflight:**
- Testing validation logic or other API features
- You want to handle all inputs yourself
- You're certain your inputs are valid and want to skip the validation step

**Note:** Disabling preflight means invalid or inappropriate inputs will reach the chat agent, potentially incurring unnecessary costs.

**Example - Disabled Scripture Links:**
```json
{
  "messages": [
    {"role": "user", "content": "What does the Bible say about forgiveness?"}
  ],
  "convert_scripture_links": false
}
```

**Response with links disabled:**
```json
{
  "choices": [{
    "message": {
      "content": "The Bible teaches that forgiveness is central to the Christian faith. In Matthew 6:14-15, Jesus says that if we forgive others, our heavenly Father will forgive us..."
    }
  }]
}
```

**Response with links enabled (default):**
```json
{
  "choices": [{
    "message": {
      "content": "The Bible teaches that forgiveness is central to the Christian faith. In [Matthew 6:14-15](/read/MAT/6?verse=14-15), Jesus says that if we forgive others, our heavenly Father will forgive us..."
    }
  }]
}
```

## System Messages

The API automatically constructs a comprehensive system message that combines:

### 1. Mandatory Core (Always Included)

- **Theological Guardrails**: Core Christian doctrines and guardrails against common errors
- **Theology Guidelines**: Instructions from the selected theology (via `theology_slug`)
- **Profile Instructions**: Instructions from the selected profile (via `profile_slug`)

### 2. Optional User Instructions

If `system_instructions` is provided, it's appended to the core system message. This allows you to customize tone, format, and audience-specific guidance without overriding theological guardrails.

**Example:**
```json
{
  "messages": [
    {"role": "user", "content": "What does the Bible say about peer pressure?"}
  ],
  "system_instructions": "You are speaking to high school students (ages 14-18) in a Christian youth group. They are familiar with basic Bible stories but may struggle with applying biblical principles to their daily lives. Use relatable examples, avoid theological jargon, and focus on practical application."
}
```

**Important:** User-provided `system_instructions` cannot override or contradict the mandatory theological guardrails. They are purely additive for tone, format, and audience-specific guidance.

## Stateless Operation

The API is **stateless** - each request is independent:

- No `chat_id` parameter
- No chat history between requests
- No database persistence of chats or messages
- Each request is processed independently

You can maintain your own conversation history by including previous messages in the `messages` array (standard OpenAI pattern).

## Error Responses

### 401 Unauthorized

**Missing OpenAI API Key:**
```json
{
  "error": {
    "message": "Missing or invalid Authorization header. Expected format: Authorization: Bearer <key>",
    "type": "invalid_request_error",
    "code": "missing_api_key"
  }
}
```

**Invalid API Key Format:**
```json
{
  "error": {
    "message": "Invalid API key format. OpenAI API keys must start with 'sk-'",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

### 400 Bad Request

**Invalid Request Format:**
```json
{
  "error": {
    "message": "Invalid request format: messages array is required",
    "type": "invalid_request_error",
    "code": "invalid_request"
  }
}
```

**Invalid Parameter:**
```json
{
  "error": {
    "message": "Invalid theology_slug: 'invalid_theology'. Use GET /v1/theologies to see available options.",
    "type": "invalid_request_error",
    "code": "invalid_parameter"
  }
}
```

**Invalid or Inappropriate Input (Preflight Rejection):**
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

### 500 Internal Server Error

```json
{
  "error": {
    "message": "Internal server error",
    "type": "server_error",
    "code": "internal_error"
  }
}
```

## Example Usage

### Using Official OpenAI SDKs

The Gamaliel API is designed as a **drop-in replacement** for OpenAI's API. You can use the official OpenAI SDKs (Python, JavaScript, etc.) with minimal changes - just set the `base_url` and include Gamaliel-specific parameters.

**Key Points:**
- All standard OpenAI parameters work exactly as expected
- Gamaliel-specific parameters (`theology_slug`, `book_id`, etc.) are passed through automatically
- The SDK serializes all parameters to JSON, including custom ones
- TypeScript may show warnings for unknown fields (see TypeScript section below)

**How SDKs Handle Custom Parameters:**

Most SDKs (including OpenAI's official SDKs) support custom parameters in two ways:

1. **Extra Parameters in Method Calls**: The OpenAI SDK accepts `**kwargs` and automatically includes any extra parameters in the JSON request body. This means Gamaliel-specific parameters like `theology_slug`, `convert_scripture_links`, etc. are automatically passed through without any special handling.

2. **Custom Headers**: The OpenAI SDK supports custom headers via the `default_headers` parameter when initializing the client. This is useful for headers like `X-Convert-Scripture-Links` that take precedence over body parameters.

**Note:** When using headers, they apply to all requests from that client instance. If you need per-request header customization, you may need to create separate client instances or use raw HTTP requests.

#### Python SDK

```python
from openai import OpenAI

# Initialize client with Gamaliel base URL
client = OpenAI(
    api_key="sk-...",  # Your OpenAI API key (required)
    base_url="https://api.gamaliel.ai/v1"
)

# Standard OpenAI call with Gamaliel-specific parameters
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ],
    stream=False,
    # Gamaliel-specific parameters - SDK passes these through automatically
    theology_slug="reformed",
    profile_slug="universal_explorer",
    book_id="MAT",
    chapter=6,
    verses=[14, 15],
    max_words=300
)

print(response.choices[0].message.content)
print(f"Tokens used: {response.usage.total_tokens}")
```

**Streaming with Python SDK:**
```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-...",
    base_url="https://api.gamaliel.ai/v1"
)

stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ],
    stream=True,
    theology_slug="default",
    book_id="MAT",
    chapter=6
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")
```

#### JavaScript/TypeScript SDK

```typescript
import OpenAI from 'openai';

// Initialize client with Gamaliel base URL
const openai = new OpenAI({
  apiKey: 'sk-...',  // Your OpenAI API key (required)
  baseURL: 'https://api.gamaliel.ai/v1'
});

// Standard OpenAI call with Gamaliel-specific parameters
const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'What does the Bible say about forgiveness?' }
  ],
  stream: false,
  // Gamaliel-specific parameters - SDK passes these through automatically
  theology_slug: 'reformed',
  profile_slug: 'universal_explorer',
  book_id: 'MAT',
  chapter: 6,
  verses: [14, 15],
  max_words: 300
} as any);  // Type assertion needed for TypeScript (see below)

console.log(response.choices[0].message.content);
console.log(`Tokens used: ${response.usage.total_tokens}`);
```

**Streaming with JavaScript SDK:**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-...',
  baseURL: 'https://api.gamaliel.ai/v1'
});

const stream = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'What does the Bible say about forgiveness?' }
  ],
  stream: true,
  theology_slug: 'default',
  book_id: 'MAT',
  chapter: 6
} as any);

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    process.stdout.write(content);
  }
}
```

#### TypeScript Type Safety

TypeScript will show warnings for unknown parameters. You have several options:

**Option 1: Type assertion (simplest)**
```typescript
const response = await openai.chat.completions.create({
  // ... standard params
  theology_slug: 'reformed',  // TypeScript warning
} as any);  // Suppress warning
```

**Option 2: Extend the types**
```typescript
import OpenAI from 'openai';

interface GamalielChatCompletionCreateParams extends OpenAI.Chat.Completions.ChatCompletionCreateParams {
  theology_slug?: string;
  profile_slug?: string;
  book_id?: string;
  chapter?: number;
  verses?: number[];
  bible_id?: string;
  max_words?: number;
  system_instructions?: string;
}

const response = await openai.chat.completions.create({
  // ... params
  theology_slug: 'reformed',  // No warning!
} as GamalielChatCompletionCreateParams);
```

**Option 3: Use @ts-ignore**
```typescript
// @ts-ignore - Gamaliel-specific parameters
const response = await openai.chat.completions.create({
  // ... params
  theology_slug: 'reformed',
});
```

### Raw HTTP Examples

#### Non-Streaming (Python requests)

```python
import requests

response = requests.post(
    'https://api.gamaliel.ai/v1/chat/completions',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-...'  # Required
    },
    json={
        'model': 'gpt-4o-mini',
        'messages': [
            {'role': 'user', 'content': 'What does the Bible say about forgiveness?'}
        ],
        'stream': False,
        'profile_slug': 'universal_explorer',
        'theology_slug': 'default',
        'max_words': 300
    }
)

data = response.json()
print(data['choices'][0]['message']['content'])
print(f"Tokens used: {data['usage']['total_tokens']}")
```

#### Streaming (JavaScript fetch)

```javascript
const response = await fetch('https://api.gamaliel.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-...' // Required
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
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

### With Scripture Context

**Using Python SDK:**
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

### With Custom System Instructions

**Using Python SDK:**
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
    system_instructions="You are speaking to high school students in a youth group. Keep responses concise (under 200 words), use relatable examples, and avoid theological jargon.",
    max_words=200
)

print(response.choices[0].message.content)
```

**Using JavaScript SDK:**
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

### Disabling Scripture Links

You can disable scripture links using either body parameters or custom headers. Headers take precedence over body parameters.

**Option 1: Using Body Parameter (Python SDK)**
```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-...",
    base_url="https://api.gamaliel.ai/v1"
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ],
    convert_scripture_links=False  # Disable automatic link conversion
)

print(response.choices[0].message.content)
# Output: "The Bible teaches that forgiveness is central... In Matthew 6:14-15, Jesus says..."
# (plain text references, no markdown links)
```

**Option 2: Using Custom Headers (Python SDK)**
```python
from openai import OpenAI

# Set default headers when initializing the client
client = OpenAI(
    api_key="sk-...",
    base_url="https://api.gamaliel.ai/v1",
    default_headers={
        "X-Convert-Scripture-Links": "false"  # Header takes precedence over body params
    }
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ]
    # convert_scripture_links parameter not needed - header takes precedence
)

print(response.choices[0].message.content)
```

**Using JavaScript SDK (Body Parameter):**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-...',
  baseURL: 'https://api.gamaliel.ai/v1'
});

const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'What does the Bible say about forgiveness?' }
  ],
  convert_scripture_links: false  // Disable automatic link conversion
} as any);

console.log(response.choices[0].message.content);
// Output: "The Bible teaches that forgiveness is central... In Matthew 6:14-15, Jesus says..."
// (plain text references, no markdown links)
```

**Using JavaScript SDK (Custom Headers):**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: 'sk-...',
  baseURL: 'https://api.gamaliel.ai/v1',
  defaultHeaders: {
    'X-Convert-Scripture-Links': 'false'  // Header takes precedence
  }
});

const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'What does the Bible say about forgiveness?' }
  ]
  // convert_scripture_links parameter not needed - header takes precedence
} as any);

console.log(response.choices[0].message.content);
```

**Using Raw HTTP Requests (Python requests):**
```python
import requests

response = requests.post(
    'https://api.gamaliel.ai/v1/chat/completions',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-...',
        'X-Convert-Scripture-Links': 'false'  # Header takes precedence
    },
    json={
        'model': 'gpt-4o-mini',
        'messages': [
            {'role': 'user', 'content': 'What does the Bible say about forgiveness?'}
        ]
    }
)

data = response.json()
print(data['choices'][0]['message']['content'])
```

**Note:** When using `default_headers` or `defaultHeaders` in the OpenAI SDK, the headers apply to all requests from that client instance. For per-request header customization, use body parameters or create separate client instances.

## Manual Testing with Open WebUI

Open WebUI is a popular open-source chat interface that can be used to manually test the Gamaliel Public API. It provides a user-friendly interface similar to ChatGPT.

### Quick Setup

1. **Install Docker Desktop** (if not already installed)

2. **Create a directory for Open WebUI:**
   ```bash
   mkdir open-webui-gamaliel
   cd open-webui-gamaliel
   ```

3. **Create `docker-compose.yml`:**
   ```yaml
   services:
     open-webui:
       image: ghcr.io/open-webui/open-webui:main
       container_name: open-webui
       ports:
         - "3000:8080"
       environment:
         - OPENAI_API_BASE_URL=https://api.gamaliel.ai/v1
       restart: unless-stopped
       volumes:
         - open-webui-data:/app/backend/data

   volumes:
     open-webui-data:
   ```

4. **Start Open WebUI:**
   ```bash
   docker-compose up -d
   ```

5. **Access Open WebUI:**
   - Open http://localhost:3000 in your browser
   - Sign in or create an account

6. **Configure API Connection:**
   - Go to **Admin Panel → Settings → Connections**
   - Enable the **"Direct Connections"** toggle
   - Click the gear icon next to "Manage OpenAI API Connections"
   - Add/edit connection:
     - **API Base URL:** `https://api.gamaliel.ai/v1`
     - Save the connection

7. **Configure Your API Key:**
   - Go to **Settings** (user menu in top right)
   - Add your OpenAI API key
   - Select a model from the dropdown (e.g., `gpt-4o-mini`)

8. **Test:**
   - Start a new chat
   - Ask a biblical question (e.g., "What does the Bible say about forgiveness?")
   - Verify the response includes biblical citations and context

### Useful Commands

**View logs:**
```bash
docker-compose logs -f
```

**Stop:**
```bash
docker-compose down
```

**Stop and reset data:**
```bash
docker-compose down -v
```

### Notes

- Open WebUI uses Direct Connections mode, so each user provides their own OpenAI API key
- The API Base URL should be `https://api.gamaliel.ai/v1` (production) or `http://host.docker.internal:8000/v1` (local development)
- Models are automatically fetched from `/v1/models` endpoint

## Security Considerations

- OpenAI keys are never persisted, logged, or tracked
- System messages always include mandatory theological guardrails
- User-provided `system_instructions` cannot override guardrails
- No authentication required beyond BYOK (no Gamaliel API keys)
- Stateless operation prevents data leakage between requests

## Questions & Answers

**Q: Why OpenAI-compatible format?**  
A: Familiarity and tool interchangeability. You can use existing OpenAI SDKs and tools with minimal changes. Just add Gamaliel-specific parameters for biblical context.

**Q: Why is BYOK required?**  
A: Simplifies integration, gives you control over costs, and ensures privacy. Future versions may support other providers (Anthropic, etc.).

**Q: How do system messages work?**  
A: Mandatory Gamaliel guardrails + theology + profile are always included. User-provided `system_instructions` are appended for tone/format customization but cannot override guardrails.

**Q: Can I use this as a drop-in replacement for OpenAI?**  
A: Yes! Use standard OpenAI format with optional Gamaliel parameters. If you don't provide Gamaliel-specific params, it works like OpenAI but with biblical guardrails.

**Q: Can I use the official OpenAI SDKs?**  
A: Yes! The official OpenAI Python and JavaScript SDKs work perfectly. Just set `base_url="https://api.gamaliel.ai/v1"` and pass Gamaliel-specific parameters (like `theology_slug`, `book_id`) alongside standard parameters. The SDK automatically includes them in the request body.

**Q: Do SDKs support custom parameters and headers?**  
A: Yes! Most SDKs (including OpenAI's official SDKs) support both approaches:
- **Extra Parameters**: Pass Gamaliel-specific parameters (like `convert_scripture_links`, `theology_slug`) directly as method arguments. The SDK automatically includes them in the JSON request body via `**kwargs`.
- **Custom Headers**: Use `default_headers` (Python) or `defaultHeaders` (JavaScript) when initializing the client to set headers like `X-Convert-Scripture-Links`. Headers take precedence over body parameters. Note: Headers apply to all requests from that client instance; for per-request customization, use body parameters or create separate client instances.

**Q: Will TypeScript show errors for Gamaliel-specific parameters?**  
A: TypeScript may show warnings for unknown parameters. You can suppress them with `as any`, use `@ts-ignore`, or extend the OpenAI types. See the "TypeScript Type Safety" section above for options.

**Q: What happens if I provide an invalid `theology_slug` or `profile_slug`?**  
A: The API returns a 400 error with available options. Use `GET /v1/theologies` and `GET /v1/profiles` to see valid slugs.

**Q: Can I maintain conversation history?**  
A: Yes, include previous messages in the `messages` array (standard OpenAI pattern). The API is stateless, so you manage history client-side.

**Q: How do I disable or customize scripture links?**  
A: By default, scripture references are automatically converted to markdown links (e.g., `[Matthew 5:1-16](/read/MAT/5?verse=1-16)`). To disable this, set `convert_scripture_links: false` in the request body, or use the `X-Convert-Scripture-Links: false` header (header takes precedence). When disabled, references remain as plain text (e.g., "Matthew 5:1-16"). See the "Scripture Links Customization" section above for details and examples.

**Q: Does the API use the same prompts and tools as Gamaliel UI?**  
A: Yes! The Public API uses the exact same underlying system as the Gamaliel web application - same prompts, same tools, same guardrails, same quality. The only difference is the API interface.

**Q: What is preflight validation?**  
A: Preflight validation is a fast input categorization step that happens before requests reach the chat agent. It filters invalid inputs, improves security, and reduces costs. Support questions return blank responses, greetings return helpful messages, and malicious/inappropriate inputs are rejected with errors. You can disable it with `skip_preflight: true` if needed.

**Q: What happens when I send a support question?**  
A: Support questions (e.g., "how much does this cost?", "what is this app?") are intercepted by preflight validation and return a blank/empty response. No chat is created and the request doesn't reach the chat agent. This helps reduce costs for non-biblical questions.

**Q: What happens when I send a greeting?**  
A: Greetings (e.g., "Hi", "Hello", "Thank you") are intercepted by preflight validation and return a helpful greeting message. No chat is created and the request doesn't reach the chat agent.

**Q: Can I bypass preflight validation?**  
A: Yes, set `skip_preflight: true` in your request body. This bypasses all preflight validation and sends the request directly to the chat agent. Use this only when you're certain your inputs are valid and want to skip the validation step.
