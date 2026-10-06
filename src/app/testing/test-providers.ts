import {EnvironmentProviders, Provider} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';
import {provideMockStore} from '@ngrx/store/testing';
import {TranslateModule} from '@ngx-translate/core';
import {importProvidersFrom} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DialogService} from 'primeng/dynamicdialog';
import {shoppingListFeature} from '@app/store/shoppinglist/shoppinglist.reducer';
import {authFeature} from '@app/store/auth/auth.reducer';
import {userFeature} from '@app/store/user/user.reducer';
import {archiveFeature} from '@app/store/archive/archive.reducer';
import {partFeature} from '@app/store/part/part.reducer';
import {categoryFeature} from '@app/store/category/category.reducer';

const features = [shoppingListFeature, authFeature, userFeature, archiveFeature, partFeature, categoryFeature];

/** Initial state of the whole store, built from each feature's own initial state. */
export const initialTestState = Object.fromEntries(
  features.map(feature => [feature.name, feature.reducer(undefined, {type: '@@test-init'})])
);

/** Providers needed to create most components in a TestBed. */
export const testProviders: (Provider | EnvironmentProviders)[] = [
  provideMockStore({initialState: initialTestState}),
  provideRouter([]),
  provideHttpClient(),
  provideHttpClientTesting(),
  importProvidersFrom(TranslateModule.forRoot()),
  MessageService,
  ConfirmationService,
  DialogService
];
