import { Component, OnInit } from '@angular/core';
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
import { MessageService } from "primeng/api";
import { combineLatest } from "rxjs";
import { LoggerService } from "../../../service/logger.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit {
  shoppingLists: ShoppingList[] = [];
  categoryList: CategoryVm[] = [];
  currentlyDragging: Part | null = null;
  selected: Part[] = [];
  iconVisible: boolean = false;

  constructor(private store: Store, private msg: MessageService, private logger: LoggerService) {
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
    ]).subscribe(([shoppingLists, parts]) => {
      this.shoppingLists = this.enrichShoppingListsWithParts(shoppingLists, parts);
      /* a revoir
      this.shoppingLists.forEach(shoppingList => shoppingList.shoppingListActions = [
        {label: 'Parameters', routerLink: ['/einkaufszettel', shoppingList.id], icon: 'fas fa-gear'},
        {
          label: 'Archive purchased parts',
          callback: () => this.archivePurchasedItems(shoppingList),
          icon: 'fas fa-box-archive'
        },
      ]);
      */
    });

    this.store.select(selectCategoryAndParts).subscribe(category => {
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
    item.purchaseDate = new Date();
    item.purchased = true;
    this.store.dispatch(ShoppingListActions.updateItem({
      shoppingId: shoppingList.id,
      data: item
    }));
  }

  toggleItemPurchased(shoppingList: ShoppingList, item: ShoppingListItem) {
    item.purchased = !item.purchased;
    this.store.dispatch(ShoppingListActions.updateItem({
      shoppingId: shoppingList.id,
      data: item
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
    this.logger.debug("** dragStart > " + JSON.stringify(this.currentlyDragging));

    // Show the toast message on the frontend
    this.msg.add({
      severity: "info",
      summary: "Drag Started",
      detail: "onDragStart Event"
    });
  }

  drag() {
    // Show the toast message on the frontend
    this.logger.debug("** drag");
    this.msg.add({
      severity: "success",
      summary: "Dragging...",
      detail: "onDrag Event"
    });
  }

  // On Drag End
  dragEnd() {
    this.logger.debug("** dragEnd");
    this.currentlyDragging = null;
    // Show the toast message on the frontend
    this.msg.add({
      severity: "error",
      summary: "Drag End",
      detail: "onDragEnd Event"
    });
  }

  // On Drop of Item to droppable area
  drop(shoppingList: ShoppingList) {


    this.logger.debug("** drop " + JSON.stringify(shoppingList));
    if (this.currentlyDragging) {
      this.logger.debug("*** drop > " + JSON.stringify(this.currentlyDragging));
      //let currentlyDraggingIndex = this.findIndex(this.currentlyDragging);
      this.selected = [...this.selected, this.currentlyDragging];
      this.logger.debug("*** drop > " + JSON.stringify(this.selected));
      //this.available = this.available.filter(
      //    (val, i) => i != currentlyDraggingIndex
      //);
      const item: ShoppingListItem = {
        id: 0,
        name: this.currentlyDragging.name,
        partRefId: this.currentlyDragging.id,
        purchased: false,
        quantity: 1
      };
      /*
      this.store.dispatch(ShoppingListActions.createItem({
            shoppingId: shoppingList.id,
        data: item
      }));
      */
      const lstItems: ShoppingListItem[] = [];
      shoppingList.shoppingListItem?.forEach(val => lstItems.push(val));
      // add new
      lstItems.push(item);

      const updatedShoppingList: ShoppingList = {
        id: shoppingList.id,
        name: shoppingList.name,
        shoppingListItem: lstItems
      };
      shoppingList.shoppingListItem?.push(item);
      this.store.dispatch(ShoppingListActions.updateShoppingList({
        data: updatedShoppingList
      }));

      this.currentlyDragging = null;
    }
  }

  /*
  // Find the Index of a Person
  findIndex(person: Person) {
      let index = -1;
      for (let i = 0; i < this.available.length; i++) {
          if (person.id === this.available[i].id) {
              index = i;
              break;
          }
      }
      return index;
  }
      */
}
