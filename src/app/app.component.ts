import {Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {Store} from "@ngrx/store";
//import {ShoppingListActions} from "./store/shoppinglist/shoppinglist.actions";
import {ConfirmationService} from "primeng/api";
import {AuthActions} from "@app/store/auth/auth.actions";
import {selectLogin} from "@app/store/auth/auth.selectors";
import {User} from "@app/entities/user";
//import {ConfirmDialogModule } from 'primeng/confirmdialog';
// translation
import {TranslateService, _, TranslatePipe, TranslateDirective } from "@ngx-translate/core";
import {LoggerService} from "@app/service/logger.service";
//import translationsFR from "../../public/i18n/fr.json";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  userIsLoggedIn = false;
  userLoggedIn: User | undefined;
  mobileMenuVisible = false;
  profileMenuVisible = false;
  message: string= '';
  yes: string = '';
  no: string= '';
 
  constructor(private store: Store, private confirmationService: ConfirmationService, private translate: TranslateService,
    private title: Title, @Inject(LoggerService) private logger: LoggerService ) {
    translate.addLangs(['en', 'de','fr']);
    translate.setFallbackLang('fr');
    translate.use('fr');
    /*
    translate.get(_('app.hello'), {value: 'world'}).subscribe((res: string) => {
      this.logger.debug(res);
      //=> 'hello world'
    });
    */
    const currentLang = translate.currentLang;
    this.logger.debug('Language from translate ' + currentLang);

    this.title.setTitle( this.translate.instant('app.title'));
      
    translate.onFallbackLangChange.subscribe(event => {
      this.logger.debug('Default language changed:', event.lang);
});
  }



  ngOnInit(): void {
    this.store.select(selectLogin).subscribe(user => {
      this.userLoggedIn = user != null ? user : undefined;
      this.userIsLoggedIn = user != null;
      this.mobileMenuVisible = false;
      this.profileMenuVisible = false;
    });

  }

  logout(event: Event) {
    this.message = this.translate.instant('global.msgLogout');
    this.yes = this.translate.instant('global.yes');
    this.no = this.translate.instant('global.no');

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.message,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.yes,
      rejectLabel: this.no,
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.store.dispatch(AuthActions.logout());
        this.profileMenuVisible = false;
        this.mobileMenuVisible = false;
      }
    });
  }

  toggleMobileMenu() {
    this.mobileMenuVisible = !this.mobileMenuVisible;
  }

  toggleProfileMenu() {
    this.profileMenuVisible = !this.profileMenuVisible;
  }
}
