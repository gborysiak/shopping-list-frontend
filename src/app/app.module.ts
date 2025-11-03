import {isDevMode, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/einkaufszettel/home/home.component';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {ShoppingListEffects} from "./store/shoppinglist/shoppinglist.effects";
import {shoppingListReducer} from "./store/shoppinglist/shoppinglist.reducer";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PanelModule} from "primeng/panel";
//import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {EditArtikelComponent} from './components/einkaufszettel/edit-artikel/edit-artikel.component';
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {MessageModule} from "primeng/message";
//import {MessagesModule} from "primeng/messages";
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
        ProfileEditComponent
        //AvatarComponent
    ],
    bootstrap: [AppComponent], 
    imports: [
        BrowserModule,
        StoreModule,
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

        FileUploadModule,
        PasswordModule,
        TableModule,
        MultiSelectModule,
        CheckboxModule,
        InputNumberModule,
        DynamicDialogModule,
        ToastModule,
        ConfirmDialogModule 
          ], 
        providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        MessageService, 
        ConfirmationService,
        DialogService,
        providePrimeNG({
            theme: {
                preset: Aura
            }
        }),
        provideHttpClient(withInterceptorsFromDi())
    ] })
    
export class AppModule {
}
