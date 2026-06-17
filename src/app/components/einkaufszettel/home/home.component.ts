import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ShoppingListActions} from "../../../store/shoppinglist/shoppinglist.actions";
import {selectAllShoppingList} from "../../../store/shoppinglist/shoppinglist.selectors";
import {Part} from "../../../entities/Part";
import {ShoppingList} from "../../../entities/ShoppingList";
import { ShoppinglistItem } from 'src/app/entities/ShoppingListItem';
import { CategorysActions } from 'src/app/store/category/category.actions';
import { selectCategoryAndParts} from 'src/app/store/category/category.selectors';
import { PartsActions } from 'src/app/store/part/part.actions';
import { selectAllPart } from 'src/app/store/part/part.selector';
import { CategoryVm } from 'src/app/entities/CategoryMv';
import { MessageService } from "primeng/api";
import {combineLatest} from "rxjs";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit {
  shoppinglists: ShoppingList[] = [];
  categorylist: CategoryVm[] = [];
  //partList!: string[];
  currentlyDragging: Part | null = null;
  selected: Part[] = [];
  iconVisible: boolean = false;

  constructor(private store: Store, private msg: MessageService) {
  }

  archiviereGekaufteArtikel(shoppinglist: ShoppingList) {
    this.store.dispatch(ShoppingListActions.archiveItem({shoppingId: shoppinglist.id}));
  }

  ngOnInit(): void {
    this.store.dispatch(ShoppingListActions.loadShoppingLists());
    this.store.dispatch(PartsActions.loadParts());
    this.store.dispatch(CategorysActions.loadCategorys());

    combineLatest([
      this.store.select(selectAllShoppingList),
      this.store.select(selectAllPart)
    ]).subscribe(([shoppingLists, parts]) => {
      this.shoppinglists = this.enrichShoppingListsWithParts(shoppingLists, parts);
      /* a revoir
      this.shoppinglists.forEach(shoppinglist => shoppinglist.shoppingListActions = [
        {label: 'Parameters', routerLink: ['/einkaufszettel', shoppinglist.id], icon: 'fas fa-gear'},
        {
          label: 'Archive purchased parts',
          callback: () => this.archiviereGekaufteArtikel(shoppinglist),
          icon: 'fas fa-box-archive'
        },
      ]);
      */
    });

    this.store.select(selectCategoryAndParts).subscribe( category => {
      this.categorylist = this.normalizeCategoryParts(category);
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

  modifyItem(shoppinglist: ShoppingList, item: ShoppinglistItem) {
    item.purchaseDate = new Date();
    item.purchased = true;
    this.store.dispatch(ShoppingListActions.updateItem({
      shoppingId: shoppinglist.id,
      data: item
    }));
  }

  changeArtikelGekauft(shoppinglist: ShoppingList, item: ShoppinglistItem) {
    item.purchased = !item.purchased;
    this.store.dispatch(ShoppingListActions.updateItem({
      shoppingId: shoppinglist.id,
      data: item
    }));
  }

  mouseEnter() {
  //console.log("mouse enter");
  this.iconVisible = true;
}

mouseLeave() {
  //console.log("mouse leave");
  this.iconVisible = false;
}

  dragStart(part: Part) {
        this.currentlyDragging = part;
        console.log("** dragStart > " + JSON.stringify(this.currentlyDragging)) ;

        // Show the toast message on the frontend
        this.msg.add({
            severity: "info",
            summary: "Drag Started",
            detail: "onDragStart Event"
        });
    }

    drag() {
        // Show the toast message on the frontend
        console.log("** drag") ;
        this.msg.add({
            severity: "success",
            summary: "Dragging...",
            detail: "onDrag Event"
        });
    }

    // On Drag End
    dragEnd() {
        console.log("** dragEnd") ;
        this.currentlyDragging = null;
        // Show the toast message on the frontend
        this.msg.add({
            severity: "error",
            summary: "Drag End",
            detail: "onDragEnd Event"
        });
    }

    // On Drop of Item to droppable area
    drop(shoppinglist: ShoppingList) {
        

        console.log("** drop " + JSON.stringify(shoppinglist)) ;
        if (this.currentlyDragging) {
            console.log("*** drop > " +JSON.stringify(this.currentlyDragging)) ;
            //let currentlyDraggingIndex = this.findIndex(this.currentlyDragging);
            this.selected = [...this.selected, this.currentlyDragging];
            console.log("*** drop > " +JSON.stringify(this.selected)) ;
            //this.available = this.available.filter(
            //    (val, i) => i != currentlyDraggingIndex
            //);
            const item: ShoppinglistItem = {
              id : 0,
              name : this.currentlyDragging.name,
              partRefId : this.currentlyDragging.id,
              purchased : false,
              quantity : 1
            };
            /*
            this.store.dispatch(ShoppingListActions.createItem({
              shoppingId: shoppinglist.id,
              data: item
            }));
            */
           const lstItems : ShoppinglistItem[] = [];
           shoppinglist.shoppingListItem?.forEach(val => lstItems.push(val));
            // add new
            lstItems.push(item);
            
           const updshoppinglist : ShoppingList = {
             id: shoppinglist.id,
             name: shoppinglist.name,
             shoppingListItem: lstItems
           };
           shoppinglist.shoppingListItem?.push(item);
           this.store.dispatch(ShoppingListActions.updateShoppingList({
              data: updshoppinglist }));

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
