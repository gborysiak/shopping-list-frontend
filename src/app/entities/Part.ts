import {User} from "./user";

export interface Part {
  id: number; // einkaufszettelId
  name: string;
  quantity: number; // anzahl
  purchased: boolean; // gekauft
  dateCreated?: Date;
  purchaseDate?: Date; // kaufZeitpunkt
  purchasedBy?: User; // kaeufer
}
