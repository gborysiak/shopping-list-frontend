
import {Component, OnInit} from '@angular/core';
import {Category} from "../../../entities/Category";
import {Store} from "@ngrx/store";
import {CategorysActions} from "../../../store/category/category.actions";
import {selectAllCategory, selectCategoryById} from "src/app/store/category/category.selectors";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {ConfirmationService} from "primeng/api";


@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    standalone: false
})
export class CategoryComponent implements OnInit {
  categoryForm: FormGroup = this.formBuilder.group({
    id: [{value: '', disabled: true}, Validators.required],
	  name: [{value: '', disabled: true}, Validators.required],
  });

  edit: boolean = false;
  header: string = '';

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private store: Store, private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    this.store.dispatch(CategorysActions.loadCategorys());
    

    const categoryId = Number(this.activatedRoute.snapshot.paramMap.get('categoryId'));
    if (categoryId > 0) {
      this.initEdit(categoryId);
    } else {
      this.initNew();
    }
  }

  private initEdit(categoryId: number) {
    this.edit = true;
    this.header = 'Category';

    this.store.select(selectCategoryById(categoryId)).subscribe(category => this.categoryForm.patchValue(category));
  }

  private initNew() {
    const category: Category = {
   	id: 0,
		name: '',
	  };
    this.categoryForm.patchValue(category);
  }

  save() {
    const formValue = this.categoryForm.getRawValue();
    const category: Category = {...formValue};


    if (this.edit) {
      this.store.dispatch(CategorysActions.updateCategory({data: category}));
    } else {
      this.store.dispatch(CategorysActions.createCategory({data: category}));
    }
  }

  delete(event: Event) {
    const formValue = this.categoryForm.getRawValue();
    const category: Category = {...formValue};

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Sind Sie sich sicher, dass Sie den Einkaufszettel löschen möchten?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ja',
      rejectLabel: 'Nein',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.store.dispatch(CategorysActions.deleteCategory({data: category}));
        this.store.dispatch(CategorysActions.loadCategorys());
      }
    });
  }
}
