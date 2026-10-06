import {Pipe, PipeTransform} from '@angular/core';
import { ShoppingListItem } from '../entities/ShoppingListItem';

@Pipe({ name: 'boughtArticles' })
export class BoughtArticlesPipe implements PipeTransform {

  transform(items: ShoppingListItem[] | undefined, purchased: boolean): ShoppingListItem[] {
    if (!items) {
      return [];
    }
    return items.filter(item => item.purchased === purchased);
  }

}
