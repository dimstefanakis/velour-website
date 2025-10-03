# Repository Guidelines

## Project Structure & Module Organization
- `src/app` hosts the Next.js App Router entry points; server actions live in `src/app/actions` and client-only widgets stay in `src/app/components`.
- Shared UI primitives (shadcn-style) are in `src/components/ui`, while feature-specific blocks belong in `src/components`.
- Integrations and helpers sit in `src/lib` (e.g., `facebook-conversions.ts` for Meta events, Airtable helpers in the waitlist action) and ambient types in `src/types`.
- Static assets live under `public/`; keep hero imagery lightweight and romance-themed per `SPECS.md` when swapping media.

## Build, Test, and Development Commands
- `bun install` installs dependencies; Bun is preferred because the lockfile is `bun.lock`.
- `bun dev` starts the local server with Turbopack at http://localhost:3000.
- `bun run build` creates a production bundle; `bun start` serves the output for smoke-testing.
- `bun run lint` applies the flat ESLint config (`next/core-web-vitals`, `next/typescript`) and should pass before every PR.

## Coding Style & Naming Conventions
- Code is TypeScript-first with `strict` mode; use the `@/*` path alias instead of relative dot paths.
- Components and hooks use PascalCase and camelCase respectively; server actions export async functions named for their side effect (`addToWaitlist`).
- Tailwind CSS powers layout; prefer utility classes plus the `cn()` helper for conditional styling, and add `"use client"` only when stateful logic requires it.
- Follow 2-space indentation, single quotes in TSX, and let ESLint surface any deviations.

## Testing Guidelines
- Automated tests are not yet scaffolded; when adding them, colocate unit specs as `*.test.ts(x)` near the code or group them under `src/__tests__`.
- Mock external services—set `TESTING=true` to trigger the Airtable no-op branch and stub `sendFacebookEvent` so tests stay offline.
- Aim to cover the waitlist flow (form validation, server action success/failure) and any future interactive components before merging.

## Commit & Pull Request Guidelines
- Follow the existing log pattern: short, imperative summaries (e.g., `tweak hero gradients`). Squash noisy WIP commits locally.
- Every PR description should link related issues, list environment changes, and include screenshots or clips for UI updates.
- Confirm `bun run lint` (and any new tests) in the PR checklist, and call out manual QA steps when external services were mocked.

## Environment & Configuration
- Store secrets in `.env.local`: `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `FACEBOOK_PIXEL_ID`, `FACEBOOK_ACCESS_TOKEN`, and optional `FACEBOOK_TEST_EVENT_CODE`.
- Never commit real keys; provide `.env.local.example` updates when introducing new variables so other contributors can replicate the setup.
