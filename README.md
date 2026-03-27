# Portfolia

Portfolia is a full-stack portfolio management app built to track holdings, manage a watchlist, and explore performance analytics through a clean fintech-style dashboard.

It showcases modern full-stack development with secure authentication, protected routes, portfolio data management, and rich analytics UI.

## Live Demo

- **Live App:** https://portfolia-wheat-gamma.vercel.app/
- **Analytics Page:** https://portfolia-wheat-gamma.vercel.app/analytics

## What You Can Do

- Secure authentication and protected app routes
- Create, edit, and manage portfolio holdings
- Track watchlist assets and target prices
- Explore allocation, performance, and portfolio analytics
- Export holdings data to CSV
- Review insights like top holdings and portfolio win rate
- Manage account and workspace settings

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript
- **Styling/UI:** Tailwind CSS v4, shadcn/ui, Lucide icons
- **Authentication:** Clerk
- **Security:** Arcjet
- **Database:** PostgreSQL, Drizzle ORM
- **Charts:** Recharts
- **Testing:** Vitest, Playwright

## Project Structure

```text
app/                  Route groups and pages
components/           Reusable UI and feature components
lib/db/               Database client, schema, and query layer
lib/security/         Request protection logic
drizzle/              SQL migrations
public/screenshoots/  Product screenshots used in this README
```

## Screenshots

### Dashboard

<img src="./public/screenshoots/01-dashboard-overview.png" alt="Dashboard Overview" width="100%" />
<img src="./public/screenshoots/02-dashboard-allocation.png" alt="Dashboard Allocation" width="100%" />

### Holdings

<img src="./public/screenshoots/03-holdings-table.png" alt="Holdings Table" width="100%" />
<img src="./public/screenshoots/04-holdings-add-dialog.png" alt="Holdings Add Dialog" width="100%" />

### Watchlist

<img src="./public/screenshoots/05-watchlist-table.png" alt="Watchlist Table" width="100%" />
<img src="./public/screenshoots/06-watchlist-add-dialog.png" alt="Watchlist Add Dialog" width="100%" />

### Analytics

<img src="./public/screenshoots/07-analytics-performance.png" alt="Analytics Performance" width="100%" />
<img src="./public/screenshoots/08-analytics-allocation.png" alt="Analytics Allocation" width="100%" />
<img src="./public/screenshoots/09-analytics-categories.png" alt="Analytics Categories" width="100%" />
<img src="./public/screenshoots/10-settings-account.png" alt="Settings Account" width="100%" />
<img src="./public/screenshoots/11-settings-security.png" alt="Settings Security" width="100%" />

## Notes

- Protected routes are enforced in `proxy.ts` with Clerk middleware.
- Arcjet protections are applied through `lib/security/arcjet.ts`.
- Data access is scoped per authenticated user in `lib/db/queries.ts`.
