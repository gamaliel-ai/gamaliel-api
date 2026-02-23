# Scripture Search

**Endpoint:** `GET /v1/scripture/search` or `POST /v1/scripture/search`

Semantic search for Bible content by meaning. Returns the most relevant chapters for a given query using vector similarity search.

No authentication required.

## Request

### GET

```http
GET https://api.gamaliel.ai/v1/scripture/search?q=love+your+enemies
```

### POST

```http
POST https://api.gamaliel.ai/v1/scripture/search
Content-Type: application/json

{
  "query": "love your enemies"
}
```

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` / `q` | string | **yes** | — | Search query. Use `query` in POST body, `q` in GET params. |
| `bible_id` | string | no | `"eng-web"` | Bible translation for returned text (e.g. `"eng-web"`, `"eng-us-niv"`). Note: embeddings are always `eng-web`; only the fetched text changes. |
| `limit` | integer | no | `5` | Number of results (1–20). |
| `testament` | string | no | — | Filter by testament: `"Old Testament"` or `"New Testament"`. |
| `book` | string | no | — | Filter to a specific book by name or ID (e.g. `"Genesis"`, `"GEN"`, `"Psalms"`). |

## Response

```json
{
  "results": [
    {
      "reference": "Matthew 5",
      "book": "Matthew",
      "book_id": "MAT",
      "chapter": 5,
      "text": "...",
      "similarity": 0.87
    }
  ],
  "query": "love your enemies",
  "bible_id": "eng-web",
  "total": 5,
  "type": "semantic_hybrid"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `results` | array | Matching chapters, ordered by relevance. |
| `results[].reference` | string | Human-readable reference (e.g. `"Matthew 5"`). |
| `results[].book` | string | Book name (e.g. `"Matthew"`). |
| `results[].book_id` | string | Canonical book ID (e.g. `"MAT"`). |
| `results[].chapter` | integer | Chapter number. |
| `results[].text` | string | Full chapter text in the requested translation. |
| `results[].similarity` | float | Relevance score 0–1. `1.0` for exact passage references. |
| `query` | string | The query as received. |
| `bible_id` | string | Translation used for returned text. |
| `total` | integer | Number of results returned. |
| `type` | string | `"semantic_hybrid"` for semantic search, `"direct_passage"` when the query is a specific reference. |

### Direct Passage References

If the query looks like a specific passage (e.g. `"Romans 8:28"`, `"John 3:16"`), the vector search is bypassed and the chapter is returned directly. In this case `type` is `"direct_passage"` and `similarity` is `1.0`.

## Errors

| Status | Code | Description |
|--------|------|-------------|
| `400` | `invalid_request_error` | Missing or empty `query` / `q`. |
| `400` | `invalid_parameter` | Invalid `testament` value. |
| `500` | `server_error` | Internal error during search. |

## Examples

### GET (quick, browser-friendly)

```bash
curl "https://api.gamaliel.ai/v1/scripture/search?q=the+peace+that+surpasses+understanding"
```

### POST with filters

```python
import requests

response = requests.post(
    "https://api.gamaliel.ai/v1/scripture/search",
    json={
        "query": "the Lord is my shepherd",
        "testament": "Old Testament",
        "limit": 3,
    }
)
data = response.json()
for r in data["results"]:
    print(f"{r['reference']} (similarity: {r['similarity']:.2f})")
```

### GET with all params

```bash
curl "https://api.gamaliel.ai/v1/scripture/search?q=love&testament=New+Testament&book=John&limit=5&bible_id=eng-web"
```

### JavaScript

```js
const res = await fetch("https://api.gamaliel.ai/v1/scripture/search?q=faith+hope+love");
const { results } = await res.json();
results.forEach(r => console.log(r.reference, r.similarity));
```
