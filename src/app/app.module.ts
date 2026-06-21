import {isDevMode, NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {AppRoutingModule} from '@app/app-routing.module';
import {AppComponent} from '@app/app.component';
import {HomeComponent} from '@app/components/einkaufszettel/home/home.component';
import {StoreModule, provideStore } from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {ShoppingListEffects} from "@app/store/shoppinglist/shoppinglist.effects";
import {shoppingListReducer} from "@app/store/shoppinglist/shoppinglist.reducer";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi,HttpClient  } from "@angular/common/http";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PanelModule} from "primeng/panel";
import {EditArtikelComponent} from '@app/components/einkaufszettel/edit-artikel/edit-artikel.component';
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {Message, MessageModule} from "primeng/message";
import {LoginComponent} from '@app/components/auth/login/login.component';
import {TokenInterceptor} from "@app/interceptor/token-interceptor.service";
import {PasswordModule} from "primeng/password";
import {RegisterComponent} from '@app/components/auth/register/register.component';
import {ConfirmationService, MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {ArchivComponent} from '@app/components/archiv/archiv.component';
import {DividerModule} from "primeng/divider";
import { EditEinkaufszettelComponent} from '@app/components/einkaufszettel/edit-einkaufszettel/edit-einkaufszettel.component';
import {MultiSelectModule} from "primeng/multiselect";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TableModule} from "primeng/table";
import {TooltipModule} from "primeng/tooltip";
import {UserComponent} from '@app/components/admin/user/user.component';
import {RegistrationConfirmationComponent} from '@app/components/auth/registration-confirmation/registration-confirmation.component';
import {AuthEffects} from "@app/store/auth/auth.effects";
import {authFeature} from "@app/store/auth/auth.reducer";
import {UserEffects} from "@app/store/user/user.effects";
import {userFeature} from "@app/store/user/user.reducer";
import {ArchiveEffects} from "@app/store/archive/archive.effects";
import {archiveFeature} from "@app/store/archive/archive.reducer";
import { shoppingListFeature } from '@app/store/shoppinglist/shoppinglist.reducer';
import {NavigationLinksComponent} from '@app/components/common/navigation-links/navigation-links.component';
import {SplitButtonComponent} from '@app/components/common/split-button/split-button.component';
import {BoughtArticlesPipe} from '@app/pipe/bought-articles.pipe';
import {ProfileEditComponent} from '@app/components/settings/profile-edit/profile-edit.component';
import {FileUploadModule} from "primeng/fileupload";
import {ImageCropperComponent} from '@app/components/common/image-cropper/image-cropper.component';
import {DialogModule} from "primeng/dialog";
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
//import { AvatarComponent } from '@app/components/settings/profile-edit/avatar/avatar.component';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
///import { ErrorInterceptor } from '@app/interceptor/ErrorInterceptor.service';
//import { GlobalErrorHandler } from '@app/core/globalErrorHandler';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, provideTranslateCompiler } from '@ngx-translate/core';
import { provideTranslateHttpLoader, } from '@ngx-translate/http-loader';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JsonFileLoader } from '@app/util/JsonLoader';
import { CustomHttpLoader } from '@app/util/CustomHttpLoader';
import { provideStoreDevtools  } from '@ngrx/store-devtools';
import { partFeature, partReducer } from '@app/store/part/part.reducer';
import { PartEffects } from '@app/store/part/part.effects';
import { PartComponent } from '@app/components/part/part/part.component';
import { categoryFeature, categoryReducer } from '@app/store/category/category.reducer';
import { CategoryEffects } from '@app/store/category/category.effects';
import { CategoryComponent } from '@app/components/category/category/category.component';
import { AccordionModule } from 'primeng/accordion';
import { SelectModule } from 'primeng/select';
import { ListboxModule } from 'primeng/listbox';
import { SplitterModule } from 'primeng/splitter';
//import { DragDropModule} from '@angular/cdk/drag-drop';
import { DragDropModule } from 'primeng/dragdrop';
import { NewpartComponent } from '@app/components/mobile/newpart/newpart.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CategorysComponent } from '@app/components/categorys/categorys.component';


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
        NewpartComponent,
        CategorysComponent
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
        DragDropModule,
        ScrollPanelModule

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
