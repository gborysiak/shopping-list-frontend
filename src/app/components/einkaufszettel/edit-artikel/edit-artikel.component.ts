import {Component, OnInit, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {selectItemById} from "../../../store/shoppinglist/shoppinglist.selectors";
import {ShoppingListActions} from "../../../store/shoppinglist/shoppinglist.actions";
import {ConfirmationService} from "primeng/api";
import {ShoppingListItem} from '@app/entities/ShoppingListItem';
import {selectAllPart} from '@app/store/part/part.selector';
import {TranslateService} from "@ngx-translate/core";
import {combineLatest} from "rxjs";
import { Bind } from 'primeng/bind';
import { InputNumber } from 'primeng/inputnumber';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-edit-artikel',
    templateUrl: './edit-artikel.component.html',
    styleUrls: ['./edit-artikel.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, Bind, InputNumber, NgStyle]
})
export class EditArtikelComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  itemForm: FormGroup = this.formBuilder.group({
    id: [{value: '', disabled: true}, Validators.required],
    partRefId: [{value: '', disabled: true}, Validators.required],
    name: [{value: ''}],
    quantity: ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(100)])],
    purchased: ['', Validators.required]
  });

  shoppingListId = 0;
  edit = false;
  header = '';

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private store: Store,
    private confirmationService: ConfirmationService, private router: Router, private translate: TranslateService ) {
  }

  ngOnInit(): void {
    this.shoppingListId = Number(this.activatedRoute.snapshot.paramMap.get('shoppingList'));
    const itemId = Number(this.activatedRoute.snapshot.paramMap.get('item'));
    if (itemId > 0) {
      this.initEdit(itemId);
    } else {
      this.router.navigate(['/home']);
    }
  }

  getTranslation(key: string): string {
    return this.translate.instant(key);
  }

  private initEdit(itemId: number) {
    this.edit = true;
    this.header = 'Artikel bearbeiten';

    const editableItem = {
      id: -1,
      partRefId: -1,
      name: '',
      quantity: 1,
      purchased: false
    };

    combineLatest([
      this.store.select(selectItemById(this.shoppingListId, itemId)),
      this.store.select(selectAllPart)
    ]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(([item, parts]) => {
      const part = parts.find(part => part.id === item.partRefId);

      if (part) {
        editableItem.name = part.name;
        editableItem.id = item.id;
        editableItem.partRefId = part.id;
        editableItem.quantity = item.quantity;
        this.itemForm.patchValue(editableItem);
      }
    });
  }

  save() {
    const formValue = this.itemForm.getRawValue();
    const item: ShoppingListItem = {...formValue};

    if (this.edit) {
      this.store.dispatch(ShoppingListActions.updateItem({
        shoppingId: this.shoppingListId,
        data: item
      }));
    } else {
      this.store.dispatch(ShoppingListActions.createItem({
        shoppingId: this.shoppingListId,
        data: item
      }));
    }
  }

  delete(event: Event) {
    const formValue = this.itemForm.getRawValue();
    const item: ShoppingListItem = {...formValue};

    const yes = this.getTranslation('global.yes');
    const no = this.getTranslation('global.no');
    const message = this.getTranslation('part.text1');
    const confirmation = this.getTranslation('global.confirmation');

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: message,
      header: confirmation,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: yes,
      rejectLabel: no,
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.store.dispatch(ShoppingListActions.deleteItem({
          shoppingId: this.shoppingListId,
          data: item
        }));
        this.store.dispatch(ShoppingListActions.loadShoppingLists());
      }
    });
  }
}
