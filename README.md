# H+M Lab

AI Voice Generation Platform - Human Voice, Machine Precision.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
- Create free PostgreSQL database at https://supabase.com
- Copy connection string to `.env` → `DATABASE_URL`

### 3. Push Database Schema
```bash
npx prisma generate
npx prisma db push
```

### 4. Seed Default Voices
```bash
npx ts-node prisma/seed.ts
```

### 5. Set Up Environment Variables
1. Copy `.env.example` to `.env`
2. Fill in your real values:
   - `DATABASE_URL` (from Supabase)
   - `JWT_SECRET` (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `ADMIN_EMAIL` (your email)

### 6. Run Locally
```bash
npm run dev
```
Open http://localhost:3000

### 7. Deploy to Vercel
1. Push code to GitHub (make sure `.env` is NOT committed)
2. Import to https://vercel.com
3. Add environment variables from `.env` file
4. Deploy

## Important Notes
- `.env` file is in `.gitignore` and should NEVER be committed
- The `.env.example` file shows what variables you need
- Owner email gets unlimited free access automatically
