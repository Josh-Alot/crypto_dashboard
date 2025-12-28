# Deployment Guide - Cloudflare Pages

This document contains detailed instructions for deploying the crypto dashboard to Cloudflare Pages.

## Prerequisites

- Cloudflare account (free)
- Git repository configured (already configured: `git@github.com:Josh-Alot/crypto_dashboard.git`)
- Required environment variables

## Required Environment Variables

### Required

- `REOWN_PROJECT_ID` - Reown/WalletConnect Project ID
  - Get it at: https://cloud.reown.com/

### Optional (but recommended)

- `ETHERSCAN_API_KEY` - Etherscan API key
  - Get it at: https://etherscan.io/apis
- `BASESCAN_API_KEY` - Basescan API key
  - Get it at: https://basescan.org/apis
- `POLYGONSCAN_API_KEY` - Polygonscan API key
  - Get it at: https://polygonscan.com/apis
- `ARBISCAN_API_KEY` - Arbiscan API key
  - Get it at: https://arbiscan.io/apis
- `OPTIMISTIC_ETHERSCAN_API_KEY` - Optimistic Etherscan API key
  - Get it at: https://optimistic.etherscan.io/apis

### Optional (for metadata)

- `PROJECT_URL` - Full production site URL
  - Example: `https://crypto-dashboard.pages.dev`
  - If not configured, a default value will be used

## Deployment Steps

### 1. Access Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Log in or create a free account
3. In the sidebar, click **Pages**

### 2. Connect Repository

1. Click **Create a project**
2. Select **Connect to Git**
3. Authorize Cloudflare to access your GitHub repository
4. Select repository: `Josh-Alot/crypto_dashboard`
5. Click **Begin setup**

### 3. Configure Build Settings

Configure the following fields:

- **Framework preset**: `Vite` (or `None` if Vite is not available)
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (project root)
- **Node version**: `18` or higher (if requested)

### 4. Configure Environment Variables

1. Before deploying, click **Environment variables** (or go to **Settings** > **Environment variables** after creating the project)
2. Add each environment variable:
   - Click **Add variable**
   - Configure for **Production**, **Preview** and **Branch** (or just Production if you prefer)
   - Add all variables listed above

### 5. Deploy

1. After configuring everything, click **Save and Deploy**
2. Wait for the build to complete (may take a few minutes the first time)
3. Check build logs to ensure there are no errors

### 6. Verify Deployment

1. After the build completes, you will receive a URL (e.g., `crypto-dashboard-xxxxx.pages.dev`)
2. Access the URL and test the site
3. Verify:
   - Wallet connection works
   - Tokens are loaded correctly
   - Prices are updated
   - Multiple chains work

## Additional Configuration

### Custom Domain (Future)

When you have a domain:

1. Go to **Settings** > **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain
4. Follow the DNS instructions provided by Cloudflare
5. SSL/TLS will be configured automatically

### Continuous Deployment

By default, Cloudflare Pages automatically deploys on each push to the main branch.

- **Production**: Automatic deployment from `master` (or `main`) branch
- **Preview**: Each Pull Request generates a preview deployment with a unique URL

### Security Headers (Optional)

In **Settings** > **Custom headers**, you can add:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## Troubleshooting

### Build Fails

- Check build logs in the Cloudflare Dashboard
- Make sure all dependencies are in `package.json`
- Verify the Node.js version is correct

### Environment Variables Don't Work

- Verify variables are configured for the correct environment (Production/Preview)
- Make sure variable names are correct (case-sensitive)
- Environment variables need to be restarted after changes

### 404 on Routes

- For SPAs (Single Page Applications), Cloudflare Pages usually works automatically
- If needed, configure redirects in **Functions** > **Redirects**

### Assets Don't Load

- Verify the `base` path in `vite.config.ts` is correct
- Verify assets are in the `dist/assets/` folder

## Useful Commands

### Local Build

```bash
npm run build
```

### Local Preview

```bash
npm run preview
```

### Verify Build Output

```bash
ls -la dist/
```

## Support

For more information about Cloudflare Pages:
- Documentation: https://developers.cloudflare.com/pages/
- Status: https://www.cloudflarestatus.com/
