import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import {selectItemById} from "../../../store/shoppinglist/shoppinglist.selectors";
import {Part} from "../../../entities/Part";
import {ShoppingListActions} from "../../../store/shoppinglist/shoppinglist.actions";
import {ConfirmationService} from "primeng/api";
import { ShoppinglistItem } from 'src/app/entities/ShoppingListItem';

@Component({
    selector: 'app-edit-artikel',
    templateUrl: './edit-artikel.component.html',
    styleUrls: ['./edit-artikel.component.scss'],
    standalone: false
})
export class EditArtikelComponent implements OnInit {
  artikelForm: FormGroup = this.formBuilder.group({
    id: [{value: '', disabled: true}, Validators.required],
    name: [{value: ''}, Validators.compose([Validators.required, Validators.minLength(1)])],
    // kategorie: ['', Validators.compose([Validators.required, Validators.minLength(1)])], TODO
    quantity: ['', Validators.compose([Validators.required, Validators.min(1), Validators.max(100)])],
    purchased: ['', Validators.required]
  });

  shoppingId: number = 0; // einkaufszettelId
  edit: boolean = false;
  header: string = '';

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private store: Store, private confirmationService: ConfirmationService,) {
  }

  ngOnInit(): void {
    this.shoppingId = Number(this.activatedRoute.snapshot.paramMap.get('shoppingId'));
    const partId = Number(this.activatedRoute.snapshot.paramMap.get('partId')); // artikelId
    if (partId > 0) {
      this.initEdit(partId);
    } else {
      this.initNew();
    }
  }

  private initEdit(partId: number) {
    this.edit = true;
    this.header = 'Artikel bearbeiten';

    this.store.select(selectItemById(this.shoppingId, partId)).subscribe(part => this.artikelForm.patchValue(part));
  }

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

  save() {
    const formValue = this.artikelForm.getRawValue();
    const item: ShoppinglistItem = {...formValue};

    if (this.edit) {
      this.store.dispatch(ShoppingListActions.updatePart({
        shoppingId: this.shoppingId,
        data: item
      }));
    } else {
      this.store.dispatch(ShoppingListActions.createPart({
        shoppingId: this.shoppingId,
        data: item
      }));
    }
  }

  delete(event: Event) {
    const formValue = this.artikelForm.getRawValue();
    const item: ShoppinglistItem = {...formValue}; // artikel

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Sind Sie sich sicher, dass Sie den Artikel löschen möchten?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ja',
      rejectLabel: 'Nein',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.store.dispatch(ShoppingListActions.deletePart({
          shoppingId: this.shoppingId,
          data: item
        }));
        this.store.dispatch(ShoppingListActions.loadShoppingLists());
      }
    });
  }
}
