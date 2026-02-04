---
title: API Documentation
layout: default
---

# Gamaliel Public API

## Overview

The Gamaliel Public API provides a **biblical OpenAI-compatible API** that allows third-parties to integrate Gamaliel's biblical chat functionality into their own applications. The API serves as a **drop-in replacement** for OpenAI's chat completions API, with optional Gamaliel-specific parameters for biblical context and theological customization.

> **🚀 Early Release - We Want Your Feedback!**  
> The Gamaliel Public API is currently in early release. We're eager to hear from you about how we can improve the API, enhance the quality of completions, and expand customizability. Your feedback helps us build a better product. Please reach out with suggestions, issues, or feature requests!

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

🤖 **For LLM-powered tools:** See [`llms.txt`](../llms.txt) for a concise API reference optimized for tools like Cursor.

## Same Intelligence as Gamaliel UI

The Public API uses the **exact same underlying system** as the Gamaliel web application:

- **Same prompts:** Uses the same prompt templates from `gamaliel-prompts` (guardrails, theology guidelines, profile instructions)
- **Same tools:** Uses the same biblical search tools (semantic search, keyword search, passage lookup)
- **Same guardrails:** Enforces the same mandatory theological guardrails
- **Same quality:** Provides the same biblical intelligence and accuracy

The only difference is the API interface - under the hood, it's the same proven system that powers Gamaliel's web application.

## Quick Start

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
    theology="default",
    profile="universal_explorer"
)

