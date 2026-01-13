# Testing with Open WebUI

Open WebUI is a popular open-source chat interface that can be used to manually test the Gamaliel Public API. It provides a user-friendly interface similar to ChatGPT.

## Quick Setup

1. **Install Docker Desktop** (if not already installed)

2. **Create a directory for Open WebUI:**
   ```bash
   mkdir open-webui-gamaliel
   cd open-webui-gamaliel
   ```

3. **Create `docker-compose.yml`:**
   ```yaml
   services:
     open-webui:
       image: ghcr.io/open-webui/open-webui:main
       container_name: open-webui
       ports:
         - "3000:8080"
       environment:
         - OPENAI_API_BASE_URL=https://api.gamaliel.ai/v1
       restart: unless-stopped
       volumes:
         - open-webui-data:/app/backend/data

   volumes:
     open-webui-data:
   ```

4. **Start Open WebUI:**
   ```bash
   docker-compose up -d
   ```

5. **Access Open WebUI:**
   - Open http://localhost:3000 in your browser
   - Sign in or create an account

6. **Configure API Connection:**
   - Go to **Admin Panel → Settings → Connections**
   - Enable the **"Direct Connections"** toggle
   - Click the gear icon next to "Manage OpenAI API Connections"
   - Add/edit connection:
     - **API Base URL:** `https://api.gamaliel.ai/v1`
     - Save the connection

7. **Configure Your API Key:**
   - Go to **Settings** (user menu in top right)
   - Add your OpenAI API key
   - Select a model from the dropdown (e.g., `gpt-4o-mini`)

8. **Test:**
   - Start a new chat
   - Ask a biblical question (e.g., "What does the Bible say about forgiveness?")
   - Verify the response includes biblical citations and context

## Useful Commands

**View logs:**
```bash
docker-compose logs -f
```

**Stop:**
```bash
docker-compose down
```

**Stop and reset data:**
```bash
docker-compose down -v
```

## Notes

- Open WebUI uses Direct Connections mode, so each user provides their own OpenAI API key
- The API Base URL should be `https://api.gamaliel.ai/v1` (production) or `http://host.docker.internal:8000/v1` (local development)
- Models are automatically fetched from `/v1/models` endpoint
