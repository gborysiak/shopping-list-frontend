import {Component} from '@angular/core';
import {Store} from "@ngrx/store";
import {ShoppingListActions} from "../../../store/shoppinglist/shoppinglist.actions";
import {selectShoppingListById} from "../../../store/shoppinglist/shoppinglist.selectors";
import {Part} from "../../../entities/Part";
import {ShoppingList} from "../../../entities/ShoppingList";
import {ShoppingListItem} from '@app/entities/ShoppingListItem';
import {CategorysActions} from '@app/store/category/category.actions';
import {selectCategoryAndParts} from '@app/store/category/category.selectors';
import {PartsActions} from '@app/store/part/part.actions';
import {CategoryVm} from '@app/entities/CategoryMv';
import {ActivatedRoute} from '@angular/router';
import {combineLatestWith} from 'rxjs';
import {LoggerService} from "../../../service/logger.service";

@Component({
  selector: 'app-newpart',
  templateUrl: './newpart.component.html',
  styleUrl: './newpart.component.scss',
  standalone: false
})
export class NewpartComponent {
  shoppingListId: number = 0;
  shoppingList: ShoppingList | null = null;
  categoryList!: CategoryVm[];
  selectedParts: Part[] = [];
  iconVisible: boolean = false;

  constructor(private store: Store, private activatedRoute: ActivatedRoute, private logger: LoggerService ) {
  }

  ngOnInit(): void {
    this.shoppingListId = Number(this.activatedRoute.snapshot.paramMap.get('shoppingId'));
    this.logger.debug('> shoppingListId ' + this.shoppingListId);

    this.store.dispatch(PartsActions.loadParts());
    this.store.dispatch(CategorysActions.loadCategorys());
    this.store.dispatch(ShoppingListActions.loadShoppingLists());

    const categoryAndParts$ = this.store.select(selectCategoryAndParts);
    const shoppingList$ = this.store.select(selectShoppingListById(this.shoppingListId));

    categoryAndParts$.pipe(
        combineLatestWith(shoppingList$)
      )
      .subscribe(([categories, shoppingList]) => {
        if (categories) {
          this.logger.debug('categories ' + JSON.stringify(categories));
        }
        if (shoppingList) {
          this.logger.debug('shoppingList ' + JSON.stringify(shoppingList));
        }
        if (categories && shoppingList) {
          this.shoppingList = shoppingList;
          this.categoryList = this.removeAlreadySelectedParts(categories, shoppingList);
        }
       });
  }

  addItem(part: Part) {
    this.logger.debug('addItem ' + JSON.stringify(part));
    this.selectedParts.push(part);
  }

  addToShoppingList() {
    this.logger.debug('addToShoppingList ' + JSON.stringify(this.selectedParts));
    const listItems: ShoppingListItem[] = [];

    this.shoppingList!.shoppingListItem?.forEach(item => listItems.push(item));

    this.selectedParts.forEach(part => {
      const item: ShoppingListItem = {
        id: 0,
        name: part.name,
        partRefId: part.id,
        purchased: false,
        quantity: 1
      };
      listItems.push(item);
    });

    const updatedShoppingList: ShoppingList = {
      id: this.shoppingList!.id,
      name: this.shoppingList!.name,
      shoppingListItem: listItems
    };
    this.store.dispatch(ShoppingListActions.updateShoppingList({
      data: updatedShoppingList
    }));
  }

  private removeAlreadySelectedParts(categories: CategoryVm[], shoppingList: ShoppingList): CategoryVm[] {
    const categoryList: CategoryVm[] = JSON.parse(JSON.stringify(categories));

    categoryList.forEach(category => {
      if (!category.parts) {
        return;
      }

      const parts = Array.isArray(category.parts) ? category.parts : [category.parts];
      category.parts = parts.filter(part => {
        const alreadyInShoppingList = shoppingList.shoppingListItem?.some(item => part.id === item.partRefId) ?? false;
        if (alreadyInShoppingList) {
          this.logger.debug(part.name + ' deja dans la shoppinglist');
        }
        return !alreadyInShoppingList;
      });

      this.logger.debug(category.name + ' > nb p ' + category.parts.length);
    });

    return categoryList;
  }
}
