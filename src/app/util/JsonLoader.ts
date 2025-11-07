import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

// Import your translation files
import frTranslations from '../../assets/i18n/fr.json';
import enTranslations from '../../assets/i18n/fr.json';
import deTranslations from '../../assets/i18n/de.json';


@Injectable()
export class JsonFileLoader implements TranslateLoader {
  private translations: { [key: string]: any } = {
    'en': enTranslations,
    'de': deTranslations,
    'fr': frTranslations  
  };

  getTranslation(lang: string): Observable<any> { 
    console.log('$$ JsonFileLoader.getTranslation');
    // Return the imported translations for the requested language
    const translation = this.translations[lang];

    if (translation) {
      return of(translation);
    }

    // Fallback to empty object if language not found
    return of({});
  }
}