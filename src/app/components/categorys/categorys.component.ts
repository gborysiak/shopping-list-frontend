import {Component, OnInit, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { Store } from "@ngrx/store";
import { MessageService } from "primeng/api";
import { CategoryVm } from '@app/entities/CategoryMv';
import { LoggerService } from '@app/service/logger.service';
import { CategorysActions } from '@app/store/category/category.actions';
import { PartsActions } from '@app/store/part/part.actions';
import { selectCategoryAndParts } from '@app/store/category/category.selectors';
import { Bind } from 'primeng/bind';
import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primeng/accordion';
import { Ripple } from 'primeng/ripple';
import { RouterLink } from '@angular/router';


@Component({
    selector: 'app-categorys',
    templateUrl: './categorys.component.html',
    styleUrl: './categorys.component.scss',
    imports: [Bind, Accordion, AccordionPanel, Ripple, AccordionHeader, RouterLink, AccordionContent]
})
export class CategorysComponent {
  private readonly destroyRef = inject(DestroyRef);
 

  categoryList: CategoryVm[] = [];

  constructor(private store: Store, private msg: MessageService, private logger: LoggerService) {
  }

  ngOnInit(): void {
    this.store.dispatch(PartsActions.loadParts());
    this.store.dispatch(CategorysActions.loadCategorys());

    this.store.select(selectCategoryAndParts).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(categories => this.categoryList = categories);
  }

}
