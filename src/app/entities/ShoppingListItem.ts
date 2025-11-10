import {User} from "./user";
import { Part } from "./Part";

export interface ShoppinglistItem {
  id: number; // einkaufszettelId
  partRefId: number;
  name: string;
  quantity: number; // anzahl
  purchased: boolean; // gekauft
  purchaseDate?: Date; // kaufZeitpunkt
}
