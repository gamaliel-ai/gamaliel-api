# List Translations

**Endpoint:** `GET /v1/translations`

Returns list of available Bible translation IDs for use in chat and scripture search requests.

## Request

```http
GET https://api.gamaliel.ai/v1/translations
```

No authentication required for this endpoint.

## Response

```json
{
  "translations": [
    {
      "id": "eng-web",
      "name": "World English Bible",
      "abbreviation": "WEB",
      "description": "A public domain modern English translation",
      "language": "English",
      "language_code": "eng",
      "is_default": true
    },
    {
      "id": "eng-kjv",
      "name": "King James Version",
      "abbreviation": "KJV",
      "description": "The King James Version, originally published in 1611",
      "language": "English",
      "language_code": "eng",
      "is_default": false
    },
    {
      "id": "spa-niv-2022",
      "name": "Nueva Versión Internacional",
      "abbreviation": "NVI",
      "description": "Nueva Versión Internacional® NVI® 2022",
      "language": "Español",
      "language_code": "spa",
      "is_default": false
    }
  ]
}
```

## Usage

Use the `id` value from the response in the `bible_id` parameter when making chat completion or scripture search requests. See [Chat Completions](chat-completions.md) and [Scripture Search](scripture-search.md) for details.

## Example

```python
import requests

response = requests.get('https://api.gamaliel.ai/v1/translations')
translations = response.json()

for translation in translations['translations']:
    print(f"{translation['id']}: {translation['name']} ({translation['abbreviation']})")
```
