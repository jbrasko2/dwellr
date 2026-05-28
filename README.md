# Dwellr

AI-powered real estate search. Describe what you're looking for in plain English and get matched listings back.

**Example:** _"3-bedroom house in Austin under $600k with a garage and hardwood floors"_

## How it works

1. User types a natural language query in the search bar
2. The server sends it to **Claude Sonnet** (Anthropic API), which parses it into structured `SearchFilters`
3. Those filters are used to query the **RapidAPI** real estate listings endpoint
4. Results are returned via **GraphQL** and rendered as a listing grid

## Stack

| Layer         | Tech                                                         |
| ------------- | ------------------------------------------------------------ |
| Frontend      | React 19, Vite, TypeScript, Tailwind CSS v4, React Router v7 |
| Backend       | Express v5, Apollo Server v5, GraphQL                        |
| AI            | Claude Sonnet 4.6 (prompt caching enabled)                   |
| Listings data | RapidAPI real estate API                                     |
| Monorepo      | npm workspaces                                               |

## Getting started

### Prerequisites

- Node.js 20+
- An [Anthropic API key](https://console.anthropic.com/)
- A [RapidAPI key](https://rapidapi.com/) with access to a real estate listings API

### Setup

```bash
# Install dependencies
npm install

# Create the server env file and fill in your keys (see Environment variables below)
touch src/server/.env
```

### Environment variables

Create `src/server/.env`:

```bash
ANTHROPIC_API_KEY=   # Anthropic Console
RAPID_API_KEY=       # RapidAPI
```

### Running locally

```bash
# Start client + server + GraphQL codegen in watch mode
npm run dev
```

- Client: http://localhost:5173
- GraphQL API: http://localhost:4000

## Commands

```bash
npm run dev              # Start everything (recommended)
npm run dev:client       # Vite dev server only
npm run dev:server       # Express/Apollo server only

npm run codegen          # Generate GraphQL types once
npm run codegen:watch    # Watch mode (included in dev)

npm run lint             # Lint
npm run lint:fix         # Lint + auto-fix
npm run format           # Prettier
npm run format:check     # Check formatting

npm run test             # All workspaces
```

## Project structure

```
src/
├── client/          # React SPA (Vite)
│   ├── components/  # UI components
│   ├── hooks/       # Apollo query hooks, breakpoints
│   ├── pages/       # Route-level components (home, results)
│   └── providers/   # Router + theme providers
├── server/          # Express + Apollo
│   ├── graphql/     # Schema + resolvers (search)
│   ├── services/
│   │   ├── claude/     # Parses prompts → SearchFilters
│   │   └── listings/   # Fetches listings from RapidAPI
│   └── lib/         # Singleton clients (Anthropic, RapidAPI)
└── generated/       # Auto-generated GraphQL types — do not edit
```

## Search filters

Claude extracts the following structured filters from a natural language query:

`location`, `minPrice`, `maxPrice`, `minBeds`, `maxBeds`, `minBaths`, `maxBaths`, `minSqft`, `maxSqft`, `minLotSqft`, `maxLotSqft`, `minYearBuilt`, `maxYearBuilt`, `newConstruction`, `propertyType`, `features`

Supported `features` values include: `basement`, `central_air`, `fireplace`, `garage_1_or_more`, `hardwood_floors`, `swimming_pool`, `waterfront`, and [more](src/server/services/claude/claude.service.ts).
