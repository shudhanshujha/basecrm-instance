# Deployment Instructions for DrishtiVision CRM

## 1. Upload to GitHub
1. Go to [GitHub](https://github.com/new) and create a new repository named `drishtivision-crm`.
2. Do **not** initialize it with a README or .gitignore.
3. Open your terminal in the project root (`C:\Users\jhash\drishtivision-crm`) and run:
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/drishtivision-crm.git
   git branch -M main
   git push -u origin main
   ```

## 2. Deploy Frontend to Vercel
1. Go to [Vercel](https://vercel.com/new).
2. Import your new `drishtivision-crm` repository.
3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables:**
   - Add `VITE_API_URL` with your backend URL (e.g., `https://your-backend.railway.app/api`).
5. Click **Deploy**.

## 3. Deploy Backend (Optional but Recommended)
Since the backend uses SQLite, it cannot be hosted on Vercel. I recommend using **Railway** or **Render**:
1. Connect your GitHub repo.
2. Set the root directory to `.` (the project root).
3. Set the start command to `npm run server`.
4. Ensure the `DATABASE_URL` is set in the environment variables.
