# Physical Architecture

## Suggested deployment components

- Static or Next.js demo site hosted on Vercel/Netlify/Cloudflare Pages.
- GTM web container.
- GA4 demo property and BigQuery export where available.
- BigQuery datasets and service account.
- dbt Core or dbt Cloud.
- GitHub Actions for documentation/tests.
- Looker Studio or Tableau for BI.

All secrets belong in environment variables or managed secret stores, never in Git.
