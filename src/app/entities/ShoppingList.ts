import {Part} from "./Part";
import { ShoppinglistItem } from "./ShoppingListItem";
import {User} from "./user";
import {Action} from "../util/action";

export interface ShoppingList {
  id: number;
  name: string;
  shoppingListItem?: ShoppinglistItem[]; //artikels
  //owners: User[];
  //sharedWith: User[];
  //shoppingListActions?: Action[]; //einkaufszettelActions
}
