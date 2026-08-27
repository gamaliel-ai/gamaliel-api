# Gamaliel Public API

**OpenAI-compatible Biblical Chat API (optional BYOK, or hosted key with rate limits)**

The Gamaliel Public API provides a biblical OpenAI-compatible API that allows third-parties to integrate Gamaliel's biblical chat functionality into their own applications. The API matches OpenAI's chat completions request/response shape, with optional Gamaliel-specific parameters for biblical context and theological customization.

**Authentication is optional.** **BYOK** (your OpenAI or Anthropic key, matching `model`) has no Gamaliel IP cap. Omit `Authorization` to use a **hosted** OpenAI key: **3 requests/minute/IP**, with **no availability guarantees** (we may tighten or shut off hosted access if we detect abuse). Default `model` is **gpt-5.6-luna**.

## Base URL

```
https://api.gamaliel.ai
```

## Quick Start

```python
from openai import OpenAI

client = OpenAI(
    api_key="sk-...",  # Optional BYOK OpenAI key; omit Authorization for hosted (3/min/IP)
    base_url="https://api.gamaliel.ai/v1"
)

response = client.chat.completions.create(
    model="gpt-5.6-luna",
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
- ✅ **Optional BYOK** (OpenAI and Anthropic) or hosted OpenAI key with IP rate limits
- ✅ Streaming and non-streaming support
- ✅ Stateless operation (no chat persistence)
- ✅ Same prompts, tools, and biblical intelligence as Gamaliel UI

## Examples

See the [`examples/`](examples/) directory for complete code samples in Python and JavaScript.

## License

MIT License - see [LICENSE](LICENSE) for details.
