# StoreSnap Notes (Next.js)

Capture store visit notes and photos, generate a branded report, and email it with **PDF + photo attachments**.

## Quick start (local)
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy via GitHub → Vercel
1. Create a new GitHub repo (e.g., `storesnap-notes`).
2. Push this folder to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial"
   git branch -M main
   git remote add origin https://github.com/<you>/storesnap-notes.git
   git push -u origin main
   ```
3. Go to https://vercel.com/new → Import Git Repo → pick your repo → **Deploy**.

### SendGrid setup (for email with attachments)
- In Vercel Project → **Settings → Environment Variables**, add:
  - `SENDGRID_API_KEY` = your SendGrid API key
  - `SEND_FROM` = verified sender email (e.g., `reports@yourdomain.com`)
- Redeploy, then use **Send with attachments** in the app.
