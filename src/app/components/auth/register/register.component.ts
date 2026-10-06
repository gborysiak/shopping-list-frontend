import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {User} from "../../../entities/user";
import {FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Store} from "@ngrx/store";
import {Router, RouterLink} from "@angular/router";
import {AuthActions} from "../../../store/auth/auth.actions";
import {Bind} from 'primeng/bind';
import {Password} from 'primeng/password';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, Bind, Password, RouterLink, TranslatePipe]
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
