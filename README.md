# BMW Intern Task - Frontend

A modern React application featuring a fully dynamic DataGrid component built with AG Grid and Material-UI. Designed to handle any structural json data with intelligent column detection, filtering, sorting, pagination.


## Tech Stack

- **React 18** with Hooks and modern patterns
- **AG Grid Community** for enterprise-grade data grid
- **Material-UI (MUI)** for consistent design system
- **React Router v6** for client-side routing
- **Axios** for HTTP client
- **Vite** for fast development and optimized builds
- **Vitest** for unit and integration testing

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- Backend API running (default: `http://localhost:3001`)

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Application runs at `http://localhost:5173`

### Build

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Testing

Run test suite with coverage:

```bash
npm test
```

Watch mode for development:

```bash
npm run test:watch
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=
```

**Default:** `http://localhost:3001/api`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Route-level page components
├── services/           # API client and external services
├── utils/              # Helper functions and utilities
├── __tests__/          # Test files organized by feature
└── App.jsx             # Root component with routing
```