import { ShoppingListItem } from "./ShoppingListItem";

export interface ShoppingList {
  id: number;
  name: string;
  shoppingListItem?: ShoppingListItem[];
}
