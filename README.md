# Portfolia

Portfolia is a full-stack portfolio management app built to track holdings, manage a watchlist, and explore performance analytics through a clean fintech-style dashboard.

It showcases modern full-stack development with secure authentication, protected routes, portfolio data management, and rich analytics UI.

## Live Demo

**Live App:** https://portfolia-wheat-gamma.vercel.app/

## What You Can Do

- Secure authentication with protected app routes
- Create, edit, and manage portfolio holdings
- Track watchlist assets and target prices
- Explore allocation, performance, and category analytics
- Review insights such as top holdings and portfolio win rate
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
public/screenshots/   Product screenshots used in this README

## Screenshots

### Dashboard

![Dashboard Overview](public/screenshoots/01-dashboard-overview.png)
![Dashboard Allocation](public/screenshoots/02-dashboard-allocation.png)

### Holdings

![Holdings Table](public/screenshoots/03-holdings-table.png)
![Holdings Add Dialog](public/screenshoots/04-holdings-add-dialog.png)

### Watchlist

![Watchlist Table](public/screenshoots/05-watchlist-table.png)
![Watchlist Add Dialog](public/screenshoots/06-watchlist-add-dialog.png)

### Analytics

![Analytics Performance](public/screenshoots/07-analytics-performance.png)
![Analytics Allocation](public/screenshoots/08-analytics-allocation.png)
![Analytics Categories](public/screenshoots/09-analytics-categories.png)
![Settings Account](public/screenshoots/10-settings-account.png)
![Settings Security](public/screenshoots/11-settings-security.png)

## Notes

- Protected routes are enforced in `proxy.ts` with Clerk middleware.
- Arcjet protections are applied through `lib/security/arcjet.ts`.
- Data access is scoped per authenticated user in `lib/db/queries.ts`.
