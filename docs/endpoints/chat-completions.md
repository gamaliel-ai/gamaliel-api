---
title: Chat Completions
layout: default
---

# Chat Completions

**Endpoint:** `POST /v1/chat/completions`

**OpenAI-Compatible Format** with Gamaliel extensions for biblical context and theological customization.

🤖 **Quick Reference:** See [`llms.txt`](../../llms.txt) for a concise API reference optimized for LLM-powered tools.

## Request

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
  "profile": "universal_explorer",  // Optional profile slug
  "theology": "default",  // Optional theology slug
  "max_words": 300,  // Optional response length limit in words
  "system_instructions": "You are speaking to high school students. Keep responses concise and practical."  // Optional tone/format instructions
}
```

## Response

### Non-Streaming Response

When `stream: false` or omitted:

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

### Streaming Response

When `stream: true`, uses OpenAI-compatible Server-Sent Events format:

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4o-mini","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4o-mini","choices":[{"index":0,"delta":{"content":" Bible"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4o-mini","choices":[{"index":0,"delta":{"content":" teaches"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1234567890,"model":"gpt-4o-mini","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
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
- `profile` (string): Pre-defined profile slug (e.g., `"universal_explorer"`, `"mature_believer"`). Defaults to `"universal_explorer"`. Use `GET /v1/profiles` to see available options.
- `theology` (string): Theological perspective (e.g., `"default"`, `"reformed"`, `"catholic"`). Defaults to `"default"`. Use `GET /v1/theologies` to see available options.
- `max_words` (integer): Maximum response length in words. Defaults to 300
- `system_instructions` (string): Optional tone/format instructions (e.g., `"You are speaking to high school students. Keep responses concise."`). These are appended to the mandatory system message
- `disable_scripture_links` (boolean, optional): Whether to disable scripture link conversion. Defaults to `false`. When `false` (default), references like "Matthew 5:1-16" are converted to `[Matthew 5:1-16](/read/MAT/5?verse=1-16)` which links to the Gamaliel reader. When `true`, references remain as plain text without links.
- `skip_preflight` (boolean, optional): Whether to skip preflight validation. Defaults to `false`. When `true`, bypasses input validation and categorization. See "Preflight Validation" section below for details.

## Limitations

### Tools/Function Calling Not Supported

**The Gamaliel API does not support OpenAI's `tools` or `function_calling` parameters.** 

Gamaliel handles all tool usage internally (including biblical search, passage lookup, semantic search, etc.) and returns the final answer directly to you. You cannot build agents that use custom tools or function calling with the Gamaliel API.

**How Gamaliel Works:**
- Gamaliel's internal agent uses tools to search scripture, look up passages, and gather biblical context
- All tool execution happens server-side before the response is sent
- You receive the final answer with all relevant scripture references already included
- No tool calls or function invocations are exposed in the API response

**What This Means:**
- ✅ You can ask biblical questions and get complete answers with scripture citations
- ✅ Gamaliel automatically finds and includes relevant Bible passages
- ❌ You cannot provide your own tools or functions for the model to call
- ❌ You cannot build multi-step agent workflows that require tool execution
- ❌ You cannot intercept or modify tool calls before they execute

**Why This Design?**
Gamaliel is designed as a **complete biblical intelligence system** rather than a raw LLM wrapper. By handling all tool execution internally, Gamaliel ensures:
- Consistent biblical accuracy and theological guardrails
- Optimal tool selection and execution
- Simplified integration (no need to handle tool calls)
- Better performance (tools execute in parallel server-side)

If you need custom tool execution or agent workflows, consider using OpenAI's API directly with your own tool implementations.

## Disabling Scripture Links

By default, the API automatically converts scripture references (e.g., "Matthew 5:1-16", "Genesis 1:1") into markdown links that point to the Gamaliel reader (e.g., `[Matthew 5:1-16](/read/MAT/5?verse=1-16)`). You can disable this behavior using the `disable_scripture_links` body parameter:

```json
{
  "messages": [...],
  "disable_scripture_links": true
}
```

- `false` (default): Scripture references are converted to markdown links pointing to the Gamaliel reader (e.g., `[Matthew 5:1-16](/read/MAT/5?verse=1-16)`)
- `true`: Scripture references remain as plain text without links (e.g., "Matthew 5:1-16")

### When to Disable Scripture Links

- You want plain text references without markdown formatting
- You're building your own link conversion logic
- You're integrating with systems that don't support markdown links
- You want to process references yourself before displaying

**See Examples:**
- [Disabling Scripture Links (Python)](../examples/python-sdk.md#disabling-scripture-links)
- [Disabling Scripture Links (JavaScript)](../examples/javascript-sdk.md#disabling-scripture-links)
- [Disabling Scripture Links (Raw HTTP)](../examples/raw-http.md#disabling-scripture-links-python-requests)

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

**See Examples:**
- [Disabling Preflight Validation](../examples/advanced.md#disabling-preflight-validation)

## System Messages

The API automatically constructs a comprehensive system message that combines:

### 1. Mandatory Core (Always Included)

- **Theological Guardrails**: Core Christian doctrines and guardrails against common errors
- **Theology Guidelines**: Instructions from the selected theology (via `theology`)
- **Profile Instructions**: Instructions from the selected profile (via `profile`)

### 2. Optional User Instructions

If `system_instructions` is provided, it's appended to the core system message. This allows you to customize tone, format, and audience-specific guidance without overriding theological guardrails.

**Important:** User-provided `system_instructions` cannot override or contradict the mandatory theological guardrails. They are purely additive for tone, format, and audience-specific guidance.

### Use Case Examples

#### Example 1: Christian Youth Group

**Scenario:** Speaking to high school students in a Christian youth group who are familiar with basic Bible stories but may struggle with applying biblical principles.

```json
{
  "messages": [
    {"role": "user", "content": "What does the Bible say about peer pressure?"}
  ],
  "system_instructions": "You are speaking to high school students (ages 14-18) in a Christian youth group. They are familiar with basic Bible stories but may struggle with applying biblical principles to their daily lives. Use relatable examples, avoid theological jargon, and focus on practical application."
}
```

#### Example 2: Atheist or Bible-Skeptical Youth

**Scenario:** Engaging with an atheist youth or someone who is skeptical about the Bible. Use accessible language, avoid religious jargon, and present biblical content in a way that's respectful of their perspective.

```json
{
  "messages": [
    {"role": "user", "content": "Why do Christians believe in God?"}
  ],
  "system_instructions": "You are speaking to a young person (ages 16-25) who is atheist or skeptical about the Bible. They may have questions about Christianity but are not familiar with religious language or concepts. Use normal, everyday language. Avoid theological jargon. Explain biblical concepts naturally, as if explaining to a friend. Still search Scripture to find the most biblical content related to the question, but express it in accessible language. Be respectful of their perspective while presenting biblical truth clearly."
}
```

**For even more accessible responses** (no book names or citations):

```json
{
  "messages": [
    {"role": "user", "content": "Why do Christians believe in God?"}
  ],
  "system_instructions": "**OUTPUT FORMATTING:**\n- Do NOT quote Scripture passages verbatim\n- Do NOT mention specific book names (e.g., 'John', 'Romans', 'Psalm')\n- Do NOT include chapter numbers or verse citations (e.g., 'John 3:16', 'Romans 8:28')\n- Answer in normal, everyday language as if explaining to a friend\n- Use the biblical content you find to inform your answer, but express it naturally in your own words\n- You may mention 'The Bible' or 'biblical teaching' but do not cite specific books or passages\n\n**LANGUAGE AND APPROACH:**\n- Use normal, conversational language\n- Explain concepts without assuming prior biblical knowledge\n- Present ideas naturally, as if explaining to a friend\n- Still search Scripture to find the most biblical content related to the question\n- Express biblical concepts in everyday language without quoting passages verbatim or mentioning book names"
}
```

#### Example 3: Minimal Scripture References

**Scenario:** You want concise answers with minimal Scripture citations (one or two key passages maximum, no extensive cross-references).

```json
{
  "messages": [
    {"role": "user", "content": "What is love?"}
  ],
  "system_instructions": "**RESPONSE STRUCTURE:**\n1. Answer directly and concisely\n2. Focus on the core concept - keep references minimal\n3. Explain the meaning clearly\n4. Apply practically\n\n**OUTPUT FORMATTING:**\n- When referencing Scripture you find, keep it minimal - focus on one or two key passages\n- Do not include extensive cross-references or multiple Scripture passages\n- Do not draw extensive connections between multiple biblical passages\n- Keep the answer focused and concise"
}
```

#### Example 4: Academic or Theological Context

**Scenario:** Speaking to someone with theological training who wants deeper analysis and cross-references.

```json
{
  "messages": [
    {"role": "user", "content": "Explain the doctrine of justification by faith"}
  ],
  "system_instructions": "You are speaking to someone with theological training. They are familiar with biblical concepts, theological terminology, and church history. Provide thorough analysis with multiple Scripture references and cross-references. Draw connections between passages and explain theological nuances. Use appropriate theological terminology."
}
```

#### Example 5: Children or Early Readers

**Scenario:** Speaking to young children (ages 6-12) who need simple language and concrete examples.

```json
{
  "messages": [
    {"role": "user", "content": "What does the Bible say about sharing?"}
  ],
  "system_instructions": "You are speaking to children (ages 6-12). Use simple, concrete language. Avoid abstract concepts. Use stories and examples they can relate to. Keep responses short (under 150 words). Focus on one main idea. Use words they understand."
}
```

#### Example 6: New Believers

**Scenario:** Speaking to someone who recently became a Christian and is learning the basics.

```json
{
  "messages": [
    {"role": "user", "content": "What should I do now that I'm a Christian?"}
  ],
  "system_instructions": "You are speaking to a new believer who recently became a Christian. They are excited but may feel overwhelmed. Explain concepts clearly without assuming prior knowledge. Use encouraging, supportive language. Focus on practical next steps. Avoid theological jargon, but introduce basic terms when helpful. Be patient and clear."
}
```

### What `system_instructions` Can Do

✅ **Customize tone and style** (formal, casual, academic, conversational)  
✅ **Specify audience** (children, youth, adults, skeptics, new believers)  
✅ **Control response length** (though `max_words` parameter is more direct)  
✅ **Format preferences** (minimal citations, no book names, extensive cross-references)  
✅ **Language level** (simple, technical, accessible)  
✅ **Context-specific guidance** (youth group, academic setting, personal counseling)

### What `system_instructions` Cannot Do

❌ **Override theological guardrails** - Core Christian doctrines are always enforced  
❌ **Change biblical content** - Scripture references and biblical accuracy are maintained  
❌ **Remove safety filters** - Content moderation and theological guardrails remain active  
❌ **Alter tool behavior** - Biblical search, passage lookup, and other tools work the same way

**See Examples:**
- [Custom System Instructions](../examples/advanced.md#custom-system-instructions)
- [Customizing Responses Guide](../guides/customizing-responses.md) - Comprehensive guide with detailed examples for Discord bots, counseling apps, and more

## Examples

### Quick Start
- [Quick Start Examples](../examples/quick-start.md) - Get started in minutes

### SDK Examples
- [Python SDK Examples](../examples/python-sdk.md) - Python examples with OpenAI SDK
- [JavaScript/TypeScript SDK Examples](../examples/javascript-sdk.md) - JavaScript/TypeScript examples with OpenAI SDK

### Raw HTTP Examples
- [Raw HTTP Examples](../examples/raw-http.md) - Examples using raw HTTP requests

### Advanced Examples
- [Advanced Examples](../examples/advanced.md) - Scripture context, custom instructions, conversation history, and more

### Testing
- [Testing with Open WebUI](../guides/testing-with-open-webui.md) - Manual testing guide

## Using Official OpenAI SDKs

The Gamaliel API is designed as a **drop-in replacement** for OpenAI's API. You can use the official OpenAI SDKs (Python, JavaScript, etc.) with minimal changes - just set the `base_url` and include Gamaliel-specific parameters.

**Key Points:**
- All standard OpenAI parameters work exactly as expected
- Gamaliel-specific parameters (`theology`, `book_id`, etc.) are passed through automatically
- The SDK serializes all parameters to JSON, including custom ones
- TypeScript may show warnings for unknown fields (see TypeScript section in [JavaScript SDK Examples](../examples/javascript-sdk.md#typescript-type-safety))

**How SDKs Handle Custom Parameters:**

Most SDKs (including OpenAI's official SDKs) support custom parameters via extra parameters in method calls. The OpenAI SDK accepts `**kwargs` and automatically includes any extra parameters in the JSON request body. This means Gamaliel-specific parameters like `theology`, `disable_scripture_links`, etc. are automatically passed through without any special handling.

## Related Documentation

- [Authentication](../authentication.md) - BYOK (Bring Your Own Key) authentication
- [Error Responses](../errors.md) - API error codes and responses
- [List Theologies](theologies.md) - Get available theology options
- [List Profiles](profiles.md) - Get available profile options
