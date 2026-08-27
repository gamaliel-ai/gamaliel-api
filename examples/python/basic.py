"""
Basic example: Non-streaming chat completion with Gamaliel API (OpenAI BYOK).

For Anthropic: use api_key="sk-ant-..." and model="anthropic/<id>" from GET /v1/models.
"""
from openai import OpenAI

# Initialize client with Gamaliel base URL
client = OpenAI(
    api_key="sk-...",  # Your OpenAI API key (required)
    base_url="https://api.gamaliel.ai/v1"
)

# Standard OpenAI call with Gamaliel-specific parameters
response = client.chat.completions.create(
    model="gpt-5.6-luna",
    messages=[
        {"role": "user", "content": "What does the Bible say about forgiveness?"}
    ],
    stream=False,
    # Gamaliel-specific parameters - SDK passes these through automatically
    theology="reformed",
    profile="universal_explorer",
    book_id="MAT",
    chapter=6,
    verses=[14, 15],
    max_words=300
)

print(response.choices[0].message.content)
print(f"\nTokens used: {response.usage.total_tokens}")
