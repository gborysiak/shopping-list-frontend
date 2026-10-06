import {HttpErrorResponse} from '@angular/common/http';
import {shoppingListFeature} from './shoppinglist/shoppinglist.reducer';
import {ShoppingListActions} from './shoppinglist/shoppinglist.actions';
import {categoryFeature} from './category/category.reducer';
import {CategorysActions} from './category/category.actions';
import {partFeature} from './part/part.reducer';
import {PartsActions} from './part/part.actions';
import {userFeature} from './user/user.reducer';
import {UserActions} from './user/user.actions';
import {archiveFeature} from './archive/archive.reducer';
import {ArchiveActions} from './archive/archive.actions';
import {authFeature} from './auth/auth.reducer';
import {AuthActions} from './auth/auth.actions';
import {User} from '@app/entities/user';

const init = {type: '@@test-init'};

describe('reducers', () => {
  describe('shoppingList', () => {
    it('starts empty', () => {
      expect(shoppingListFeature.reducer(undefined, init).shoppingList).toEqual([]);
    });

    it('replaces the lists on load success', () => {
      const lists = [{id: 1, name: 'Weekly'}];

      const state = shoppingListFeature.reducer(undefined, ShoppingListActions.loadShoppingListsSuccess({data: lists}));

      expect(state.shoppingList).toEqual(lists);
    });

    it('ignores a load failure', () => {
      const before = shoppingListFeature.reducer(undefined, ShoppingListActions.loadShoppingListsSuccess({data: [{id: 1, name: 'A'}]}));

      const after = shoppingListFeature.reducer(before, ShoppingListActions.loadShoppingListsFailure({error: new HttpErrorResponse({status: 500})}));

      expect(after).toBe(before);
    });
  });

  describe('category', () => {
    it('starts empty and loading', () => {
      const state = categoryFeature.reducer(undefined, init);

      expect(state.category).toEqual([]);
      expect(state.loading).toBeTrue();
    });

    it('replaces the categories on load success and keeps the rest of the state', () => {
      const state = categoryFeature.reducer(undefined, CategorysActions.loadCategorysSuccess({data: [{id: 1, name: 'Fruit'}]}));

      expect(state.category).toEqual([{id: 1, name: 'Fruit'}]);
      expect(state.loading).toBeTrue();
    });
  });

  describe('part', () => {
    it('starts empty and loading', () => {
      const state = partFeature.reducer(undefined, init);

      expect(state.part).toEqual([]);
      expect(state.loading).toBeTrue();
    });

    it('replaces the parts on load success', () => {
      const state = partFeature.reducer(undefined, PartsActions.loadPartsSuccess({data: [{id: 1, name: 'Milk', categoryId: 2}]}));

      expect(state.part).toEqual([{id: 1, name: 'Milk', categoryId: 2}]);
    });
  });

  describe('user', () => {
    it('starts with empty lists', () => {
      expect(userFeature.reducer(undefined, init)).toEqual({usersFriends: [], users: [], roles: []});
    });

    it('stores friends, users and roles independently', () => {
      const user: User = {id: 1, username: 'a', password: ''};

      let state = userFeature.reducer(undefined, UserActions.loadUsersSuccess({data: [user]}));
      state = userFeature.reducer(state, UserActions.loadUsersFriendsSuccess({data: []}));
      state = userFeature.reducer(state, UserActions.loadRolesSuccess({data: [{id: 1, name: 'ROLE_ADMIN'}]}));

      expect(state.users).toEqual([user]);
      expect(state.usersFriends).toEqual([]);
      expect(state.roles).toEqual([{id: 1, name: 'ROLE_ADMIN'}]);
    });
  });

  describe('archive', () => {
    it('replaces the archive on load success', () => {
      expect(archiveFeature.reducer(undefined, init).partsArchive).toEqual([]);

      const state = archiveFeature.reducer(undefined, ArchiveActions.loadArchiveSuccess({data: []}));

      expect(state.partsArchive).toEqual([]);
    });
  });

  describe('auth', () => {
    const user: User = {username: 'alice', password: '', token: 't'};

    it('starts logged out', () => {
      expect(authFeature.reducer(undefined, init).loginUser).toBeNull();
    });

    it('stores the user on register, login, refresh and localStorage restore', () => {
      const actions = [
        AuthActions.registerSuccess({data: user}),
        AuthActions.loginSuccess({data: user}),
        AuthActions.refreshTokenSuccess({data: user}),
        AuthActions.loginLocalstorage({data: user})
      ];

      for (const action of actions) {
        expect(authFeature.reducer(undefined, action).loginUser).withContext(action.type).toEqual(user);
      }
    });

    it('clears the user on logout', () => {
      const loggedIn = authFeature.reducer(undefined, AuthActions.loginSuccess({data: user}));

      expect(authFeature.reducer(loggedIn, AuthActions.logout()).loginUser).toBeNull();
    });
  });
});
