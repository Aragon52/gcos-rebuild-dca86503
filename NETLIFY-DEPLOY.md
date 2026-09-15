# Deploying GCOS to Netlify (one site, three portals)

A single Netlify site serves the main shop, reseller portal, and admin portal using domain aliases. The app detects the incoming subdomain and routes to the correct portal automatically.

| Public address | Portal | Internal route |
|---|---|---|
| `globalcart-onlineshop.com` | Main storefront | `/` |
| `reseller.globalcart-onlineshop.com` | Reseller portal | `/reseller/*` |
| `admin.globalcart-onlineshop.com` | Admin portal | `/admin/*` |

---

## 1. Create / choose the Netlify site

1. In Netlify, create a new site (or use the existing GCOS site).
2. Connect it to your Git provider and select the GCOS repo, **or** drag-and-drop the build output.
3. Make sure the primary domain is set to `globalcart-onlinesshop.com` (or `www.globalcart-onlineshop.com` with the apex redirecting to `www`).

---

## 2. Build settings

`netlify.toml` is already in the repo root. You do not need to change it.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `22` |
| Nitro preset | `netlify` (produces `.netlify/functions-internal/server`) |

---

## 3. Environment variables

Go to **Site configuration → Environment variables** and add these.

### Values you can copy directly

```
VITE_SUPABASE_URL=https://hreotqowulxpchyxjlai.supabase.co
VITE_SUPABASE_PROJECT_ID=hreotqowulxpchyxjlai
```

### Values you must copy from Supabase

1. Open https://supabase.com/dashboard/project/hreotqowulxpchyxjlai/settings/api
2. Copy the **anon public** key into:

```
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

3. Copy the **service_role secret** key into:

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> `SUPABASE_SERVICE_ROLE_KEY` is used only by the server function. Never expose it in the browser.

---

## 4. Domains & DNS

### Domain aliases on the same site

In Netlify, go to **Domain management → Custom domains** and add these as aliases of the same site:

- `reseller.globalcart-onlineshop.com`
- `admin.globalcart-onlineshop.com`

### DNS records

If your DNS is managed outside Netlify, add these records:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` (apex) | Netlify apex IP from your site dashboard | Auto |
| CNAME | `www` | your-netlify-site.netlify.app | Auto |
| CNAME | `reseller` | your-netlify-site.netlify.app | Auto |
| CNAME | `admin` | your-netlify-site.netlify.app | Auto |

If you use Netlify DNS, Netlify creates the records automatically when you add the aliases.

---

## 5. Redirect / rewrite rule (Netlify)

The single function produced by the Nitro `netlify` preset already handles routing, but Netlify must route **all** paths to it.

Add a redirect in **Site configuration → Redirects**:

```
/*  /.netlify/functions-internal/server  200
```

Or create `_redirects` in the publish directory (`dist/_redirects`) with:

```
/* /.netlify/functions-internal/server 200
```

---

## 6. How the subdomain routing works

`src/lib/portal-host.ts` inspects the request host and maps it to an internal route prefix:

- `admin.globalcart-onlineshop.com/orders` → renders `/admin/orders`
- `reseller.globalcart-onlineshop.com/dashboard` → renders `/reseller/dashboard`
- `globalcart-onlineshop.com` → renders the storefront at `/`

Paths under `/api`, `/_serverFn`, `/assets`, and static files are never rewritten.

Path-based access still works on the main domain (`globalcart-onlineshop.com/admin/...`), which is what local development and the Lovable preview use.

---

## 7. Deploy

1. Push the repo to Git or trigger a manual deploy in Netlify.
2. Wait for the build to finish.
3. Visit each domain:
   - https://globalcart-onlineshop.com
   - https://admin.globalcart-onlineshop.com
   - https://reseller.globalcart-onlineshop.com

---

## Troubleshooting

- **Portal loads the wrong layout** — check that the domain aliases are on the same Netlify site and that HTTPS is enabled for each alias.
- **404s on admin/reseller paths** — make sure the `/* → /.netlify/functions-internal/server` redirect is active.
- **Build fails** — confirm Node 22 is selected and `NITRO_PRESET=netlify` is set.
- **Supabase auth errors** — double-check `VITE_SUPABASE_PUBLISHABLE_KEY` matches the anon key exactly.
