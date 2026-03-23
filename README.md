# Gamaliel Public API

**OpenAI-compatible Biblical Chat API (OpenAI & Anthropic BYOK)**

The Gamaliel Public API provides a biblical OpenAI-compatible API that allows third-parties to integrate Gamaliel's biblical chat functionality into their own applications. The API matches OpenAI's chat completions request/response shape, with optional Gamaliel-specific parameters for biblical context and theological customization. **Bring your own OpenAI or Anthropic key** — the key must match the model provider (`gpt-4.1-mini` / `openai/...` vs `anthropic/...`).

## Base URL

```
https://api.gamaliel.ai
```

## Quick Start

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-...",  # Your OpenAI API key (required)
    base_url="https://api.gamaliel.ai/v1"
)

response = client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[
        {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ],
    theology="default",
    profile="universal_explorer"
)

print(response.choices[0].message.content)
```

## Documentation

📖 **[Full API Documentation →](docs/index.md)**

🤖 **[llms.txt](llms.txt)** - Concise API reference for LLM-powered tools (Cursor, etc.)

## Key Features

- ✅ OpenAI-compatible request/response format (use official OpenAI SDKs with Gamaliel `base_url`)
- ✅ **OpenAI and Anthropic (Claude) BYOK**
- ✅ Streaming and non-streaming support
- ✅ Stateless operation (no chat persistence)
- ✅ Same prompts, tools, and biblical intelligence as Gamaliel UI

## Examples

See the [`examples/`](examples/) directory for complete code samples in Python and JavaScript.

## License

MIT License - see [LICENSE](LICENSE) for details.
