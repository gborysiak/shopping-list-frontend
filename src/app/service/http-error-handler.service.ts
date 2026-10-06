import {Injectable} from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {MessageService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";

interface ApiError {
  status?: number;
  errors?: Record<string, unknown>;
  detail?: string;
  message?: string;
  errorMessage?: string;
  title?: string;
}

/** Single place where HTTP errors are turned into a toast. Services call it from catchError. */
@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerService {

  constructor(private messageService: MessageService, private translate: TranslateService) {
  }

  handle(error: unknown, summaryKey = 'shoppinglistservice.error'): Observable<never> {
    const summary = this.isNetworkError(error)
      ? this.translate.instant('global.networkError')
      : this.translate.instant(summaryKey) + this.getErrorMessage(error);
    this.messageService.add({severity: 'error', summary});
    return throwError(() => error);
  }

  handleWithSummary(error: unknown, summary: string): Observable<never> {
    this.messageService.add({severity: 'error', summary});
    return throwError(() => error);
  }

  rethrow(error: unknown): Observable<never> {
    return throwError(() => error);
  }

  private isNetworkError(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 0;
  }

  private getErrorMessage(error: unknown): string {
    const wrapper = error as {error?: unknown; message?: string} | null | undefined;
    const err = (wrapper?.error ?? error) as ApiError | string | null | undefined;

    if (typeof err === 'object' && err !== null) {
      if (err.status === 400 && err.errors) {
        return Object.entries(err.errors)
          .map(([key, value]) => `${key} ${String(value)}`)
          .join('');
      }

      if (err.status === 500 && err.detail) {
        return err.detail;
      }

      return err.message || err.errorMessage || err.title || wrapper?.message || String(err);
    }

    return wrapper?.message || String(err);
  }
}
