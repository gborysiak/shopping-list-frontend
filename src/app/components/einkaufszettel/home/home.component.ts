import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {ShoppingListActions} from "../../../store/shoppinglist/shoppinglist.actions";
import {selectAllShoppingList} from "../../../store/shoppinglist/shoppinglist.selectors";
import {Part} from "../../../entities/Part";
import {ShoppingList} from "../../../entities/ShoppingList";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit {
  shoppinglists!: ShoppingList[];

  constructor(private store: Store) {
  }

  archiviereGekaufteArtikel(shoppinglist: ShoppingList) {
    this.store.dispatch(ShoppingListActions.archivePart({shoppingId: shoppinglist.id}));
  }

  ngOnInit(): void {
    this.store.dispatch(ShoppingListActions.loadShoppingLists());

    this.store.select(selectAllShoppingList).subscribe(einkaufszettel => {
      this.shoppinglists = JSON.parse(JSON.stringify(einkaufszettel)); // deep copy of store, so that changes are possible
      this.shoppinglists.forEach(shoppinglist => shoppinglist.shoppingListActions = [
        {label: 'Parameters', routerLink: ['/einkaufszettel', shoppinglist.id], icon: 'fas fa-gear'},
        {
          label: 'Archive purchased parts',
          callback: () => this.archiviereGekaufteArtikel(shoppinglist),
          icon: 'fas fa-box-archive'
        },
      ]);
    });
  }

  changeArtikel(shoppinglist: ShoppingList, part: Part) {
    this.store.dispatch(ShoppingListActions.updatePart({
      shoppingId: shoppinglist.id,
      data: part
    }));
  }

  changeArtikelGekauft(shoppinglist: ShoppingList, part: Part) {
    part.purchased = !part.purchased;
    this.store.dispatch(ShoppingListActions.updatePart({
      shoppingId: shoppinglist.id,
      data: part
    }));
  }
}
