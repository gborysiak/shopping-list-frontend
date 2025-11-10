import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import { Part } from 'src/app/entities/Part';
import {Store} from "@ngrx/store";
import {ConfirmationService} from "primeng/api";
import { PartsActions } from 'src/app/store/part/part.actions';
import { selectPartById } from 'src/app/store/part/part.selector';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrl: './part.component.scss',
  standalone: false
})
export class PartComponent implements OnInit {
  partForm: FormGroup = this.formBuilder.group({
    id: [{value: '', disabled: true}, Validators.required],
    name: [{value: ''}, Validators.compose([Validators.required, Validators.minLength(1)])]
  });
  
  edit: boolean = false;
  header: string = '';

/*
    id: number; // einkaufszettelId
    name: string;
    quantity: number; // anzahl
    dateCreated?: Date;
*/
  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private store: Store, private confirmationService: ConfirmationService) {
    this.store.dispatch(PartsActions.loadParts());

      const partId = Number(this.activatedRoute.snapshot.paramMap.get('partId'));
      if (partId > 0) {
        this.initEdit(partId);
      } else {
        this.initNew();
      }
  }

  ngOnInit(): void {
  }

  private initEdit(partId: number) {
    this.edit = true;
    this.header = 'Modification de l\'article';

    this.store.select(selectPartById(partId)).subscribe(part => this.partForm.patchValue(part));
  }

  private initNew() {
    const part: Part = {
      id: 0,
      name: '',
     // owners: [],
     // sharedWith: []
    };
    this.partForm.patchValue(part);
  } 

  save() {
      const formValue = this.partForm.getRawValue();
      const part: Part = {...formValue};
  
  
      if (this.edit) {
        this.store.dispatch(PartsActions.updatePart({data: part}));
      } else {
        this.store.dispatch(PartsActions.createPart({data: part}));
      }
    }
  
    delete(event: Event) {
      const formValue = this.partForm.getRawValue();
      const part: Part = {...formValue};
  
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
      const part: Part = {...formValue};
          this.store.dispatch(PartsActions.deletePart({data: part}));
          this.store.dispatch(PartsActions.loadParts());
        }
      });
    }
}
