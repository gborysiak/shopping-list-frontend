import {Pipe, PipeTransform} from '@angular/core';
//import {Part} from "../entities/Part";
import { ShoppinglistItem } from '../entities/ShoppingListItem';

@Pipe({
    name: 'boughtArticles',
    standalone: false
})
export class BoughtArticlesPipe implements PipeTransform {

  transform(items: ShoppinglistItem[] | undefined, purchased: boolean): ShoppinglistItem[] {
    if (!items) {
      return [];
    }
    return items.filter(item => item.purchased === purchased);
  }

}
