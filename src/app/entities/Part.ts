import {User} from "./user";

export interface Part {
  id: number; // einkaufszettelId
  name: string;
  categoryId: number;
  dateCreated?: Date;
}
