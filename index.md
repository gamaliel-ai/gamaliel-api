---
title: Gamaliel Public API
layout: default
---

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

- [Full Documentation](docs/index.md) - Complete API documentation
- [Quick Start Examples](docs/examples/quick-start.md) - Get started in minutes
- [Authentication](docs/authentication.md) - BYOK (Bring Your Own Key) authentication

### API Endpoints

- [Chat Completions](docs/endpoints/chat-completions.md) - Main endpoint for biblical chat (`POST /v1/chat/completions`)
- [List Theologies](docs/endpoints/theologies.md) - Get available theology options (`GET /v1/theologies`)
- [List Profiles](docs/endpoints/profiles.md) - Get available profile options (`GET /v1/profiles`)

### Examples

- [Python SDK Examples](docs/examples/python-sdk.md) - Python examples with OpenAI SDK
- [JavaScript SDK Examples](docs/examples/javascript-sdk.md) - JavaScript/TypeScript examples
- [Raw HTTP Examples](docs/examples/raw-http.md) - Examples using raw HTTP requests
- [Advanced Examples](docs/examples/advanced.md) - Scripture context, custom instructions, and more

### Guides

- [Testing with Open WebUI](docs/guides/testing-with-open-webui.md) - Manual testing guide

### Reference

- [Error Responses](docs/errors.md) - API error codes and responses
- [FAQ](docs/index.md#frequently-asked-questions) - Frequently asked questions

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

## Questions?

See the [FAQ](docs/index.md#frequently-asked-questions) for answers to common questions about the API, SDKs, parameters, and more.
