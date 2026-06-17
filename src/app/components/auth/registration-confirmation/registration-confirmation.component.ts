import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../../service/auth.service";
import {catchError, map, of, switchMap} from "rxjs";

@Component({
    selector: 'app-registration-confirmation',
    templateUrl: './registration-confirmation.component.html',
    styleUrls: ['./registration-confirmation.component.scss'],
    standalone: false
})
export class RegistrationConfirmationComponent implements OnInit {
  message: string = '';
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const token = params.get('token');

        if (!token) {
          return of<'missing' | 'confirmed' | 'failed'>('missing');
        }

        return this.authService.confirmRegistrationToken(token).pipe(
          map(() => 'confirmed' as const),
          catchError(() => of<'failed'>('failed'))
        );
      })
    ).subscribe(status => {
      if (status === 'confirmed') {
        this.message = 'Die E-Mail-Adresse wurde erfolgreich bestätigt!';
        this.error = false;
      } else if (status === 'failed') {
        this.message = 'E-Mail-Bestätigung fehlgeschlagen. Der Token ist invalide oder abgelaufen.';
        this.error = true;
      } else {
        this.message = 'Der Link ist ungültig';
        this.error = true;
      }
    });
  }
}
