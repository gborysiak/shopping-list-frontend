import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {User} from "../../../entities/user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";
import {AuthActions} from "../../../store/auth/auth.actions";
//import { ErrorService } from 'src/app/service/error.service';
import { MessageModule } from 'primeng/message';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: false
})
export class RegisterComponent implements OnInit {
  user?: User;
  loginForm: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  errorMessage: string | null = null;

  constructor(private formBuilder: FormBuilder, private store: Store, private router: Router, private messageService: MessageService ) {

  }

  ngOnInit(): void {
    const user: User = {
      username: '',
      password: '',
      name: ''
    }
    this.loginForm.patchValue(user);
  }

  register() {
    const formValue = this.loginForm.getRawValue();
    const user: User = {...formValue};

    this.store.dispatch(AuthActions.register({data: user}));
  }

  reset() {
    this.ngOnInit();
  }
}
