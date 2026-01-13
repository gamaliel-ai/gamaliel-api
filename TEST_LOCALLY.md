# Testing Locally

## Option 1: Using Docker (Recommended - No Ruby version issues)

```bash
docker run --rm \
  -v "$PWD":/srv/jekyll \
  -p 4000:4000 \
  jekyll/jekyll:4 \
  jekyll serve --host 0.0.0.0
```

Then visit: http://localhost:4000/gamaliel-api/

## Option 2: Using Bundler (Requires Ruby 3.0+)

```bash
# Install dependencies
bundle install

# Serve with baseurl (like GitHub Pages)
bundle exec jekyll serve --baseurl /gamaliel-api

# Or serve without baseurl (simpler local testing)
bundle exec jekyll serve --config _config.yml,_config.local.yml
```

Then visit: http://localhost:4000/gamaliel-api/ (with baseurl) or http://localhost:4000/ (without)

## Option 3: Quick URL Verification

The URLs are correct! Verified with test script:
- With `baseurl: "/gamaliel-api"`: `/docs/` => `/gamaliel-api/docs/` ✅
- Without baseurl: `/docs/` => `/docs/` ✅

The `relative_url` filter automatically handles this.
