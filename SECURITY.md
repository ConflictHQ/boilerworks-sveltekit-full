# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Boilerworks, please report it responsibly.

**Do not open a public issue.**

Instead, email **security@weareconflict.com** with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge your report within 48 hours and aim to release a fix within 7 days for critical issues.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| latest  | Yes       |

## Security Best Practices

When deploying Boilerworks:

- Change the default database credentials (`boilerworks`/`boilerworks` in `docker/docker-compose.yml` and `.env.example`)
- Remove or change the seeded demo accounts (`admin@boilerworks.dev`, `demo@boilerworks.dev`)
- Keep `DATABASE_URL` out of version control — `.env` is gitignored; never commit real credentials
- Use HTTPS in production (session cookies are httpOnly; serve them over TLS only)
- Set `NODE_ENV=production`
- Do not expose PostgreSQL publicly — restrict it to the app network
