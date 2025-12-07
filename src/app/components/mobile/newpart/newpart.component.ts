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
  categorylist!: CategoryVm[];
  //partList!: string[];
  currentlyDragging: Part | null = null;
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

    /*
    this.store.select(selectCategoryAndParts).subscribe( category => {
      this.store.select(selectShoppingListById(this.shoppingId)).subscribe(shoppingList => {
        console.log('nb c ' + category.length);
        console.log(JSON.stringify(category));
        this.categorylist = JSON.parse(JSON.stringify(category)); // deep copy of store, so that changes are possible
        console.log('nb 2 c ' + this.categorylist.length );
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
      });
    });
    */
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
  }
}
function concatLatestFrom(arg0: () => Observable<unknown>[]) {
  throw new Error('Function not implemented.');
}

