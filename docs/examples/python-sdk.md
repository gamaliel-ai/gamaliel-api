# Python SDK Examples

Examples using the official OpenAI Python SDK with the Gamaliel API.

## Basic Usage

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
    theology="reformed",
    profile="universal_explorer",
    book_id="MAT",
    chapter=6,
    verses=[14, 15],
    max_words=300
)

print(response.choices[0].message.content)
print(f"Tokens used: {response.usage.total_tokens}")
```

## Streaming

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
    theology="default",
    book_id="MAT",
    chapter=6
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")
```

## With Scripture Context

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
    theology="reformed"
)

print(response.choices[0].message.content)
```

## With Custom System Instructions

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

## Disabling Scripture Links

By default, scripture references are automatically converted to markdown links that point to the Gamaliel reader (e.g., `[Matthew 5:1-16](/read/MAT/5?verse=1-16)`). To disable this and get plain text references instead, set `disable_scripture_links=True`:

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
    disable_scripture_links=True  # Disable automatic link conversion
)

print(response.choices[0].message.content)
# Output: "The Bible teaches that forgiveness is central... In Matthew 6:14-15, Jesus says..."
# (plain text references, no markdown links)
```
