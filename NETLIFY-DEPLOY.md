# Deploying GCOS to Netlify (one site, three portals)

One Netlify site serves all three portals:

| Address | Portal |
|---|---|
| `globalcart-onlineshop.com` | main shop / customer app |
| `reseller.globalcart-onlineshop.com` | reseller portal |
| `admin.globalcart-onlineshop.com` | admin portal |

## 1. Build settings

`netlify.toml` in the repo root already sets everything:

- Build command: `npm run build`
- Publish directory: `dist`
- `NITRO_PRESET = netlify` (produces the server function in `.netlify/functions-internal`)
- Node 22

## 2. Environment variables (Site configuration → Environment variables)

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
SUPABASE_SERVICE_ROLE_KEY     # server-side only
```

## 3. Domains (Domain management)

- Primary domain: `globalcart-onlineshop.com` (plus the `www` redirect).
- Add `reseller.globalcart-onlineshop.com` and `admin.globalcart-onlineshop.com`
  as **domain aliases** on the same site.
- DNS: CNAME each subdomain to the Netlify site (or use Netlify DNS).

No separate sites or builds are needed — routing is decided by the incoming host.

## 4. How the host routing works

`src/lib/portal-host.ts` maps the request host to a route prefix and the router
rewrites the URL both ways (`src/router.tsx`):

- `admin.` / `administration.` → `/admin/*` route tree
- `reseller.` / `retailshops.` → `/reseller/*` route tree

So `admin.globalcart-onlineshop.com/orders` renders the `/admin/orders` page while
the address bar stays short. Paths under `/api`, `/_serverFn` and `/assets` are
never rewritten.

Path-based access still works on the main domain
(`globalcart-onlineshop.com/admin/...`), which is what local development and the
Lovable preview use.
