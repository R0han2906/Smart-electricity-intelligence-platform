# 💻 Smart Electricity Platform Frontend

The user interface for the **Smart Electricity Intelligence Platform** is built using React, TypeScript, Vite, and Tailwind CSS v4. It features a premium, responsive SaaS-style layout, custom-styled charts, and automated forecast analysis.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: React 19, TypeScript
- **Bundler / Dev Server**: Vite 8
- **Styles**: Tailwind CSS v4 (configured via `@import` in `index.css`)
- **Data Visualization**: ChartJS 4 & `react-chartjs-2`
- **Navigation**: React Router 7
- **Icons**: Lucide React
- **Formatting**: `oxfmt` (fast rust-based formatter)

---

## 📂 Folder Architecture

We follow a modular layout that splits reusable UI, state handlers, API calls, and view compositions:

```text
src/
├── api/
│   └── client.ts             # Unified REST Client (Fetch definitions)
├── components/
│   ├── Card.tsx              # Reusable Card container (with hover effects)
│   ├── Button.tsx            # Button with style variants (primary, ghost, etc.)
│   ├── Navbar.tsx            # Header branding and user status
│   └── landing/
│       └── LandingOptionCard.tsx  # Hero landing page button cards
├── constants/
│   ├── landing.ts            # Options list data constants
│   └── routes.ts             # Standardized route path constants
├── sections/
│   ├── Landing/              # LandingSection View
│   ├── CreateUser/           # CreateUserSection Form View
│   ├── SelectUser/           # SelectUserSection Login Search View
│   ├── AddConsumption/       # AddConsumptionSection 12-Month Form View
│   └── Dashboard/            # DashboardSection Analytics Graphs & Cards View
├── App.tsx                   # Core App Router and Wiring
├── index.css                 # Global css style imports & fonts (Inter)
└── main.tsx                  # React DOM render target
```

---

## ⚡ Development Proxy & CORS Resolution

To bypass CORS restrictions when making client-side requests to the backend during development, a Vite proxy is configured.

### Dev Proxy Configuration
In `vite.config.ts`, a proxy rule maps any local request under the `/api` prefix to the deployed Render URL:
```typescript
  server: {
    proxy: {
      '/api': {
        target: 'https://electricity-intelligence-platform-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
```

### Local Environment Variables
A `.env.local` file is used to tell the API client to route requests through the dev server's proxy:
```env
VITE_API_URL=/api
```
*(For direct local backend testing, this env value can be modified to `http://localhost:8000` after launching the local FastAPI server).*

---

## 🚀 Running Locally

1. Install modules:
   ```bash
   npm install
   ```
2. Configure `.env.local` in the root of the frontend folder:
   ```env
   VITE_API_URL=/api
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:8443` in your web browser.

4. Build for production:
   ```bash
   npm run build
   ```
   Outputs production assets to the `/dist` directory.
