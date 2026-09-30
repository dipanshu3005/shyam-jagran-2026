# Shri Shyam Sankirtan Sandhya invitation

The Gupta’s Family invitation website. This folder is a standalone Next.js project for Vercel.

## Local development

Install Node.js 22.13 or newer, then run:

```bash
corepack enable
pnpm install
pnpm dev
```

Open the local URL printed by Next.js. Run `pnpm build` before deployment.

## Deploy on Vercel

Import the `dipanshu3005/shyam-jagran2026` repository and set **Root Directory** to `shyam-jagran-2026`. Vercel should detect Next.js and use `pnpm build`; no environment variables are needed for this invitation.

Edit text, event date, countdown, map, RSVP and phone numbers in `app/page.tsx`. Edit styles and animations in `app/globals.css`. Social preview tags are in `app/layout.tsx`. Replace artwork and music in `public/`.

The current Open Graph URL points to the existing live Site. Update `siteUrl` in `app/layout.tsx` to the Vercel URL after you deploy if you want previews to point there.
