import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ShoppingListActions} from "../../../store/shoppinglist/shoppinglist.actions";
import {selectAllShoppingList} from "../../../store/shoppinglist/shoppinglist.selectors";
import {Part} from "../../../entities/Part";
import {ShoppingList} from "../../../entities/ShoppingList";
import { ShoppinglistItem } from 'src/app/entities/ShoppingListItem';
import { Category } from 'src/app/entities/Category';
import { CategorysActions } from 'src/app/store/category/category.actions';
import { selectAllCategory , selectCategoryAndParts} from 'src/app/store/category/category.selectors';
import { PartsActions } from 'src/app/store/part/part.actions';
import { selectAllPart } from 'src/app/store/part/part.selector';
import { CategoryVm } from 'src/app/entities/CategoryMv';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit {
  shoppinglists!: ShoppingList[];
  categorylist!: CategoryVm[];


  constructor(private store: Store) {
  }

  archiviereGekaufteArtikel(shoppinglist: ShoppingList) {
    this.store.dispatch(ShoppingListActions.archivePart({shoppingId: shoppinglist.id}));
  }

  ngOnInit(): void {
    this.store.dispatch(ShoppingListActions.loadShoppingLists());
    
    this.store.select(selectAllShoppingList).subscribe(shoppinglist => {
      console.log('nb sl ' + shoppinglist.length);
      this.shoppinglists = JSON.parse(JSON.stringify(shoppinglist)); // deep copy of store, so that changes are possible
      console.log('nb 2 sl  ' + this.shoppinglists.length);
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

  
    this.store.dispatch(PartsActions.loadParts());
    this.store.dispatch(CategorysActions.loadCategorys());
    /*
    this.store.select(selectAllPart).subscribe( part => {
      console.log('nb p ' + part.length);
      this.partList = JSON.parse(JSON.stringify(part)); // deep copy of store, so that changes are possible
      console.log('nb 2 p ' + this.partList.length);
    });

    this.store.select(selectAllCategory).subscribe( category => {
      console.log('nb c ' + category.length);
      this.categorylist = JSON.parse(JSON.stringify(category)); // deep copy of store, so that changes are possible
      console.log('nb 2 c ' + this.categorylist.length);

    });
    */
    this.store.select(selectCategoryAndParts).subscribe( category => {
      console.log('nb c ' + category.length);
      console.log(JSON.stringify(category));
      this.categorylist = JSON.parse(JSON.stringify(category)); // deep copy of store, so that changes are possible
      console.log('nb 2 c ' + this.categorylist.length );
      for(var i=0; i < this.categorylist.length;i++) {
        if( this.categorylist[i].parts != undefined) {
          var parts = this.categorylist[i].parts;
          console.log(JSON.stringify(parts));
          if( Array.isArray(parts)) {
            this.categorylist[i].parts = parts;
          } else {
            var temp = Array(1);
            temp[0] = parts;
            this.categorylist[i].parts = temp;
          }
          console.log(this.categorylist[i].name + ' > nb p ' + this.categorylist[i].parts.length); 
        }
      }
    });
   

    /*
    for(var i=0; i < this.categorylist.length; i++) {
        console.log("$ category " + this.categorylist[i].id);
        this.store.select(selectPartByCategory(this.categorylist[i].id)).subscribe( part => {
          console.log(i + ' > nb p ' + part.length);
        });
    }
    */

  }

  changeArtikel(shoppinglist: ShoppingList, item: ShoppinglistItem) {
    this.store.dispatch(ShoppingListActions.updatePart({
      shoppingId: shoppinglist.id,
      data: item
    }));
  }

  changeArtikelGekauft(shoppinglist: ShoppingList, item: ShoppinglistItem) {
    item.purchased = !item.purchased;
    this.store.dispatch(ShoppingListActions.updatePart({
      shoppingId: shoppinglist.id,
      data: item
    }));
  }
}
