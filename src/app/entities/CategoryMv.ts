import { Part } from "./Part";

export interface CategoryVm { 
  id: number;
  name: string;
  parts: Part[];
}
