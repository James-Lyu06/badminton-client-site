# Badminton Client Site

Public questionnaire site for badminton test participants.

## Deploy

1. Upload these files to the repository root.
2. Enable GitHub Pages from `main` / root.
3. Open `share.html` to get the QR code for the client questionnaire.

## Database

This site submits to Supabase when `config.js` contains `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
If those values are blank, it runs in local demo mode only.
