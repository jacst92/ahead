# Cloudflare Pages Deployment

Ahead is configured as a static project that builds into `dist/`. Cloudflare Pages can host it on the free tier.

## Deployment Status

The project files are deployment-ready, but this repository is not automatically connected to Cloudflare Pages from the local workspace.

Use [CLOUD_FLARE_STATUS.md](CLOUD_FLARE_STATUS.md) to track three separate states:

1. Project is deployment-ready.
2. Project is connected to Cloudflare Pages.
3. Project has an active public URL.

## Build Settings

Use these exact settings in Cloudflare Pages:

- Framework preset: `None` / `Other`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: project root

## Connect The GitHub Repository

1. Push the Ahead repository to GitHub.
2. Go to the Cloudflare dashboard.
3. Open `Workers & Pages`.
4. Choose `Create application`.
5. Select `Pages`.
6. Choose `Connect to Git`.
7. Authorize Cloudflare to access GitHub if prompted.
8. Select the Ahead repository.
9. Configure the build settings:
   - Framework preset: `None` / `Other`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: project root
10. Save and deploy.

Cloudflare Pages will build the app and provide a live `pages.dev` URL.

## Preview Deployments

After GitHub is connected:

- Every push to the production branch creates a production deployment.
- Pull requests and branch pushes can create preview deployments, depending on the project settings in Cloudflare Pages.
- Each deployment gets a unique preview URL in the Cloudflare Pages dashboard.

## Environment Variables

No production secrets are required for the current static prototype.

Use:

- `.env.example` for documented variable names.
- `.env.local` for local-only values.
- Cloudflare Pages project settings for future preview or production variables.

Do not commit `.env`, `.env.local`, or secret-bearing environment files.

## Local Verification

Run:

```powershell
npm run build
```

Expected result:

```text
Ahead production build completed: dist/
```

The generated `dist/` directory is what Cloudflare Pages serves.

## Common Mistakes To Avoid

- Do not use Vercel settings or `vercel.json`.
- Do not set the build output directory to the project root. Use `dist`.
- Do not set the root directory to `dist`; the root directory should be the project root.
- Do not deploy the Python local dev server. Cloudflare Pages should run `npm run build`.
- Do not commit local environment files or secrets.
