import {isDevMode, NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/einkaufszettel/home/home.component';
import {StoreModule, provideStore } from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {ShoppingListEffects} from "./store/shoppinglist/shoppinglist.effects";
import {shoppingListReducer} from "./store/shoppinglist/shoppinglist.reducer";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi,HttpClient  } from "@angular/common/http";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PanelModule} from "primeng/panel";
import {EditArtikelComponent} from './components/einkaufszettel/edit-artikel/edit-artikel.component';
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {Message, MessageModule} from "primeng/message";
import {LoginComponent} from './components/auth/login/login.component';
import {TokenInterceptor} from "./interceptor/token-interceptor.service";
import {PasswordModule} from "primeng/password";
import {RegisterComponent} from './components/auth/register/register.component';
import {ConfirmationService, MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {ArchivComponent} from './components/archiv/archiv.component';
import {DividerModule} from "primeng/divider";
import { EditEinkaufszettelComponent} from './components/einkaufszettel/edit-einkaufszettel/edit-einkaufszettel.component';
import {MultiSelectModule} from "primeng/multiselect";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {UserComponent} from './components/admin/user/user.component';
import {RegistrationConfirmationComponent} from './components/auth/registration-confirmation/registration-confirmation.component';
import {AuthEffects} from "./store/auth/auth.effects";
import {authFeature} from "./store/auth/auth.reducer";
import {UserEffects} from "./store/user/user.effects";
import {userFeature} from "./store/user/user.reducer";
import {ArchiveEffects} from "./store/archive/archive.effects";
import {archiveFeature} from "./store/archive/archive.reducer";
import { shoppingListFeature } from './store/shoppinglist/shoppinglist.reducer';
import {NavigationLinksComponent} from './components/common/navigation-links/navigation-links.component';
import {SplitButtonComponent} from './components/common/split-button/split-button.component';
import {BoughtArticlesPipe} from './pipe/bought-articles.pipe';
import {ProfileEditComponent} from './components/settings/profile-edit/profile-edit.component';
import {FileUploadModule} from "primeng/fileupload";
import {ImageCropperComponent} from './components/common/image-cropper/image-cropper.component';
import {DialogModule} from "primeng/dialog";
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
//import { AvatarComponent } from './components/settings/profile-edit/avatar/avatar.component';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
///import { ErrorInterceptor } from './interceptor/ErrorInterceptor.service';
//import { GlobalErrorHandler } from './core/globalErrorHandler';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, provideTranslateCompiler } from '@ngx-translate/core';
import { provideTranslateHttpLoader, } from '@ngx-translate/http-loader';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JsonFileLoader } from './util/JsonLoader';
import { CustomHttpLoader } from './util/CustomHttpLoader';
import { provideStoreDevtools  } from '@ngrx/store-devtools';
import { partFeature, partReducer } from './store/part/part.reducer';
import { PartEffects } from './store/part/part.effects';
import { PartComponent } from './components/part/part/part.component';
import { categoryFeature, categoryReducer } from './store/category/category.reducer';
import { CategoryEffects } from './store/category/category.effects';
import { CategoryComponent } from './components/category/category/category.component';
import { AccordionModule } from 'primeng/accordion';
import { SelectModule } from 'primeng/select';
import { ListboxModule } from 'primeng/listbox';
import { SplitterModule } from 'primeng/splitter';
//import { DragDropModule} from '@angular/cdk/drag-drop';
import { DragDropModule } from 'primeng/dragdrop';
import { MobilehomeComponent } from './components/mobile/mobilehome/mobilehome.component';
import { NewpartComponent } from './components/mobile/newpart/newpart.component';

export function HttpLoaderFactory(http: HttpClient) {
        return new JsonFileLoader();
        //return new CustomHttpLoader(http);
}

@NgModule({ declarations: [
        AppComponent,
        HomeComponent,
        EditArtikelComponent,
        LoginComponent,
        RegisterComponent,
        ArchivComponent,
        EditEinkaufszettelComponent,
        UserComponent,
        RegistrationConfirmationComponent,
        NavigationLinksComponent,
        SplitButtonComponent,
        BoughtArticlesPipe,
        ProfileEditComponent,
        PartComponent,
        CategoryComponent,
        MobilehomeComponent,
        NewpartComponent
        //AvatarComponent
    ],
    bootstrap: [AppComponent], 
    imports: [
        BrowserModule,
        StoreModule,
        TranslateModule.forRoot({
            loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
            }
            }),
       
        //BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        CommonModule,
        // ngrx
        StoreModule.forRoot({}, {}),
        EffectsModule.forRoot([]),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() , connectInZone: true}),
        EffectsModule.forFeature([ShoppingListEffects]),
        StoreModule.forFeature(shoppingListFeature),
        EffectsModule.forFeature([AuthEffects]),
        StoreModule.forFeature(authFeature),
        EffectsModule.forFeature([UserEffects]),
        StoreModule.forFeature(userFeature),
        EffectsModule.forFeature([ArchiveEffects]),
        StoreModule.forFeature(archiveFeature),
        EffectsModule.forFeature([PartEffects]),
        StoreModule.forFeature(partFeature),
        EffectsModule.forFeature([CategoryEffects]),
        StoreModule.forFeature(categoryFeature),

        FileUploadModule,
        PasswordModule,
        TableModule,
        MultiSelectModule,
        CheckboxModule,
        InputNumberModule,
        DynamicDialogModule,
        ToastModule,
        ConfirmDialogModule,
        MessageModule,
        AccordionModule,
        SelectModule,
        ListboxModule,
        SplitterModule,
        DragDropModule
        //TranslateModule, /*<--- Don't forget to import this too*/
        /*
        TranslateModule.forRoot({
           loader: provideTranslateHttpLoader({
            prefix: '/assets/i18n/',
            suffix: '.json'}),
           fallbackLang: 'fr',
           lang: 'fr'
        })*/
          ], 
        providers: [
             provideAnimations(),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        /* 
        { 
            provide: ErrorHandler, 
            useClass: GlobalErrorHandler 
        },
        { 
            provide: HTTP_INTERCEPTORS, 
            useClass: ErrorInterceptor, 
            multi: true 
        }, */
        MessageService, 
        ConfirmationService,
        DialogService,
        providePrimeNG({
            theme: {
                preset: Aura
            }
        }),
        provideHttpClient(withInterceptorsFromDi()),
        provideStore(),
        provideStoreDevtools()
        ]})
    
export class AppModule {
}
