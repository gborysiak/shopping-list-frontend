import {Pipe, PipeTransform} from '@angular/core';
import {Artikel} from "../entities/artikel";

@Pipe({
    name: 'boughtArticles',
    standalone: false
})
export class BoughtArticlesPipe implements PipeTransform {

  transform(articles: Artikel[] | undefined, gekauft: boolean): Artikel[] {
    if (!articles) {
      return [];
    }
    return articles.filter(article => article.gekauft === gekauft);
  }

}
