import {Pipe, PipeTransform} from '@angular/core';
import {Part} from "../entities/Part";

@Pipe({
    name: 'boughtArticles',
    standalone: false
})
export class BoughtArticlesPipe implements PipeTransform {

  transform(articles: Part[] | undefined, purchased: boolean): Part[] {
    if (!articles) {
      return [];
    }
    return articles.filter(article => article.purchased === purchased);
  }

}
