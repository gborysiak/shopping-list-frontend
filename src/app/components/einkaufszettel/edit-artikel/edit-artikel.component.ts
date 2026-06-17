import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {selectItemById} from "../../../store/shoppinglist/shoppinglist.selectors";
import {Part} from "../../../entities/Part";
import {ShoppingListActions} from "../../../store/shoppinglist/shoppinglist.actions";
import {ConfirmationService} from "primeng/api";
import { ShoppinglistItem } from 'src/app/entities/ShoppingListItem';
import { selectAllPart } from 'src/app/store/part/part.selector';
import {TranslateService} from "@ngx-translate/core";
import {combineLatest} from "rxjs";

@Component({
    selector: 'app-edit-artikel',
    templateUrl: './edit-artikel.component.html',
    styleUrls: ['./edit-artikel.component.scss'],
    standalone: false
})
export class EditArtikelComponent implements OnInit {
  artikelForm: FormGroup = this.formBuilder.group({
    id: [{value: '', disabled: true}, Validators.required],
    partRefId: [{value: '', disabled: true}, Validators.required],
    name: [{value: ''}],
    // kategorie: ['', Validators.compose([Validators.required, Validators.minLength(1)])], TODO
    quantity: ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(100)])],
    purchased: ['', Validators.required]
  });

  shoppingId: number = 0; // einkaufszettelId
  edit: boolean = false;
  header: string = '';

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private store: Store, private confirmationService: ConfirmationService,
    private router: Router, private translate: TranslateService ) {
  }

  ngOnInit(): void {
    this.shoppingId = Number(this.activatedRoute.snapshot.paramMap.get('shoppingList'));
    const partId = Number(this.activatedRoute.snapshot.paramMap.get('item')); // artikelId
    if (partId > 0) {
      this.initEdit(partId);
    } else {
      //this.initNew();
      this.router.navigate(['/home']);
    }
  }

  getTranslation(key: string): string {
    return this.translate.instant(key); 
  }


  private initEdit(partId: number) {
    this.edit = true;
    this.header = 'Artikel bearbeiten';

    const editPart = {
      id: -1,
      partRefId: -1,
      name: '',
      quantity: 1,
      purchased: false
    };

    combineLatest([
      this.store.select(selectItemById(this.shoppingId, partId)),
      this.store.select(selectAllPart)
    ]).subscribe(([item, parts]) => {
      const part = parts.find(part => part.id === item.partRefId);

      if (part) {
        editPart.name = part.name;
        editPart.id = item.id;
        editPart.partRefId = part.id;
        editPart.quantity = item.quantity;
        this.artikelForm.patchValue(editPart);
      }
    });
  }

  /*
  private initNew() {
    const emptyPart: ShoppinglistItem = {
      id: -1,
      partRefId: -1,
      name: '',
      quantity: 1,
      purchased: false
    };
    this.artikelForm.patchValue(emptyPart);
  }
    */

  save() {
    const formValue = this.artikelForm.getRawValue();
    const item: ShoppinglistItem = {...formValue};

    if (this.edit) {
      this.store.dispatch(ShoppingListActions.updateItem({
        shoppingId: this.shoppingId,
        data: item
      }));
    } else {
      this.store.dispatch(ShoppingListActions.createItem({
        shoppingId: this.shoppingId,
        data: item
      }));
    }
  }

  delete(event: Event) {
    const formValue = this.artikelForm.getRawValue();
    const item: ShoppinglistItem = {...formValue}; // artikel

    var yes = this.getTranslation('global.yes');
    var no = this.getTranslation('global.no');
    var message = this.getTranslation('part.text1');
    var confirmation = this.getTranslation('global.confirmation');

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
          shoppingId: this.shoppingId,
          data: item
        }));
        this.store.dispatch(ShoppingListActions.loadShoppingLists());
      }
    });
  }
}
