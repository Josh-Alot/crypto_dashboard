# Setup Checklist - Cloudflare Pages

## ✅ Complete Preparation

- [x] Local build verified and working
- [x] Git repository configured and connected to GitHub
- [x] Deployment documentation created (`DEPLOY.md`)
- [x] TypeScript errors fixed

## 📋 Next Steps (Do Manually)

### 1. Create Cloudflare Account
- [ ] Go to https://dash.cloudflare.com
- [ ] Create free account (if you don't have one)
- [ ] Log in

### 2. Connect Repository
- [ ] Go to **Pages** in the sidebar
- [ ] Click **Create a project**
- [ ] Select **Connect to Git**
- [ ] Authorize GitHub access
- [ ] Select repository: `Josh-Alot/crypto_dashboard`
- [ ] Click **Begin setup**

### 3. Configure Build Settings
- [ ] **Framework preset**: `Vite` (or `None`)
- [ ] **Build command**: `npm run build`
- [ ] **Build output directory**: `dist`
- [ ] **Root directory**: `/` (root)

### 4. Configure Environment Variables

**IMPORTANT**: Configure these variables BEFORE the first deploy!

#### Required:
- [ ] `REOWN_PROJECT_ID` = (your Reown project ID)

#### Optional (but recommended):
- [ ] `ETHERSCAN_API_KEY` = (your API key)
- [ ] `BASESCAN_API_KEY` = (your API key)
- [ ] `POLYGONSCAN_API_KEY` = (your API key)
- [ ] `ARBISCAN_API_KEY` = (your API key)
- [ ] `OPTIMISTIC_ETHERSCAN_API_KEY` = (your API key)

#### Optional:
- [ ] `PROJECT_URL` = `https://your-site.pages.dev` (will be set after deploy)

**How to add:**
1. In **Environment variables**, click **Add variable**
2. Configure for **Production**, **Preview** and **Branch**
3. Add name and value
4. Repeat for each variable

### 5. Initial Deploy
- [ ] Click **Save and Deploy**
- [ ] Wait for build to complete (may take a few minutes)
- [ ] Check build logs for errors
- [ ] Note the provided URL (e.g., `crypto-dashboard-xxxxx.pages.dev`)

### 6. Update PROJECT_URL (Optional)
- [ ] After receiving the site URL, go back to **Environment variables**
- [ ] Add/update `PROJECT_URL` with the full URL
- [ ] Make a new deploy (or wait for next push)

### 7. Test Site
- [ ] Access the provided URL
- [ ] Test wallet connection
- [ ] Verify token loading
- [ ] Test multiple chains
- [ ] Verify price updates
- [ ] Check browser console for errors

## 🔗 Useful Links

- Cloudflare Dashboard: https://dash.cloudflare.com
- Reown Cloud: https://cloud.reown.com/ (for REOWN_PROJECT_ID)
- Etherscan API: https://etherscan.io/apis
- Basescan API: https://basescan.org/apis
- Polygonscan API: https://polygonscan.com/apis
- Arbiscan API: https://arbiscan.io/apis
- Optimistic Etherscan API: https://optimistic.etherscan.io/apis

## 📝 Notes

- Automatic deployment will be enabled after the first deploy
- Each push to `master` will trigger automatic deployment
- Pull Requests automatically generate preview deployments
- Custom domain can be configured later

## 🆘 Need Help?

See the `DEPLOY.md` file for detailed instructions and troubleshooting.
