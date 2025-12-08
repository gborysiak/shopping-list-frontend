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
import { MessageService } from "primeng/api";
import { RouterLink} from '@angular/router';
import { combineLatestWith } from 'rxjs';

@Component({
  selector: 'app-mobilehome',
  templateUrl: './mobilehome.component.html',
  styleUrl: './mobilehome.component.scss',
  standalone: false
})
export class MobilehomeComponent {
  shoppinglists!: ShoppingList[];

  constructor(private store: Store, private msg: MessageService) {
  }


    ngOnInit(): void {
      this.store.dispatch(ShoppingListActions.loadShoppingLists());
      this.store.dispatch(PartsActions.loadParts());
      this.store.dispatch(CategorysActions.loadCategorys());
      /*
      this.store.select(selectAllShoppingList).subscribe(shoppinglist => {
        this.store.select(selectAllPart).subscribe(parts => {
          console.log('nb sl ' + shoppinglist.length+ '/ p ' + parts.length);
          this.shoppinglists = JSON.parse(JSON.stringify(shoppinglist)); // deep copy of store, so that changes are possible
          this.shoppinglists.forEach(sl => {
            console.log('sl ' + sl.id );
            sl.shoppingListItem?.forEach( item => {
              console.log('item ' + item.id + ' part ' + item.partRefId );
              var part = parts.find(part => part.id == item.partRefId);
              if( part != null) {
                console.log('part found ' + part?.name);
                item.part = part;
              }
            });
          });
          console.log('nb 2 sl  ' + this.shoppinglists.length);
        })
      });
      */

      const shoppingLists$ = this.store.select(selectAllShoppingList);
      const parts$ = this.store.select(selectAllPart);
      shoppingLists$.pipe(
        combineLatestWith(parts$))
          .subscribe(([shoppingLists, parts]) => {
            if( shoppingLists && parts) {
              console.log('s ' + JSON.stringify(shoppingLists));
              console.log('p ' + JSON.stringify(parts));

            this.shoppinglists = JSON.parse(JSON.stringify(shoppingLists)); // deep copy of store, so that changes are possible
            this.shoppinglists.forEach(sl => {
              console.log('sl ' + sl.id );
              sl.shoppingListItem?.forEach( item => {
                console.log('item ' + item.id + ' part ' + item.partRefId );
                var part = parts.find(part => part.id == item.partRefId);
                if( part != null) {
                  console.log('part found ' + part?.name);
                  item.part = part;
                }
              });
            });
            console.log('nb 2 sl  ' + this.shoppinglists.length);
          }
          });
    }

  modifyItem(shoppinglist: ShoppingList, item: ShoppinglistItem) {
    item.purchaseDate = new Date();
    item.purchased = true;
    this.store.dispatch(ShoppingListActions.updateItem({
      shoppingId: shoppinglist.id,
      data: item
    }));
  }

}
