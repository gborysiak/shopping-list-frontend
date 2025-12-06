import {Component, OnInit, inject } from '@angular/core';
import {Store} from "@ngrx/store";
import {ShoppingListActions} from "./store/shoppinglist/shoppinglist.actions";
import {ConfirmationService} from "primeng/api";
import {AuthActions} from "./store/auth/auth.actions";
import {selectLogin} from "./store/auth/auth.selectors";
import {User} from "./entities/user";
import {ConfirmDialogModule } from 'primeng/confirmdialog';
// translation
import {TranslateService, _, TranslatePipe, TranslateDirective } from "@ngx-translate/core";
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
 
  constructor(private store: Store, private confirmationService: ConfirmationService, translate: TranslateService  ) {
    translate.addLangs(['en', 'de','fr']);
    translate.setFallbackLang('fr');
    translate.use('fr');
    translate.get(_('app.hello'), {value: 'world'}).subscribe((res: string) => {
      console.log(res);
      //=> 'hello world'
    });

    const currentLang = translate.currentLang;
    console.log('Language from translate ' + currentLang);

    translate.onFallbackLangChange.subscribe(event => {
      console.log('Default language changed:', event.lang);
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
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Sind Sie sich sicher, dass Sie sich ausloggen wollen?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ja',
      rejectLabel: 'Nein',
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
