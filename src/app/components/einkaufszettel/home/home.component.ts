import {Component, OnInit, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { Store } from "@ngrx/store";
import { ShoppingListActions } from "../../../store/shoppinglist/shoppinglist.actions";
import { selectAllShoppingList } from "../../../store/shoppinglist/shoppinglist.selectors";
import { Part } from "../../../entities/Part";
import { ShoppingList } from "../../../entities/ShoppingList";
import { ShoppingListItem } from '@app/entities/ShoppingListItem';
import { CategorysActions } from '@app/store/category/category.actions';
import { selectCategoryAndParts } from '@app/store/category/category.selectors';
import { PartsActions } from '@app/store/part/part.actions';
import { selectAllPart } from '@app/store/part/part.selector';
import { CategoryVm } from '@app/entities/CategoryMv';
import { combineLatest } from "rxjs";
import { LoggerService } from "../../../service/logger.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  shoppingLists: ShoppingList[] = [];
  categoryList: CategoryVm[] = [];
  currentlyDragging: Part | null = null;
  selected: Part[] = [];
  iconVisible: boolean = false;

  constructor(private store: Store, private logger: LoggerService) {
  }

  archivePurchasedItems(shoppingList: ShoppingList) {
    this.store.dispatch(ShoppingListActions.archiveItem({ shoppingId: shoppingList.id }));
  }

  ngOnInit(): void {
    this.store.dispatch(ShoppingListActions.loadShoppingLists());
    this.store.dispatch(PartsActions.loadParts());
    this.store.dispatch(CategorysActions.loadCategorys());

    combineLatest([
      this.store.select(selectAllShoppingList),
      this.store.select(selectAllPart)
    ]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(([shoppingLists, parts]) => {
      this.shoppingLists = this.enrichShoppingListsWithParts(shoppingLists, parts);
    });

    this.store.select(selectCategoryAndParts).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(category => {
      this.categoryList = this.normalizeCategoryParts(category);
    });

  }

  private enrichShoppingListsWithParts(shoppingLists: ShoppingList[], parts: Part[]): ShoppingList[] {
    const enrichedShoppingLists: ShoppingList[] = JSON.parse(JSON.stringify(shoppingLists));

    enrichedShoppingLists.forEach(shoppingList => {
      shoppingList.shoppingListItem?.forEach(item => {
        const part = parts.find(part => part.id === item.partRefId);
        if (part) {
          item.part = part;
        }
      });
    });

    return enrichedShoppingLists;
  }

  private normalizeCategoryParts(categories: CategoryVm[]): CategoryVm[] {
    const categoryList: CategoryVm[] = JSON.parse(JSON.stringify(categories));

    categoryList.forEach(category => {
      if (category.parts && !Array.isArray(category.parts)) {
        category.parts = [category.parts];
      }
    });

    return categoryList;
  }

  modifyItem(shoppingList: ShoppingList, item: ShoppingListItem) {
    this.store.dispatch(ShoppingListActions.updateItem({
      shoppingId: shoppingList.id,
      data: {...item, purchaseDate: new Date(), purchased: true}
    }));
  }

  toggleItemPurchased(shoppingList: ShoppingList, item: ShoppingListItem) {
    this.store.dispatch(ShoppingListActions.updateItem({
      shoppingId: shoppingList.id,
      data: {...item, purchased: !item.purchased}
    }));
  }

  resetShoppingList(shoppingList: ShoppingList) {
    this.store.dispatch(ShoppingListActions.resetShoppingList({
      data: shoppingList }));
  }

  mouseEnter() {
    this.logger.debug("mouse enter");
    this.iconVisible = true;
  }

  mouseLeave() {
    this.logger.debug("mouse leave");
    this.iconVisible = false;
  }

  dragStart(part: Part) {
    this.currentlyDragging = part;
    this.logger.debug("** dragStart > " + JSON.stringify(part));
  }

  dragEnd() {
    this.logger.debug("** dragEnd");
    this.currentlyDragging = null;
  }

  drop(shoppingList: ShoppingList) {
    const part = this.currentlyDragging;
    if (!part) {
      return;
    }
    this.logger.debug("** drop > " + JSON.stringify(part));
    this.selected = [...this.selected, part];

    const item: ShoppingListItem = {
      id: 0,
      name: part.name,
      partRefId: part.id,
      purchased: false,
      quantity: 1
    };

    this.store.dispatch(ShoppingListActions.updateShoppingList({
      data: {
        id: shoppingList.id,
        name: shoppingList.name,
        shoppingListItem: [...(shoppingList.shoppingListItem ?? []), item]
      }
    }));

    this.currentlyDragging = null;
  }
}
