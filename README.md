# CampusFlow

A responsive dormitory request-management demo built with
React, TypeScript, and CSS.

## Live Demo

[Open CampusFlow](https://ardikson.github.io/campusflow/)
## Features

- Dashboard with request statistics
- Request creation with basic validation
- Request status updates
- Search by title, student, room, category, or ID
- Combined status and category filters
- Local browser persistence
- Demo data reset with confirmation
- Responsive layout

## Technology

- React
- TypeScript
- Vite
- CSS
- Browser localStorage

## Run locally

Requirements: a Node.js version supported by the current Vite release,
and npm.

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed in the terminal.

## Code checks

```bash
cd frontend
npm run lint
npm run build
```

## Current limitations

- Frontend-only demonstration
- No authentication or server-side permissions
- No backend or shared database
- Data is stored only in the current browser and origin
- Clearing browser site data can remove saved requests
- Demo reset replaces current requests with the original dataset
- Automated tests have not been added yet

## Privacy

Use fictional demonstration data only.
Do not enter real student records or sensitive information.

## Planned improvements

- Automated tests
- Python REST API
- SQL database
- Authentication and role-based access
- Request descriptions and timestamps