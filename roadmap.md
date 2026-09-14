# GCOS migration roadmap

- [x] Inspect uploaded archive
- [ ] Copy source app files into project (components, lib, assets, i18n, schema)
- [ ] Port routes from react-router-dom to TanStack Router (storefront, reseller, admin portals)
- [ ] Convert Express server.ts endpoints to server functions / api routes
- [ ] Wire Supabase auth (3 portal auth contexts) — awaits user connecting their Supabase project
- [ ] i18n, PWA, styles ported
- [ ] Build green + verify key flows
- [ ] Request secrets (service role key) when needed
- [ ] Handoff: user connects own Supabase via Settings → Connectors
