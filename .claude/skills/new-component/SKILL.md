---
name: new-component
description: Scaffold an Angular component (with store wiring, i18n keys and spec) following this project's conventions
disable-model-invocation: true
argument-hint: <area>/<name> [route-path]
---

Create a new component `$ARGUMENTS` under `src/app/components/<area>/<name>/`.

Follow the existing components (e.g. `components/category/category/`):

1. Create `<name>.component.ts|html|scss|spec.ts`. The class is declared in an NgModule, so use `standalone: false`, `selector: 'app-<name>'`, `templateUrl` and `styleUrls`. Use constructor injection (`Store`, `TranslateService`, ...) and the `@app/...` path aliases.
2. Declare the component in `src/app/app.module.ts` (`declarations`), and import any new PrimeNG module it uses there.
3. If a route path was given, add it to `src/app/app-routing.module.ts` with `canActivate: [AuthGuard]` (add `RoleGuard` + `data.expectedRole` only for admin pages).
4. If it needs state, reuse the existing feature in `src/app/store/<feature>/` (actions, selectors) instead of creating a new one, unless asked. A new feature needs actions, reducer (`createFeature`), effects and selectors, registered in `app.module.ts`.
5. All user-visible text goes through the `translate` pipe. Add each key to BOTH `src/assets/i18n/de.json` and `fr.json`.
6. Because the component is not standalone, the generated spec must NOT put it in `imports`. Declare it in `TestBed.configureTestingModule({ declarations: [...] })` and provide what it needs (`provideMockStore`, `TranslateModule.forRoot()`, `provideHttpClient`, `RouterTestingModule`) so the "should create" test passes.
7. Run `npx tsc --noEmit -p tsconfig.app.json` and fix any errors.
