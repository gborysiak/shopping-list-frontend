import {Part} from "./Part";

// Kategorie
export interface Category { 
  id: number;
  name: string;
  parts?: Part[]; // artikels
}
