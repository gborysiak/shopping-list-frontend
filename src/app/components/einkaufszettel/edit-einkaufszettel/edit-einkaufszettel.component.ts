import {Component, OnInit} from '@angular/core';
import {ShoppingList} from "../../../entities/ShoppingList";
import {Store} from "@ngrx/store";
import {ShoppingListActions} from "../../../store/shoppinglist/shoppinglist.actions";
import {selectShoppingListById} from "../../../store/shoppinglist/shoppinglist.selectors";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {ConfirmationService} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {ShoppingListItem} from '@app/entities/ShoppingListItem';
import {LoggerService} from "../../../service/logger.service";

@Component({
    selector: 'app-einkaufszettel',
    templateUrl: './edit-einkaufszettel.component.html',
    styleUrls: ['./edit-einkaufszettel.component.scss'],
    standalone: false
})
export class EditEinkaufszettelComponent implements OnInit {
  shoppingListForm: FormGroup = this.formBuilder.group({
    id: [{value: '', disabled: true}, Validators.required],
    name: [{value: ''}, Validators.compose([Validators.required, Validators.minLength(1)])],
    shoppingListItem: new FormControl<ShoppingListItem[] | null>([])
  });

  edit: boolean = false;
  header: string = '';

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private store: Store,
    private confirmationService: ConfirmationService, private translate: TranslateService, private logger: LoggerService ) {
  }

  ngOnInit(): void {
    this.store.dispatch(ShoppingListActions.loadShoppingLists());

    const shoppingListId = Number(this.activatedRoute.snapshot.paramMap.get('einkaufszettelId'));
    if (shoppingListId > 0) {
      this.initEdit(shoppingListId);
    } else {
      this.initNew();
    }
  }

  getTranslation(key: string): string {
    return this.translate.instant(key);
  }

  private initEdit(shoppingListId: number) {
    this.edit = true;
    this.header = 'Einkaufszettel bearbeiten';

    this.store.select(selectShoppingListById(shoppingListId)).subscribe(shoppingList => this.shoppingListForm.patchValue(shoppingList));
  }

  private initNew() {
    const shoppingList: ShoppingList = {
      id: 0,
      name: ''
    };
    this.shoppingListForm.patchValue(shoppingList);
  }

  save() {
    const formValue = this.shoppingListForm.getRawValue();
    const shoppingList: ShoppingList = {...formValue};
    this.logger.debug("* save " + JSON.stringify(shoppingList));

    if (this.edit) {
      this.store.dispatch(ShoppingListActions.updateShoppingList({data: shoppingList}));
    } else {
      shoppingList.shoppingListItem = [];
      this.store.dispatch(ShoppingListActions.createShoppingList({data: shoppingList}));
    }
  }

  delete(event: Event) {
    const formValue = this.shoppingListForm.getRawValue();
    const shoppingList: ShoppingList = {...formValue};

    const yes = this.getTranslation('global.yes');
    const no = this.getTranslation('global.no');
    const message = this.getTranslation('shoppinglist.message');
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
        this.store.dispatch(ShoppingListActions.deleteShoppingList({data: shoppingList}));
        this.store.dispatch(ShoppingListActions.loadShoppingLists());
      }
    });
  }
}
