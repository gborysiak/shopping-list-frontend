import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  static debug(...args: unknown[]): void {
    if (environment.enableDebugLogs) {
      console.log(...args);
    }
  }

  debug(...args: unknown[]): void {
    LoggerService.debug(...args);
  }
}
