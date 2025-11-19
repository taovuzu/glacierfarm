# GlacierFarm - Deployment Guide

## Overview
GlacierFarm is a portable cold storage solution platform for farmers. It's built with React (Vite) for the frontend and Express/Netlify Functions for the backend.

## Project Structure
```
glacierfarm/
├── client/               # React + Vite frontend
├── netlify/functions/    # Netlify Functions (Express API)
├── netlify.toml         # Netlify deployment configuration
├── package.json         # Root package.json with build scripts
└── .env.example         # Environment variables template
```

## Local Development

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (for database)

### Installation & Running Locally

1. **Install dependencies:**
   ```bash
   npm install-all
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` in the root directory
   - Update `MONGO_URI` with your MongoDB Atlas connection string

3. **Run development server:**
   ```bash
   npm run dev
   ```
   This starts the Vite development server at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This will:
1. Build the React frontend to `client/dist`
2. Install dependencies for Netlify functions

## Deployment to Netlify

### Prerequisites
- Netlify account
- Git repository (GitHub, GitLab, or Bitbucket)

### Deployment Steps

1. **Push code to your Git repository**

2. **Connect to Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select your Git provider and repository
   - Click "Deploy site"

3. **Configure Environment Variables:**
   - In Netlify dashboard, go to Site settings → Build & deploy → Environment
   - Add the following environment variables:
     - `MONGO_URI`: Your MongoDB Atlas connection string
     - `VITE_API_URL`: `/.netlify/functions/api` (for production)

4. **Build Configuration:**
   - Build command: `npm run build`
   - Publish directory: `client/dist`
   - Functions directory: `netlify/functions`

### Auto-Deploy Setup
Once connected, Netlify will automatically deploy on every push to your main branch.

## Available Scripts

### Root Level
```bash
npm run install-all    # Install all dependencies (client + functions)
npm run build          # Build for production
npm run dev            # Start development server
npm run lint           # Run linting
```

### Client (in client/ directory)
```bash
npm run dev            # Start Vite dev server
npm run build          # Build for production
npm run lint           # Run ESLint
npm run preview        # Preview production build locally
```

## Key Files

- `netlify.toml` - Netlify configuration and routing rules
- `client/vite.config.js` - Vite configuration
- `client/tailwind.config.js` - Tailwind CSS configuration
- `netlify/functions/api.js` - Main Express app wrapper for Netlify Functions
- `.env.example` - Environment variables template

## API Endpoints

All API endpoints are prefixed with `/.netlify/functions/api`:

- `GET /.netlify/functions/api/users` - Get all users
- `POST /.netlify/functions/api/users` - Create new user
- `GET /.netlify/functions/api/storage-units` - Get all storage units
- `POST /.netlify/functions/api/storage-units` - Create storage unit
- `GET /.netlify/functions/api/orders` - Get all orders
- `POST /.netlify/functions/api/orders` - Create order
- `GET /.netlify/functions/api/products` - Get all products
- `POST /.netlify/functions/api/products` - Create product

## Technologies

- **Frontend**: React 19, Vite, Tailwind CSS, React Router
- **Backend**: Express, Netlify Functions, Mongoose
- **Database**: MongoDB Atlas
- **Hosting**: Netlify

## Features

- **User Management**: Registration and login (authentication ready)
- **Storage Units**: Browse and order portable cold storage units
- **Marketplace**: Buy and sell agricultural products
- **Dashboard**: Monitor orders and manage inventory
- **Real-time Monitoring**: Temperature monitoring system placeholder

## Next Steps

1. Add actual authentication (JWT tokens)
2. Implement payment processing (Stripe/Razorpay)
3. Add real-time temperature sensor integration
4. Implement email notifications
5. Add user profiles and verification system

## Troubleshooting

### Build fails with PostCSS error
- Make sure `postcss.config.js` uses ES module syntax (not CommonJS)

### API calls fail locally
- Ensure Netlify CLI is installed for local testing: `npm install -g netlify-cli`
- Run functions locally: `netlify dev`

### MongoDB connection issues
- Verify your MongoDB URI in `.env`
- Check IP whitelist in MongoDB Atlas security settings
- Ensure your IP address is allowed

## Support
For issues and questions, please refer to the documentation or create an issue in the repository.
# glacierfarm
