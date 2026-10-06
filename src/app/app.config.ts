import {ApplicationConfig, importProvidersFrom, isDevMode, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideState, provideStore} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import {routes} from '@app/app.routes';
import {tokenInterceptor} from '@app/interceptor/token-interceptor.service';
import {JsonFileLoader} from '@app/util/JsonLoader';
import {ShoppingListEffects} from '@app/store/shoppinglist/shoppinglist.effects';
import {shoppingListFeature} from '@app/store/shoppinglist/shoppinglist.reducer';
import {AuthEffects} from '@app/store/auth/auth.effects';
import {authFeature} from '@app/store/auth/auth.reducer';
import {UserEffects} from '@app/store/user/user.effects';
import {userFeature} from '@app/store/user/user.reducer';
import {ArchiveEffects} from '@app/store/archive/archive.effects';
import {archiveFeature} from '@app/store/archive/archive.reducer';
import {PartEffects} from '@app/store/part/part.effects';
import {partFeature} from '@app/store/part/part.reducer';
import {CategoryEffects} from '@app/store/category/category.effects';
import {categoryFeature} from '@app/store/category/category.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    importProvidersFrom(TranslateModule.forRoot({
      loader: {provide: TranslateLoader, useClass: JsonFileLoader}
    })),
    provideStore(),
    provideState(shoppingListFeature),
    provideState(authFeature),
    provideState(userFeature),
    provideState(archiveFeature),
    provideState(partFeature),
    provideState(categoryFeature),
    provideEffects(ShoppingListEffects, AuthEffects, UserEffects, ArchiveEffects, PartEffects, CategoryEffects),
    provideStoreDevtools({maxAge: 25, logOnly: !isDevMode(), connectInZone: true}),
    MessageService,
    ConfirmationService,
    DialogService,
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ]
};
