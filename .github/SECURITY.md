# Security Policy

## Supported versions

This is the website for Kalapriti Designs, built and maintained by Stackified. Only the latest
version on the `main` branch is maintained.

| Version | Supported |
|---------|:---------:|
| Latest (`main`) | Yes |
| Older commits | No |

## Reporting a vulnerability

Please **do not open a public issue** for security problems.

Instead, use GitHub's private reporting:

1. Go to the [Security tab](https://github.com/stackified/kalapriti/security).
2. Click **Report a vulnerability**.
3. Describe the issue, steps to reproduce, and potential impact.

You can expect an acknowledgement within a few days. Thank you for helping keep the project safe.

## Notes on this project

The site is a static React single-page app built with Vite and served by GitHub Pages. It has no
backend, no authentication, no database, no payments and no analytics, so its security surface is
small.

The contact form validates input in the browser and then opens WhatsApp with the enquiry
pre-filled; the site itself does not store the message or send it to a server. The code has an
optional mode for posting the form to an external form service, but it is not configured.

Third-party resources are limited to Google Fonts and outbound links to WhatsApp and Instagram.
The only environment variable is the build-time `VITE_BASE` path, and the deploy workflow uses the
built-in `GITHUB_TOKEN`; no other secrets are stored in the repository. The JavaScript is scanned
by CodeQL on every push.
