import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import { Part } from 'src/app/entities/Part';
import {Store} from "@ngrx/store";
import {ConfirmationService} from "primeng/api";
import { PartsActions } from 'src/app/store/part/part.actions';
import { selectPartById } from 'src/app/store/part/part.selector';
import { Category } from 'src/app/entities/Category';
import { CategorysActions } from 'src/app/store/category/category.actions';
import { selectAllCategory } from 'src/app/store/category/category.selectors';
import { NgModule } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { Observable,combineLatest, forkJoin, map, mergeMap, of, pipe, tap, zip } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrl: './part.component.scss',
  standalone: false
})
export class PartComponent implements OnInit {
  partForm: FormGroup = this.formBuilder.group({
    id: [{value: '', disabled: true}, Validators.required],
    name: [{value: ''}, Validators.compose([Validators.required, Validators.minLength(1)])],
    category: [{value: ''}, Validators.compose([Validators.required, Validators.minLength(1)])]
  });
  
  selectedCategory: string = ''; 
  categorylist!: Category[];
  edit: boolean = false;
  header: string = '';

/*
    id: number; // einkaufszettelId
    name: string;
    quantity: number; // anzahl
    dateCreated?: Date;
*/
  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private store: Store, 
    private confirmationService: ConfirmationService, private translate: TranslateService, private router: Router) {
    this.store.dispatch(PartsActions.loadParts());

    this.store.dispatch(CategorysActions.loadCategorys());
    
    this.store.select(selectAllCategory).subscribe( category => {
      console.log('nb c ' + category.length);
      this.categorylist = JSON.parse(JSON.stringify(category)); // deep copy of store, so that changes are possible
      console.log('nb 2 c ' + this.categorylist.length);
    });
    

    const partId = Number(this.activatedRoute.snapshot.paramMap.get('partId'));
    if (partId > 0) {
      this.initEdit(partId);
    } else {
      this.initNew();
    }


  }

  ngOnInit(): void {
  }

  getTranslation(key: string): string {
    return this.translate.instant(key); 
  }
  private initEdit(partId: number) {
    this.edit = true;
    this.header = 'Modification de l\'article';
    var categoryName  ='';

    
    //const newObj = { name: "abc", category: 1};
    //console.log(newObj);
    //this.partForm.patchValue(newObj);
    //this.partForm.controls["category"].patchValue(1);
    

    this.store.select(selectPartById(partId)).subscribe(part => 
      { 
        const newObj = { id: part.id, name: part.name, category: part.categoryId};
        console.log(newObj);
        this.partForm.patchValue(newObj);
        /*
        this.store.select(selectAllCategory).subscribe(categories => {
        console.log('nb c ' + categories.length);
        this.categorylist = JSON.parse(JSON.stringify(categories)); // deep copy of store, so that changes are possible
        console.log('nb 2 c ' + this.categorylist.length);
          
          if( part != undefined) {
            //this.partForm.patchValue(part);
            console.log('category ' + part.categoryId);
            for(var i=0; i < this.categorylist.length; i ++) {
              console.log(i + " > " + this.categorylist[i].id);
              if( this.categorylist[i].id === part.categoryId) {
                console.log(this.categorylist[i].id + "/" + this.categorylist[i].name);
                //this.partForm.patchValue({"category": this.categorylist[i].name});
                categoryName = this.categorylist[i].name;
              }
            }
            const newObj = { name: part.name, category: part.categoryId};
            console.log(newObj);
            this.partForm.patchValue(newObj);
          }
        });
        */
      });
      
  }

  private initNew() {
    const part: Part = {
      id: 0,
      name: '',
      categoryId: 0
     // owners: [],
     // sharedWith: []
    };
    this.partForm.patchValue(part);
  } 

  save() {
      const formValue = this.partForm.getRawValue();
      const part: Part = {...formValue};

  
      if (this.edit) {
        part.categoryId = formValue.category;
        this.store.dispatch(PartsActions.updatePart({data: part}));
      } else {
        part.categoryId = formValue.category;
        this.store.dispatch(PartsActions.createPart({data: part}));
      }
    }
  
    delete(event: Event) {
      const formValue = this.partForm.getRawValue();
      const part: Part = {...formValue};

      var text1 = this.getTranslation('part.text1');
      var yes = this.getTranslation('global.yes');
      var no = this.getTranslation('global.no');
      var confirmation = this.getTranslation('global.confirmation');
  
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: text1,
        header: confirmation,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: yes,
        rejectLabel: no,
        acceptIcon: "none",
        rejectIcon: "none",
        rejectButtonStyleClass: "p-button-text",
        accept: () => {
      const part: Part = {...formValue};
          this.store.dispatch(PartsActions.deletePart({data: part}));
          this.store.dispatch(PartsActions.loadParts());
          this.router.navigate(['/home']);
        }
      });
    }
}
