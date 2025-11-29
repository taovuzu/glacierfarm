# 🚀 GlacierFarm Deployment Guide

This guide outlines the steps to deploy the GlacierFarm application to **Netlify**.

## 1. Prerequisites
- A **GitHub** account with the project repository pushed.
- A **Netlify** account.
- A **MongoDB Atlas** database (you will need the connection string).

## 2. Push Code to GitHub
Ensure your latest changes are committed and pushed to your GitHub repository.
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## 3. Deploy to Netlify

1.  **Log in** to [Netlify](https://app.netlify.com/).
2.  Click **"Add new site"** > **"Import an existing project"**.
3.  Select **GitHub** and authorize Netlify.
4.  Search for and select your **`glacierfarm`** repository.

## 4. Configure Build Settings
Netlify should automatically detect the settings from `netlify.toml`, but verify them:

- **Base directory**: `(leave empty)`
- **Build command**: `npm run build`
- **Publish directory**: `client/dist`
- **Functions directory**: `netlify/functions`

## 5. Set Environment Variables
Click on **"Show advanced"** or go to **Site Settings > Environment variables** after creation and add the following:

| Key | Value | Description |
| :--- | :--- | :--- |
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string. |
| `JWT_SECRET` | `your_secure_secret` | A long, random string for security. |
| `VITE_API_URL` | `/.netlify/functions/api` | The base URL for API requests. |
| `NODE_ENV` | `production` | Optimizes the build for production. |

> **Note:** `VITE_API_URL` must be set to `/.netlify/functions/api` so the frontend can correctly communicate with the backend functions on the same domain.

## 6. Deploy
1.  Click **"Deploy Site"**.
2.  Netlify will start building your project. You can watch the deployment logs.
3.  Once finished, you will get a live URL (e.g., `https://glacierfarm-xyz.netlify.app`).

## 7. Post-Deployment Check
- Open your live URL.
- Try to **Sign Up** (this tests the database connection).
- If successful, you will be redirected to the Dashboard.

---
**Troubleshooting:**
- **Build Fails?** Check the "Build logs" in Netlify for errors.
- **API Errors?** Check the "Functions" tab in Netlify to see server-side logs.
- **White Screen?** Ensure `Publish directory` is correctly set to `client/dist`.
