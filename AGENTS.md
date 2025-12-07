# Repository Guidelines

## Project Structure & Module Organization
- Server entry: `server.js` boots the Express app from `app.js` and serves static assets from `public/`.
- Frontend assets: HTML under `public/html/`, styles in `public/css/`, shared utilities in `public/common/`, and feature scripts in `public/javascript/`.
- Tests: colocated API/route tests live at the repo root (e.g., `app.test.js`) using Jest + Supertest.
- Images and default assets are stored directly in `public/` (e.g., `user.png`, `Default-PostImage.jpeg`).

## Build, Test, and Development Commands
- `npm start`: run the production-style server via `server.js` on port 3000.
- `npm run dev`: start the server with `nodemon app.js` for automatic reloads during local development.
- `npm test`: execute Jest test suites (currently Supertest health checks; add more as features grow).

## Coding Style & Naming Conventions
- Use 2-space indentation and prefer const/let over var.
- Keep filenames descriptive and consistent: pages in `public/html/` use camelCase (e.g., `getPostList.html`); matching JS lives in `public/javascript/`.
- Place shared browser utilities in `public/common/` and avoid duplicating helpers (e.g., `jwt.js`, `header.js`).
- Keep server routes in `app.js` lean—prefer moving UI logic to the static files.

## Testing Guidelines
- Frameworks: Jest with Supertest for HTTP assertions; expand coverage for each route and key UI interactions.
- Add route tests beside the server (e.g., `app.routes.test.js`) and align test names with the HTTP path: `GET /health returns OK`.
- Before pushing, ensure `npm test` passes; include regression tests when fixing bugs.

## Commit & Pull Request Guidelines
- Follow concise, imperative commit messages (e.g., `Add post detail rendering`, `Fix signup redirect`); mirror existing history style.
- PRs should summarize scope, link related issues, and note any endpoints touched or environment needs (e.g., `BACKEND_URL` usage in `/env.js`).
- Include screenshots or GIFs for visible UI changes under `public/html/`; mention new commands or breaking changes.

## Security & Configuration Tips
- Backend API base is injected via `/env.js`; avoid hardcoding API hosts in feature scripts—read from `window.BACKEND_URL`.
- Do not commit secrets; environment-specific values should be set via runtime variables rather than checked into `public/`.
