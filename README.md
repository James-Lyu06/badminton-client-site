# Badminton Client Site

Public bilingual questionnaire for badminton test participants.

## Questionnaire scope

The survey covers participant background, training pain points, current training methods, a short product concept, and optional follow-up contact details.

## Deploy

1. Upload these files to the repository root.
2. Enable GitHub Pages from `main` / root.
3. Open `share.html` to get the QR code for the client questionnaire.

## Database

The site submits to Supabase using the public project URL and publishable/anon key in `config.js`. If those values are blank, submissions are stored in the browser as local demo data only.

Before sharing the questionnaire publicly, enable Row Level Security on `badminton_submissions`. The public role should only receive the minimum insert permission required by the form. Do not grant anonymous read, update, or delete access to questionnaire submissions.

## Privacy

The questionnaire may collect contact details when a participant opts into follow-up research. The QR-code page currently uses `api.qrserver.com`, which receives the public questionnaire URL in order to generate the image.
