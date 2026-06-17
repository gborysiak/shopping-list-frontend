import {Injectable} from '@angular/core';
import {Observable, throwError} from "rxjs";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {

  constructor(private messageService: MessageService, private translate: TranslateService) {
  }

  handle(error: any, summaryKey = 'shoppinglistservice.error'): Observable<never> {
    const summary = this.translate.instant(summaryKey) + this.getErrorMessage(error);
    this.messageService.add({severity: 'error', summary});
    return throwError(() => error);
  }

  handleWithSummary(error: any, summary: string): Observable<never> {
    this.messageService.add({severity: 'error', summary});
    return throwError(() => error);
  }

  rethrow(error: any): Observable<never> {
    return throwError(() => error);
  }

  private getErrorMessage(error: any): string {
    const err = error?.error ?? error;

    if (err?.status === 400 && err.errors) {
      return Object.entries(err.errors)
        .map(([key, value]) => `${key} ${String(value)}`)
        .join('');
    }

    if (err?.status === 500 && err.detail) {
      return err.detail;
    }

    return err?.message || err?.errorMessage || err?.title || error?.message || String(err);
  }
}
