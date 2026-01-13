# Setup Instructions

## Next Steps

### 1. Create GitHub Repository

1. Go to https://github.com/organizations/gamaliel-ai/repositories/new
2. Repository name: `gamaliel-api`
3. Description: "Public API documentation for Gamaliel - OpenAI-compatible Biblical Chat API"
4. Visibility: **Public**
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### 2. Push Local Repository to GitHub

```bash
cd gamaliel-api
git remote add origin https://github.com/gamaliel-ai/gamaliel-api.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to repository Settings → Pages
2. Source: Deploy from branch `main`
3. Folder: `/ (root)` or `/docs` (depending on your preference)
4. Click "Save"
5. Your docs will be available at `https://gamaliel-ai.github.io/gamaliel-api/`

### 4. Update Submodule Reference (if needed)

If the submodule was added before the GitHub repo existed, you may need to update it:

```bash
cd /Users/cirne/dev/gamaliel-web
git submodule update --init --recursive
```

### 5. Commit Submodule Addition to Main Repo

```bash
cd /Users/cirne/dev/gamaliel-web
git add .gitmodules gamaliel-api
git commit -m "chore: add gamaliel-api submodule for public API docs"
git push
```

## Repository Structure

```
gamaliel-api/
├── README.md              # Overview + quick start
├── LICENSE                # MIT License
├── _config.yml            # Jekyll config for GitHub Pages
├── docs/
│   └── index.md           # Full API documentation
└── examples/
    ├── python/            # Python examples
    └── javascript/        # JavaScript examples
```

## Future Workflow

When updating API docs:

1. Edit files in `gamaliel-api/` directory
2. Commit and push to the submodule:
   ```bash
   cd gamaliel-api
   git add .
   git commit -m "docs: update API documentation"
   git push
   ```
3. Update submodule reference in main repo:
   ```bash
   cd ..
   git add gamaliel-api
   git commit -m "chore: update api docs"
   git push
   ```
