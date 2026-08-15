# Tailwind CSS migration

The client now loads Tailwind CSS theme/utilities and the existing visual rules are isolated in Tailwind's `components` layer. Preflight is intentionally not enabled so the existing UI does not change.

Run:

```bash
cd client
npm install
npm run dev -- --host
```

The current class-based component styles are preserved exactly for visual compatibility. New components can use Tailwind utility classes directly.