print(response.choices[0].message.content)
```

## Documentation

### Getting Started

- [Overview](index.md) - Full API overview
- [Authentication](authentication.md) - BYOK (Bring Your Own Key) authentication
- [Quick Start Examples](examples/quick-start.md) - Get started in minutes

### API Endpoints

- [Chat Completions](endpoints/chat-completions.md) - Main endpoint for biblical chat (`POST /v1/chat/completions`)
- [List Theologies](endpoints/theologies.md) - Get available theology options (`GET /v1/theologies`)
- [List Profiles](endpoints/profiles.md) - Get available profile options (`GET /v1/profiles`)

### Examples

- [Python SDK Examples](examples/python-sdk.md) - Python examples with OpenAI SDK
- [JavaScript SDK Examples](examples/javascript-sdk.md) - JavaScript/TypeScript examples
- [Raw HTTP Examples](examples/raw-http.md) - Examples using raw HTTP requests
- [Advanced Examples](examples/advanced.md) - Scripture context, custom instructions, and more

### Guides

- [Customizing Responses](guides/customizing-responses/) - Detailed guide for customizing responses with system messages (Discord bots, counseling apps, youth groups, etc.)
- [Testing with Open WebUI](guides/testing-with-open-webui/) - Manual testing guide

### Reference

- [Error Responses](errors.md) - API error codes and responses

## Stateless Operation

The API is **stateless** - each request is independent:

- No `chat_id` parameter
- No chat history between requests
- No database persistence of chats or messages
- Each request is processed independently

You can maintain your own conversation history by including previous messages in the `messages` array (standard OpenAI pattern).

## Security Considerations

- OpenAI keys are never persisted, logged, or tracked
- System messages always include mandatory theological guardrails
- User-provided system messages are appended but cannot override guardrails
- No authentication required beyond BYOK (no Gamaliel API keys)
- Stateless operation prevents data leakage between requests

## Frequently Asked Questions

### General

**Q: Why OpenAI-compatible format?**  
A: Familiarity and tool interchangeability. You can use existing OpenAI SDKs and tools with minimal changes. Just add Gamaliel-specific parameters for biblical context.

**Q: Why is BYOK required?**  
A: Simplifies integration, gives you control over costs, and ensures privacy. Future versions may support other providers (Anthropic, etc.).

**Q: Can I use this as a drop-in replacement for OpenAI?**  
A: Mostly yes, with one important limitation: Gamaliel does not support `tools` or `function_calling` parameters. For standard chat completions, you can use OpenAI format with optional Gamaliel parameters. If you don't provide Gamaliel-specific params, it works like OpenAI but with biblical guardrails. However, if you need custom tool execution or function calling, you'll need to use OpenAI's API directly. See [Limitations](endpoints/chat-completions.md#limitations) for details.

**Q: Can I use the official OpenAI SDKs?**  
A: Yes! The official OpenAI Python and JavaScript SDKs work perfectly. Just set `base_url="https://api.gamaliel.ai/v1"` and pass Gamaliel-specific parameters (like `theology`, `book_id`) alongside standard parameters. The SDK automatically includes them in the request body.

**Q: Does the API use the same prompts and tools as Gamaliel UI?**  
A: Yes! The Public API uses the exact same underlying system as the Gamaliel web application - same prompts, same tools, same guardrails, same quality. The only difference is the API interface.

### Chat Completions

**Q: How do system messages work?**  
A: Mandatory Gamaliel guardrails + theology + profile are always included. User-provided `system` role messages in the messages array are appended for tone/format customization but cannot override guardrails. Multiple system messages are concatenated together. See [System Messages](endpoints/chat-completions.md#system-messages) for details.

**Q: Do SDKs support custom parameters?**  
A: Yes! Most SDKs (including OpenAI's official SDKs) support custom parameters. Pass Gamaliel-specific parameters (like `disable_scripture_links`, `theology`) directly as method arguments. The SDK automatically includes them in the JSON request body via `**kwargs`.

**Q: Will TypeScript show errors for Gamaliel-specific parameters?**  
A: TypeScript may show warnings for unknown parameters. You can suppress them with `as any`, use `@ts-ignore`, or extend the OpenAI types. See [TypeScript Type Safety](examples/javascript-sdk.md#typescript-type-safety) for options.

**Q: What happens if I provide an invalid `theology` or `profile`?**  
A: The API returns a 400 error with available options. Use `GET /v1/theologies` and `GET /v1/profiles` to see valid slugs.

**Q: Can I maintain conversation history?**  
A: Yes, include previous messages in the `messages` array (standard OpenAI pattern). The API is stateless, so you manage history client-side. See [Conversation History](examples/advanced.md#conversation-history) for examples.

**Q: How do I disable scripture links?**  
A: By default, scripture references are automatically converted to markdown links that point to the Gamaliel reader (e.g., `[Matthew 5:1-16](/read/MAT/5?verse=1-16)`). To disable this, set `disable_scripture_links: true` in the request body. When disabled, references remain as plain text without links (e.g., "Matthew 5:1-16"). See [Disabling Scripture Links](endpoints/chat-completions.md#disabling-scripture-links) for details and examples.

**Q: What is preflight validation?**  
A: Preflight validation is a fast input categorization step that happens before requests reach the chat agent. It filters invalid inputs, improves security, and reduces costs. Support questions return blank responses, greetings return helpful messages, and malicious/inappropriate inputs are rejected with errors. You can disable it with `skip_preflight: true` if needed. See [Preflight Validation](endpoints/chat-completions.md#preflight-validation) for details.

**Q: What happens when I send a support question?**  
A: Support questions (e.g., "how much does this cost?", "what is this app?") are intercepted by preflight validation and return a blank/empty response. No chat is created and the request doesn't reach the chat agent. This helps reduce costs for non-biblical questions.

**Q: What happens when I send a greeting?**  
A: Greetings (e.g., "Hi", "Hello", "Thank you") are intercepted by preflight validation and return a helpful greeting message. No chat is created and the request doesn't reach the chat agent.

**Q: Can I bypass preflight validation?**  
A: Yes, set `skip_preflight: true` in your request body. This bypasses all preflight validation and sends the request directly to the chat agent. Use this only when you're certain your inputs are valid and want to skip the validation step. See [Disabling Preflight Validation](examples/advanced.md#disabling-preflight-validation) for examples.

**Q: Does the API support tools or function calling?**  
A: No. The Gamaliel API does not support OpenAI's `tools` or `function_calling` parameters. Gamaliel handles all tool usage internally (biblical search, passage lookup, etc.) and returns the final answer directly. You cannot build agents that use custom tools or function calling. See [Limitations](endpoints/chat-completions.md#limitations) for details.
