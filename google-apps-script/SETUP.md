# RSVP + Wishes → Google Sheets setup

Spreadsheet: https://docs.google.com/spreadsheets/d/1wY39t5pK6E9FfM-kDqV7zK6cX2xeKqixJJZNC6WU-qk/edit

1. Open the spreadsheet → **Extensions → Apps Script**.
2. Delete everything in `Code.gs` and paste the full contents of `code.ts` (same as `google-apps-script/code.gs`). Save.
3. (Optional) Select `setupSheets` in the function dropdown → **Run** → allow permissions.
   This creates the **RSVP** and **Wishes** tabs with headers immediately.
   (Otherwise they are created automatically on the first submission.)
4. **Deploy → New deployment** → type **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the Web App URL (`https://script.google.com/macros/s/.../exec`).
6. Put it in the site — either:
   - `.env` file in the project root: `VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec`
     and add the same variable in Vercel → Project → Settings → Environment Variables, **or**
   - paste it directly into `src/config.ts` (`GOOGLE_SCRIPT_URL`).
7. Restart `npm run dev` / redeploy.

Sheets created:
- **RSVP**: Timestamp | Full Name | Phone | Attendance | No. of Guests | Message / Notes
- **Wishes**: Timestamp | Guest Name | Message | Show on Website (untick to hide a wish from the site)

If you change the Apps Script later: **Deploy → Manage deployments → Edit → New version** (keeps the same URL).
