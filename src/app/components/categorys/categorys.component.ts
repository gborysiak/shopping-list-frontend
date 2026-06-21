import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { MessageService } from "primeng/api";
import { CategoryVm } from '@app/entities/CategoryMv';
import { LoggerService } from '@app/service/logger.service';
import { CategorysActions } from '@app/store/category/category.actions';
import { PartsActions } from '@app/store/part/part.actions';
import { selectCategoryAndParts } from '@app/store/category/category.selectors';


@Component({
  selector: 'app-categorys',
  templateUrl: './categorys.component.html',
  styleUrl: './categorys.component.scss',
  standalone: false
})
export class CategorysComponent { 

  categoryList: CategoryVm[] = [];

  constructor(private store: Store, private msg: MessageService, private logger: LoggerService) {
  }

  ngOnInit(): void {
    this.store.dispatch(PartsActions.loadParts());
    this.store.dispatch(CategorysActions.loadCategorys());

    this.store.select(selectCategoryAndParts).subscribe(category => {
      this.categoryList = this.normalizeCategoryParts(category);
    });
  }

   private normalizeCategoryParts(categories: CategoryVm[]): CategoryVm[] {
    const categoryList: CategoryVm[] = JSON.parse(JSON.stringify(categories));

    categoryList.forEach(category => {
      if (category.parts && !Array.isArray(category.parts)) {
        category.parts = [category.parts];
      }
    });

    return categoryList;
  }
 
}
