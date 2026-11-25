# LUMORA Interiors — Production Cloud-Ready Full-Stack Project

All your updated UI/UX changes (`App.jsx`, `index.css`, `server.js`, `seed.js`, and Prisma schemas) are included and pre-configured for **GitHub + Neon (PostgreSQL) + Render + Vercel**.

---

## 1. Create a Free PostgreSQL Database (Neon.tech)
1. Sign up at [neon.tech](https://neon.tech) and create a project named `lumora-db`.
2. Copy the **Connection String** (starts with `postgresql://...`).

---

## 2. Push This Folder to GitHub
1. Create a new repository on [github.com](https://github.com) (e.g., `lumora-interiors`).
2. Upload or push the `backend/` and `frontend/` folders to that repository.

---

## 3. Deploy Backend API on Render.com
1. Go to [render.com](https://render.com) → **New +** → **Web Service** → select your GitHub repo.
2. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npx prisma db push && npm run prisma:seed`
   - **Start Command:** `npm start`
3. Add **Environment Variables**:
   - `DATABASE_URL` = *(your Neon PostgreSQL connection string)*
   - `JWT_SECRET` = `lumora_prod_secret_key_2026`
   - `ADMIN_EMAIL` = `admin@lumorainteriors.com`
   - `ADMIN_PASSWORD` = `lumora2026`
4. Click **Deploy Web Service** and copy your live Render URL (e.g., `https://lumora-api.onrender.com`).

---

## 4. Deploy Frontend Website on Vercel.com
1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the same GitHub repo.
2. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite`
3. Add **Environment Variable**:
   - `VITE_API_URL` = `https://lumora-api.onrender.com/api` *(replace with your Render URL + `/api`)*
4. Click **Deploy**.
