# List Theologies

**Endpoint:** `GET /v1/theologies`

Returns list of available theology slugs for use in chat requests.

## Request

```http
GET https://api.gamaliel.ai/v1/theologies
```

No authentication required for this endpoint.

## Response

```json
{
  "theologies": [
    {
      "slug": "default",
      "name": "Default (Ecumenical)",
      "description": "A broad, ecumenical Christian perspective that emphasizes core Christian doctrines shared across traditions.",
      "is_default": true
    },
    {
      "slug": "reformed",
      "name": "Reformed",
      "description": "Calvinist theology emphasizing God's sovereignty, predestination, and the authority of Scripture.",
      "is_default": false
    },
    {
      "slug": "catholic",
      "name": "Roman Catholic",
      "description": "Roman Catholic perspective emphasizing tradition, sacraments, and magisterial authority.",
      "is_default": false
    }
  ]
}
```

## Usage

Use the `slug` value from the response in the `theology_slug` parameter when making chat completion requests. See [Chat Completions](chat-completions.md) for details.

## Example

```python
import requests

response = requests.get('https://api.gamaliel.ai/v1/theologies')
theologies = response.json()

for theology in theologies['theologies']:
    print(f"{theology['slug']}: {theology['name']}")
```
