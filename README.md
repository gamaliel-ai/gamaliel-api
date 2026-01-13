# Gamaliel Public API

**OpenAI-compatible Biblical Chat API**

The Gamaliel Public API provides a biblical OpenAI-compatible API that allows third-parties to integrate Gamaliel's biblical chat functionality into their own applications. The API serves as a drop-in replacement for OpenAI's chat completions API, with optional Gamaliel-specific parameters for biblical context and theological customization.

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

📖 **[Full API Documentation →](docs/index.md)**

## Key Features

- ✅ OpenAI-compatible request/response format
- ✅ Streaming and non-streaming support
- ✅ Stateless operation (no chat persistence)
- ✅ BYOK (Bring Your Own Key) - you provide your own OpenAI API key
- ✅ Same prompts, tools, and biblical intelligence as Gamaliel UI

## Examples

See the [`examples/`](examples/) directory for complete code samples in Python and JavaScript.

## License

MIT License - see [LICENSE](LICENSE) for details.
