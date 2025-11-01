import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProfileService} from "../../../service/profile.service";
import {MessageService} from "primeng/api";
import {DialogService} from "primeng/dynamicdialog";
import {User} from "../../../entities/user";
import {Store} from "@ngrx/store";
import {selectLogin} from "../../../store/auth/auth.selectors";
import {AuthActions} from "../../../store/auth/auth.actions";

@Component({
    providers: [DialogService],
    selector: 'app-profile-edit',
    templateUrl: './profile-edit.component.html',
    styleUrls: ['./profile-edit.component.scss'],
    standalone: false
})
export class ProfileEditComponent {
  profileForm: FormGroup;
  userLoggedIn!: User | undefined;

  constructor(private store: Store, private fb: FormBuilder, private profileService: ProfileService, private messageService: MessageService) {
    this.profileForm = this.fb.group({
      id: [{value: '', disabled: true}, Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      avatar: ['', Validators.required]
    });

    this.store.select(selectLogin).subscribe(user => {
      this.userLoggedIn = user != null ? {...user} : undefined;
      if (user) {
        this.profileForm.patchValue(user);
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.getRawValue();
      const result: User = {...formValue, avatarBase64: '', avatar: ''};
      this.updateProfileData(result);

    }
  }

  private updateProfileData(result: User) {
    this.profileService.saveProfile(result).subscribe(() => {
      this.messageService.add({severity: 'info', summary: 'Profil erfolgreich gespeichert'});
      if (this.userLoggedIn?.token) {
        this.store.dispatch(AuthActions.refreshToken({data: this.userLoggedIn.token}));
      }
    });
  }

  onImageChange(newInputValue: string) {
    if (this.userLoggedIn) {
      const result: User = {...this.userLoggedIn, avatarBase64: newInputValue, avatar: undefined};
      this.updateProfileData(result);
    }
  }

  getImage(): Uint8Array | string | undefined {
    if (this.userLoggedIn?.avatarBase64) {
      return this.userLoggedIn?.avatarBase64;
    }

    return this.userLoggedIn?.avatar;
  }

}
