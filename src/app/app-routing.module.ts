import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "@app/components/einkaufszettel/home/home.component";
import {EditArtikelComponent} from "@app/components/einkaufszettel/edit-artikel/edit-artikel.component";
import {LoginComponent} from "@app/components/auth/login/login.component";
import {AuthGuard} from "@app/guard/auth-guard";
import {RegisterComponent} from "@app/components/auth/register/register.component";
import {ArchivComponent} from "@app/components/archiv/archiv.component";
import {EditEinkaufszettelComponent} from "@app/components/einkaufszettel/edit-einkaufszettel/edit-einkaufszettel.component";
import {RoleGuard} from "@app/guard/role-guard";
import {UserComponent} from "@app/components/admin/user/user.component";
import {ROLE_NAME} from "@app/entities/enum/rolename";
import {
  RegistrationConfirmationComponent
} from "@app/components/auth/registration-confirmation/registration-confirmation.component";
import {ProfileEditComponent} from "@app/components/settings/profile-edit/profile-edit.component";
import { PartComponent } from '@app/components/part/part/part.component';
import { CategoryComponent } from '@app/components/category/category/category.component';
import { NewpartComponent } from '@app/components/mobile/newpart/newpart.component';
import { CategorysComponent } from '@app/components/categorys/categorys.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  //{path: 'register', component: RegisterComponent},
  //{path: 'registration-confirmation', component: RegistrationConfirmationComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'einkaufszettel/:einkaufszettelId', component: EditEinkaufszettelComponent, canActivate: [AuthGuard]},
  {path: 'einkaufszettel', component: EditEinkaufszettelComponent, canActivate: [AuthGuard]},
  {path: 'artikel/new/:einkaufszettelId', component: EditArtikelComponent, canActivate: [AuthGuard]},
  {path: 'item/:shoppingList/:item', component: EditArtikelComponent, canActivate: [AuthGuard]},
  {path: 'archiv', component: ArchivComponent, canActivate: [AuthGuard]},
  {path: 'profile-edit', component: ProfileEditComponent, canActivate: [AuthGuard]},
  {path: 'user', component: UserComponent, canActivate: [AuthGuard, RoleGuard], data: {expectedRole: ROLE_NAME.ROLE_ADMIN}},
  {path: 'part', component: PartComponent, canActivate: [AuthGuard]},
  {path: 'part/:partId', component: PartComponent, canActivate: [AuthGuard]},
  {path: 'category', component: CategoryComponent, canActivate: [AuthGuard]},
  {path: 'category/:categoryId', component: CategoryComponent, canActivate: [AuthGuard]},
  {path: 'mobile/addPart/:shoppingId', component: NewpartComponent, canActivate: [AuthGuard]},
  {path: 'categorys', component: CategorysComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
