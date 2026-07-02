# ExpenseTracker

A personal expense tracker built with [Next.js 16](https://nextjs.org) (App Router + Server Actions), [MongoDB](https://www.mongodb.com), [NextAuth v5](https://authjs.dev) with Google sign-in, and [daisyUI 5](https://daisyui.com) on Tailwind CSS 4.

Log expenses, income, and debts in dollars ($) or taka (৳), filter any period (today, week, month, year, or a custom range), browse a per-day spending calendar, and switch between light/dark themes derived from the app icon.

## Setup

### 1. MongoDB

Run a local MongoDB instance (`sudo systemctl start mongodb`) or grab a free [Atlas](https://www.mongodb.com/atlas) cluster, then set `MONGODB_URI` in `.env.local`.

### 2. Google OAuth

1. Open the [Google Cloud Console credentials page](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth client ID** (type: Web application).
3. Add these URLs:
   - Authorized JavaScript origin: `http://localhost:3000`
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy the client ID and secret into `.env.local` as `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.

### 3. Environment

Copy `.env.example` to `.env.local` (already created for local dev) and fill in the values. Generate a fresh `AUTH_SECRET` with:

```bash
openssl rand -base64 32
```

### 4. Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in with Google, and start tracking.

## Notes

- Amounts display in USD — change the currency in [src/lib/format.js](src/lib/format.js).
- Auth sessions and users are stored in MongoDB via `@auth/mongodb-adapter`; expenses live in the `expenses` collection of the `expense-tracker` database.
- The light/dark themes in [src/app/globals.css](src/app/globals.css) are built from the wallet icon's palette (`#2197F2`, `#90CBF8`, `#FDFEFF`).
