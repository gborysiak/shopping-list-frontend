import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {LoggerService} from "../service/logger.service";


export class CustomHttpLoader implements TranslateLoader {
constructor(private http: HttpClient) {}

    getTranslation(lang: string): Observable<any> {
        LoggerService.debug('$ CustomHttpLoader.getTranslation ');
        const url = `/assets/i18n/fr.json`;

        return this.http.get(url);

        //const translation = this.http.get(url);
        //LoggerService.debug(translation);
        //return of(translation);
        //return of(this.http.get(url)); // Fetch translations from an API
}
}
