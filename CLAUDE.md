# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Angular 21 frontend (standalone components, `bootstrapApplication`) for a shopping-list app. It talks to a separate Spring Boot backend (repos: `shopping-list-backend`, `shopping-list-app`). UI is PrimeNG (Aura theme) + Tailwind, state is NgRx, UI text is translated with ngx-translate (`src/assets/i18n/de.json`, `fr.json`, `en.json`; `fr` is the default and fallback language). Code, entity and route names are a mix of German and English (`einkaufszettel` = shopping list, `artikel`/`part` = item, `archiv` = archive).

## Commands

```bash
npm start                                    # ng serve (development config)
npm run build                                # ng build (default config: development)
npm run build -- --configuration production  # production build
npm test                                     # Karma + Jasmine (Chrome, watch mode)
npx ng test --watch=false --browsers=ChromeHeadless   # one-shot run (scripts)
npx ng test --watch=false --browsers=ChromeHeadless --include='**/foo.spec.ts'   # single spec file
npx tsc --noEmit -p tsconfig.app.json        # quick type-check (also run by a Claude hook after .ts edits)
npm run lint                                 # ESLint (angular-eslint), also run in CI
```

ESLint is configured in `eslint.config.js`; there is no Prettier, `.editorconfig` is the only formatter config. `prefer-inject` is off on purpose (the codebase uses constructor injection) and the template accessibility rules (`elements-content`, `click-events-have-key-events`, `interactive-supports-focus`) are warnings, not errors, because fixing them needs UX decisions (icon-only buttons need labels).

Specs use the shared providers in `src/app/testing/test-providers.ts` (`testProviders`: mock store with every feature's initial state, router, HTTP testing, translate, PrimeNG services) and `fakeToken()` from `src/app/testing/fake-token.ts` to build JWTs. Effects specs use `setupEffects()` from `src/app/testing/effects-testing.ts` (mocked actions, router, toast and translate; translate returns the key). `ng build` writes to `../../dotnet_api/wwwroot` (see `outputPath` in `angular.json`); pass `--output-path <dir>` to build elsewhere.

## Architecture

- **Bootstrap**: `src/main.ts` calls `bootstrapApplication(AppComponent, appConfig)`. `src/app/app.config.ts` holds all providers (router, HTTP + `tokenInterceptor`, NgRx store/state/effects, translate, PrimeNG). Components are standalone and list their own `imports`. Routes live in `app.routes.ts`; most use `authGuard`, `/user` also needs `roleGuard` with `ROLE_ADMIN` (both are functional `CanActivateFn`s).
- **Path aliases**: `@app/*` → `src/app/*`, `@env/*` → `src/environments/*`.
- **State (NgRx)**: one folder per feature in `src/app/store/` (`auth`, `user`, `shoppinglist`, `part`, `category`, `archive`), each with `*.actions.ts`, `*.reducer.ts` (feature via `createFeature`), `*.effects.ts`, `*.selectors.ts`. Effects call the HTTP services in `src/app/service/`. Register new features in `app.config.ts` (`provideState` + `provideEffects`).
- **HTTP/auth**: `tokenInterceptor` (functional `HttpInterceptorFn`) adds the `Bearer` token to requests whose URL starts with `environment.webserviceurl`, skipping public auth URLs, and redirects to `/login` if the token is missing/invalid. HTTP errors are handled in one place: services call `HttpErrorHandlerService.handle()` from `catchError`, which shows a translated toast (network errors use `global.networkError`). `ErrorInterceptor`, `GlobalErrorHandler` and `ErrorService` are untracked, gitignored leftovers and are not wired in.
- **Environments**: `environment.ts` (dev, points at `https://localhost:7279/api`), `environment.prod.ts`, `environment.staging.ts` (swapped in via `fileReplacements` in `angular.json`). `enableDebugLogs` gates `logger.service.ts`.
- **Components**: `src/app/components/` grouped by area (`einkaufszettel`, `part`, `category`, `categorys`, `archiv`, `auth`, `admin`, `settings`, `mobile`, `common`). `mobile/` holds the mobile-specific views (e.g. `mobile/addPart/:shoppingId`).

## Build & CI

There is no Docker setup. The app is deployed by building into the sibling .NET project (`../../dotnet_api/wwwroot`, see `outputPath` in `angular.json`), which serves it. `.github/workflows/ci.yml` runs `npm ci`, a production build (with `--output-path dist`, since that sibling folder does not exist on the runner) and the tests on push and pull requests to `main`; it publishes nothing. CI runs the tests with the `ChromeHeadlessCI` launcher (no-sandbox) defined in `karma.conf.js`.

## Claude Code setup

- `.claude/settings.json` hooks: `protect-files.js` blocks edits to `.env*` and `package-lock.json`; `typecheck.js` runs `tsc` after `.ts` edits.
- `.mcp.json` provides the `context7` (library docs) and `playwright` MCP servers.
