# Hosting on Hostinger

The website is built automatically by GitHub (`.github/workflows/hostinger.yml`)
on every push to `main`. The ready-to-serve files land on the **`hostinger`**
branch, and Hostinger copies that branch into `public_html`.

What gets deployed on top of the normal site:

| File | Purpose |
|---|---|
| `public/.htaccess` | HTTPS, www → non-www, old-URL redirects, 404 page, caching |
| `public/api/lead.php` | Receives every website form → saves to MySQL → emails the lead |
| `public/leads/` | Password-protected leads list + Excel download (`/leads/`) |
| `lead-config.sample.php` | Template for the private settings file (NOT deployed) |

## One-time setup in hPanel

1. **Add website**: Websites → Add website → *Empty website / custom code* → `aspireventuresrealty.in`.
2. **SSL**: Security → SSL → install free SSL, turn on *Force HTTPS*.
3. **Email**: Emails → create `info@aspireventuresrealty.in`.
4. **Database**: Databases → MySQL Databases → create a database + user. Note name, user, password.
5. **Settings file**: Files → File Manager → open the folder that *contains* `public_html`
   (`domains/aspireventuresrealty.in/`) → create `lead-config.php` there with the
   contents of `lead-config.sample.php`, filled in with the step-4 details and a
   strong admin password.
6. **Empty `public_html`**: delete Hostinger's default files (Git deploy needs an empty folder).
7. **Git**: Advanced → Git →
   - Repository: `git@github.com:aspirerealty/-AspireRealty-v1.git`
   - Branch: `hostinger` · Directory: leave empty (deploys to `public_html`)
   - Private repo: copy the SSH key hPanel shows → GitHub repo → Settings → Deploy keys → Add (read-only).
   - Click **Deploy**, then **Auto deployment** → copy the webhook URL.
8. **Webhook**: GitHub repo → Settings → Secrets and variables → Actions →
   New secret `HOSTINGER_WEBHOOK` = the URL from step 7. From now on every update goes live by itself.

## Check after going live

- `https://aspireventuresrealty.in` opens with the padlock; `www.` and `http://` redirect.
- Submit the Contact form → the lead appears at `/leads/` and an email arrives
  (check Gmail spam the first time and mark *Not spam*).
- `https://aspireventuresrealty.in/sarjapura-g47/` redirects to `/sky-and-high/`.
