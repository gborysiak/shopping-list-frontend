import {ShoppingList} from "./ShoppingList";
import {User} from "./user";

// ArtikelArchiv
export interface PartArchive {
  id: number;
  name: string;
  quantity: number; // anzahl
  purchased: boolean; // gekauft
  dateCreated?: Date; // dateCreated
  purchaseDate?: string; // kaufZeitpunkt
  shoppingList: ShoppingList; // einkaufszettel
  purchasedBy?: User; // kaeufer
}
