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
    theology_slug="default",
    profile_slug="universal_explorer"
)

print(response.choices[0].message.content)
```

## Documentation

### Getting Started

- [Overview](docs/index.md) - Full API overview
- [Authentication](docs/authentication.md) - BYOK (Bring Your Own Key) authentication

### API Endpoints

- [Chat Completions](docs/endpoints/chat-completions.md) - Main endpoint for biblical chat (`POST /v1/chat/completions`)
- [List Theologies](docs/endpoints/theologies.md) - Get available theology options (`GET /v1/theologies`)
- [List Profiles](docs/endpoints/profiles.md) - Get available profile options (`GET /v1/profiles`)

### Reference

- [Error Responses](docs/errors.md) - API error codes and responses

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
- User-provided `system_instructions` cannot override guardrails
- No authentication required beyond BYOK (no Gamaliel API keys)
- Stateless operation prevents data leakage between requests

## Questions & Answers

**Q: Why OpenAI-compatible format?**  
A: Familiarity and tool interchangeability. You can use existing OpenAI SDKs and tools with minimal changes. Just add Gamaliel-specific parameters for biblical context.

**Q: Why is BYOK required?**  
A: Simplifies integration, gives you control over costs, and ensures privacy. Future versions may support other providers (Anthropic, etc.).

**Q: Can I use this as a drop-in replacement for OpenAI?**  
A: Yes! Use standard OpenAI format with optional Gamaliel parameters. If you don't provide Gamaliel-specific params, it works like OpenAI but with biblical guardrails.

**Q: Can I use the official OpenAI SDKs?**  
A: Yes! The official OpenAI Python and JavaScript SDKs work perfectly. Just set `base_url="https://api.gamaliel.ai/v1"` and pass Gamaliel-specific parameters (like `theology_slug`, `book_id`) alongside standard parameters. The SDK automatically includes them in the request body.

**Q: Does the API use the same prompts and tools as Gamaliel UI?**  
A: Yes! The Public API uses the exact same underlying system as the Gamaliel web application - same prompts, same tools, same guardrails, same quality. The only difference is the API interface.
