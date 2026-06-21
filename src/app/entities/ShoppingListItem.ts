import { Part } from "./Part";

export interface ShoppingListItem {
  id: number;
  partRefId: number;
  name: string;
  quantity: number;
  purchased: boolean;
  purchaseDate?: Date;
  part?: Part;
}
