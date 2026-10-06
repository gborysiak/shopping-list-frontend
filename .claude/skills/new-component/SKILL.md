---
name: new-component
description: Scaffold an Angular component (with store wiring, i18n keys and spec) following this project's conventions
disable-model-invocation: true
argument-hint: <area>/<name> [route-path]
---

Create a new component `$ARGUMENTS` under `src/app/components/<area>/<name>/`.

Follow the existing components (e.g. `components/category/category/`):

1. Create `<name>.component.ts|html|scss|spec.ts`. The component is standalone (no `standalone` flag): set `selector: 'app-<name>'`, `templateUrl`, `styleUrls` and list what the template uses in `imports` (PrimeNG components, `TranslatePipe`, ...). Use constructor injection (`Store`, `TranslateService`, ...) and the `@app/...` path aliases.
2. No module registration is needed.
3. If a route path was given, add it to `src/app/app.routes.ts` with `canActivate: [authGuard]` (add `roleGuard` + `data.expectedRole` only for admin pages).
4. If it needs state, reuse the existing feature in `src/app/store/<feature>/` (actions, selectors) instead of creating a new one, unless asked. A new feature needs actions, reducer (`createFeature`), effects and selectors, registered in `src/app/app.config.ts` (`provideState` + `provideEffects`).
5. All user-visible text goes through the `translate` pipe. Add each key to BOTH `src/assets/i18n/de.json` and `fr.json`.
6. The generated spec puts the component in `TestBed.configureTestingModule({ imports: [...] })` and provides what it needs (`provideMockStore`, `TranslateModule.forRoot()`, `provideHttpClient`, `RouterTestingModule`) so the "should create" test passes.
7. Run `npx tsc --noEmit -p tsconfig.app.json` and fix any errors.
