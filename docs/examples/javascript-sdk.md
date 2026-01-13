# JavaScript/TypeScript SDK Examples

Examples using the official OpenAI JavaScript/TypeScript SDK with the Gamaliel API.

## Basic Usage

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

## Streaming

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

## With Custom System Instructions

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

## Disabling Scripture Links

### Using Body Parameter

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

### Using Custom Headers

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

## TypeScript Type Safety

TypeScript will show warnings for unknown parameters. You have several options:

### Option 1: Type assertion (simplest)

```typescript
const response = await openai.chat.completions.create({
  // ... standard params
  theology_slug: 'reformed',  // TypeScript warning
} as any);  // Suppress warning
```

### Option 2: Extend the types

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
  convert_scripture_links?: boolean;
  skip_preflight?: boolean;
}

const response = await openai.chat.completions.create({
  // ... params
  theology_slug: 'reformed',  // No warning!
} as GamalielChatCompletionCreateParams);
```

### Option 3: Use @ts-ignore

```typescript
// @ts-ignore - Gamaliel-specific parameters
const response = await openai.chat.completions.create({
  // ... params
  theology_slug: 'reformed',
});
```

**Note:** When using `defaultHeaders`, the headers apply to all requests from that client instance. For per-request header customization, use body parameters or create separate client instances.
