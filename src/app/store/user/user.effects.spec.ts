import {HttpErrorResponse} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {UserEffects} from './user.effects';
import {UserActions} from './user.actions';
import {UserService} from '../../service/user.service';
import {RoleService} from '../../service/role.service';
import {ShoppingListService} from '../../service/ShoppingList.service';
import {AuthService} from '../../service/auth.service';
import {User} from '@app/entities/user';
import {setupEffects} from '@app/testing/effects-testing';

describe('UserEffects', () => {
  const user: User = {id: 1, username: 'alice', password: ''};
  const error = new HttpErrorResponse({status: 500});

  let userService: jasmine.SpyObj<UserService>;
  let roleService: jasmine.SpyObj<RoleService>;
  let ctx: ReturnType<typeof setupEffects<UserEffects>>;

  beforeEach(() => {
    userService = jasmine.createSpyObj<UserService>('UserService',
      ['getAllUsersFriends', 'getAllUsers', 'updateUser', 'deleteUser']);
    roleService = jasmine.createSpyObj<RoleService>('RoleService', ['getAllRoles']);
    userService.getAllUsers.and.returnValue(of([user]));

    ctx = setupEffects(UserEffects, [
      {provide: UserService, useValue: userService},
      {provide: RoleService, useValue: roleService},
      {provide: ShoppingListService, useValue: {}},
      {provide: AuthService, useValue: {}}
    ]);
  });

  it('loads users, friends and roles', async () => {
    userService.getAllUsersFriends.and.returnValue(of([user]));
    roleService.getAllRoles.and.returnValue(of([{id: 1, name: 'ROLE_ADMIN'}]));

    expect(await ctx.emitted(ctx.effects.loadUsers$, UserActions.loadUsers()))
      .toEqual([UserActions.loadUsersSuccess({data: [user]})]);
    expect(await ctx.emitted(ctx.effects.loadUsersFriends$, UserActions.loadUsersFriends()))
      .toEqual([UserActions.loadUsersFriendsSuccess({data: [user]})]);
    expect(await ctx.emitted(ctx.effects.loadRoles$, UserActions.loadRoles()))
      .toEqual([UserActions.loadRolesSuccess({data: [{id: 1, name: 'ROLE_ADMIN'}]})]);
  });

  it('turns a failed load into a failure action', async () => {
    userService.getAllUsers.and.returnValue(throwError(() => error));

    const result = await ctx.emitted(ctx.effects.loadUsers$, UserActions.loadUsers());

    expect(result).toEqual([UserActions.loadUsersFailure({error})]);
  });

  it('updates a user', async () => {
    userService.updateUser.and.returnValue(of(user));

    const result = await ctx.emitted(ctx.effects.updateUser$, UserActions.updateUser({data: user}));

    expect(userService.updateUser).toHaveBeenCalledWith(user);
    expect(result).toEqual([UserActions.updateUserSuccess({data: user})]);
  });

  it('deletes a user', async () => {
    userService.deleteUser.and.returnValue(of(user));

    const result = await ctx.emitted(ctx.effects.deleteUser$, UserActions.deleteUser({data: user}));

    expect(userService.deleteUser).toHaveBeenCalledWith(user);
    expect(result).toEqual([UserActions.deleteUserSuccess({data: user})]);
  });

  it('goes back to the user page and reloads the users after an update', async () => {
    const result = await ctx.emitted(ctx.effects.updateUserSuccess$, UserActions.updateUserSuccess({data: user}));

    expect(ctx.router.navigateByUrl).toHaveBeenCalledOnceWith('/user');
    expect(result).toEqual([UserActions.loadUsersSuccess({data: [user]})]);
  });
});
