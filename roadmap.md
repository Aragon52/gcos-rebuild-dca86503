# GCOS Migration Roadmap

- [x] Copy app code (components, pages, lib, hooks, context, services, assets, public) into project
- [x] Install missing dependencies
- [x] Convert styling to Tailwind v4 (@config + styles.css)
- [x] Root layout: providers, i18n, toasters, fonts, meta
- [x] Router compatibility layer (react-router-dom APIs → TanStack Router)
- [x] Generate all TanStack route files (customer, reseller, admin)
- [ ] Fix remaining type errors (subagents in progress)
- [ ] Convert Express server.ts → server routes /api/* (subagent in progress)
- [ ] Verify build + smoke-test key flows in preview
- [ ] Handoff: user connects their existing Supabase project (Settings → Connectors) so accounts/data carry over; service-role key may be requested via secure form for admin endpoints
