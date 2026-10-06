# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Angular 21 frontend (NgModule-based, not standalone bootstrap) for a shopping-list app. It talks to a separate Spring Boot backend (repos: `shopping-list-backend`, `shopping-list-app`). UI is PrimeNG (Aura theme) + Tailwind, state is NgRx, UI text is translated with ngx-translate (`src/assets/i18n/de.json`, `fr.json`). Code, entity and route names are a mix of German and English (`einkaufszettel` = shopping list, `artikel`/`part` = item, `archiv` = archive).

## Commands

```bash
npm start                                    # ng serve (development config)
npm run build                                # ng build (default config: development)
npm run build -- --configuration production  # production build (what the Dockerfile uses)
npm test                                     # Karma + Jasmine (Chrome)
npx ng test --include='**/foo.spec.ts'       # single spec file
npx tsc --noEmit -p tsconfig.app.json        # quick type-check (also run by a Claude hook after .ts edits)
```

There is no ESLint/Prettier setup; `.editorconfig` is the only style config.

## Architecture

- **Bootstrap**: `src/app/app.module.ts` declares/imports nearly everything (PrimeNG modules, components, store, interceptors, translate). New components must be declared/imported there. Routes live in `app-routing.module.ts`; most are behind `AuthGuard`, `/user` also needs `RoleGuard` with `ROLE_ADMIN`.
- **Path aliases**: `@app/*` → `src/app/*`, `@env/*` → `src/environments/*`.
- **State (NgRx)**: one folder per feature in `src/app/store/` (`auth`, `user`, `shoppinglist`, `part`, `category`, `archive`), each with `*.actions.ts`, `*.reducer.ts` (feature via `createFeature`), `*.effects.ts`, `*.selectors.ts`. Effects call the HTTP services in `src/app/service/`. Wire new features into `app.module.ts` (feature + effects).
- **HTTP/auth**: `TokenInterceptor` adds the `Bearer` token to requests whose URL starts with `environment.webserviceurl`, skipping public auth URLs, and redirects to `/login` if the token is missing/invalid. HTTP errors are handled in one place: services call `HttpErrorHandlerService.handle()` from `catchError`, which shows a translated toast (network errors use `global.networkError`). `ErrorInterceptor`, `GlobalErrorHandler` and `ErrorService` are untracked, gitignored leftovers and are not wired in.
- **Environments**: `environment.ts` (dev, points at `https://localhost:7279/api`), `environment.prod.ts`, `environment.staging.ts` (swapped in via `fileReplacements` in `angular.json`). `enableDebugLogs` gates `logger.service.ts`.
- **Components**: `src/app/components/` grouped by area (`einkaufszettel`, `part`, `category`, `categorys`, `archiv`, `auth`, `admin`, `settings`, `mobile`, `common`). `mobile/` holds the mobile-specific views (e.g. `mobile/addPart/:shoppingId`).

## Build & deploy
#The Dockerfile builds with `--configuration production` and serves the output with nginx (`nginx.conf`). The GitHub Actions workflow builds and pushes a multi-arch image to Docker Hub on push/PR to `main`.



## Claude Code setup

- `.claude/settings.json` hooks: `protect-files.js` blocks edits to `.env*` and `package-lock.json`; `typecheck.js` runs `tsc` after `.ts` edits.
- `.mcp.json` provides the `context7` (library docs) and `playwright` MCP servers.
