import {Component, OnInit, Inject} from '@angular/core';
import {NgClass, NgStyle} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {Toast} from 'primeng/toast';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {NavigationLinksComponent} from '@app/components/common/navigation-links/navigation-links.component';
import {Title} from '@angular/platform-browser';
import {Store} from "@ngrx/store";
import {ConfirmationService} from "primeng/api";
import {AuthActions} from "@app/store/auth/auth.actions";
import {selectLogin} from "@app/store/auth/auth.selectors";
import {User} from "@app/entities/user";
// translation
import {TranslateService, TranslatePipe} from "@ngx-translate/core";
import {LoggerService} from "@app/service/logger.service";
import {AuthService} from "@app/service/auth.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [NgClass, NgStyle, RouterOutlet, RouterLink, NavigationLinksComponent, Toast, ConfirmDialog, TranslatePipe]
})
export class AppComponent implements OnInit {
  userIsLoggedIn = false;
  userLoggedIn: User | undefined;
  mobileMenuVisible = false;
  profileMenuVisible = false;
  message= '';
  yes = '';
  no= '';
 
  constructor(private store: Store, private confirmationService: ConfirmationService, private translate: TranslateService,
    private title: Title, @Inject(LoggerService) private logger: LoggerService, private authService: AuthService ) {
    translate.addLangs(['en', 'de','fr']);
    translate.setFallbackLang('fr');
    translate.use('fr');
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

    this.authService.restoreLoginState();
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
