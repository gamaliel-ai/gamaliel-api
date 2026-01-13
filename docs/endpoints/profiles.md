# List Profiles

**Endpoint:** `GET /v1/profiles`

Returns list of available profile slugs for use in chat requests.

## Request

```http
GET https://api.gamaliel.ai/v1/profiles
```

No authentication required for this endpoint.

## Response

```json
{
  "profiles": [
    {
      "slug": "universal_explorer",
      "name": "Universal Explorer",
      "description": "Exploring life's big questions, open to biblical wisdom",
      "experience_level": 1,
      "is_default": true
    },
    {
      "slug": "curious_explorer",
      "name": "Curious Explorer",
      "description": "Never read the Bible, curious about faith",
      "experience_level": 0,
      "is_default": false
    },
    {
      "slug": "mature_believer",
      "name": "Mature Believer",
      "description": "Studies Bible daily, seeks advanced theological insights",
      "experience_level": 5,
      "is_default": false
    }
  ]
}
```

## Usage

Use the `slug` value from the response in the `profile_slug` parameter when making chat completion requests. See [Chat Completions](chat-completions.md) for details.

## Example

```python
import requests

response = requests.get('https://api.gamaliel.ai/v1/profiles')
profiles = response.json()

for profile in profiles['profiles']:
    print(f"{profile['slug']}: {profile['name']} (Level {profile['experience_level']})")
```
