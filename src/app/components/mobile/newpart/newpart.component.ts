import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ShoppingListActions} from "../../../store/shoppinglist/shoppinglist.actions";
import {selectAllShoppingList, selectShoppingListById} from "../../../store/shoppinglist/shoppinglist.selectors";
import {Part} from "../../../entities/Part";
import {ShoppingList} from "../../../entities/ShoppingList";
import { ShoppinglistItem } from 'src/app/entities/ShoppingListItem';
import { Category } from 'src/app/entities/Category';
import { CategorysActions } from 'src/app/store/category/category.actions';
import { selectAllCategory , selectCategoryAndParts} from 'src/app/store/category/category.selectors';
import { PartsActions } from 'src/app/store/part/part.actions';
import { selectAllPart } from 'src/app/store/part/part.selector';
import { CategoryVm } from 'src/app/entities/CategoryMv';
import { MessageService } from "primeng/api";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatestWith, forkJoin, takeUntil } from 'rxjs';


@Component({
  selector: 'app-newpart',
  templateUrl: './newpart.component.html',
  styleUrl: './newpart.component.scss',
  standalone: false
})
export class NewpartComponent {
  shoppingId: number = 0;
  shoppingList: ShoppingList | null = null;
  categorylist!: CategoryVm[];
  //partList!: string[];
  selected: Part[] = [];
  iconVisible: boolean = false;
  

  constructor(private store: Store, private msg: MessageService, private activatedRoute: ActivatedRoute,  
    private router: Router ) {
  }

  ngOnInit(): void {
    this.shoppingId = Number(this.activatedRoute.snapshot.paramMap.get('shoppingId'));
    console.log('> shoppingId ' + this.shoppingId);

    this.store.dispatch(PartsActions.loadParts());
    this.store.dispatch(CategorysActions.loadCategorys());
    this.store.dispatch(ShoppingListActions.loadShoppingLists());

    const CategoryAndParts$ = this.store.select(selectCategoryAndParts);
    const shoppingList$ = this.store.select(selectShoppingListById(this.shoppingId));
    
    CategoryAndParts$.pipe(
        combineLatestWith(shoppingList$)
      )
      .subscribe(([category, shoppingList]) => {
        if( category) {
          console.log('c ' + JSON.stringify(category));
        }
        if( shoppingList) {
          console.log('s ' + JSON.stringify(shoppingList));
        }
        if( category && shoppingList) {
          this.shoppingList = shoppingList;
          this.categorylist = JSON.parse(JSON.stringify(category));
          for(var i=0; i < this.categorylist.length;i++) {
            if( this.categorylist[i].parts != undefined) {
              var parts = this.categorylist[i].parts;
              console.log(JSON.stringify(parts));
              
              if( Array.isArray(parts)) {
                // remove part already in shopping list
                var cleanedParts: Part[] = [];
                parts.forEach(part => {
                  var found=false;
                  shoppingList.shoppingListItem!.forEach(item => {
                    if( part.id == item.partRefId) {
                      found=true;
                      console.log(part.name + ' deja dans la shoppinglist');
                    }
                  });
                  if( ! found ) {
                    cleanedParts.push(part);
                  }
                });
                
                //this.categorylist[i].parts = parts;
                this.categorylist[i].parts = cleanedParts;
              } else {
                var temp = Array(1);
                temp[0] = parts;
                this.categorylist[i].parts = temp;
              }
              console.log(this.categorylist[i].name + ' > nb p ' + this.categorylist[i].parts.length); 
            }          
          }
        }
       });
  }
 
  addItem(part: Part) {
    console.log('addItem ' + JSON.stringify(part));
    this.selected.push(part);
    /*
    item.purchaseDate = new Date();
    item.purchased = true;
    this.store.dispatch(ShoppingListActions.updateItem({
      shoppingId: shoppinglist.id,
      data: item
    }));
    */
  }  

  addToShoppingList() {
    console.log('addToShoppingList ' + JSON.stringify(this.selected));
    const lstItems : ShoppinglistItem[] = [];

    this.shoppingList!.shoppingListItem?.forEach(val => lstItems.push(val));
  
    this.selected.forEach(part => {
      const item: ShoppinglistItem = {
                id : 0,
                name : part.name,
                partRefId : part.id,
                purchased : false,
                quantity : 1
      };
      // add new
      lstItems.push(item);
    });
    const updshoppinglist : ShoppingList = {
      id: this.shoppingList!.id,
      name: this.shoppingList!.name,
      shoppingListItem: lstItems
    };
    this.store.dispatch(ShoppingListActions.updateShoppingList({
      data: updshoppinglist }));
  }
}
function concatLatestFrom(arg0: () => Observable<unknown>[]) {
  throw new Error('Function not implemented.');
}

