import {Part} from "./Part";
import {User} from "./user";
import {Action} from "../util/action";

export interface ShoppingList {
  id: number;
  name: string;
  parts?: Part[]; //artikels
  //owners: User[];
  //sharedWith: User[];
  //shoppingListActions?: Action[]; //einkaufszettelActions
}
