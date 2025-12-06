import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';


export class CustomHttpLoader implements TranslateLoader {
constructor(private http: HttpClient) {}

    getTranslation(lang: string): Observable<any> {
        console.log('$ CustomHttpLoader.getTranslation ');
        const url = `/assets/i18n/fr.json`;

        return this.http.get(url);

        //const translation = this.http.get(url);
        //console.log(translation);
        //return of(translation);
        //return of(this.http.get(url)); // Fetch translations from an API
}
}