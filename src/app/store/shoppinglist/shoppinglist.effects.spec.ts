import {HttpErrorResponse} from '@angular/common/http';
import {Action} from '@ngrx/store';
import {Observable, of, throwError} from 'rxjs';
import {ShoppingListEffects} from './shoppinglist.effects';
import {ShoppingListActions} from './shoppinglist.actions';
import {ShoppingListService} from '../../service/ShoppingList.service';
import {ShoppingList} from '@app/entities/ShoppingList';
import {ShoppingListItem} from '@app/entities/ShoppingListItem';
import {setupEffects} from '@app/testing/effects-testing';

describe('ShoppingListEffects', () => {
  const list: ShoppingList = {id: 1, name: 'Weekly'};
  const lists: ShoppingList[] = [list];
  const item: ShoppingListItem = {id: 7, partRefId: 3, name: 'Milk', quantity: 1, purchased: false};
  const error = new HttpErrorResponse({status: 500});

  let service: jasmine.SpyObj<ShoppingListService>;
  let ctx: ReturnType<typeof setupEffects<ShoppingListEffects>>;

  beforeEach(() => {
    service = jasmine.createSpyObj<ShoppingListService>('ShoppingListService', [
      'getAllShoppingList', 'createShoppingList', 'updateShoppingList', 'deleteShoppingList', 'resetShoppingList',
      'createItem', 'updateItem', 'deleteItem', 'archivePart'
    ]);
    service.getAllShoppingList.and.returnValue(of(lists));
    ctx = setupEffects(ShoppingListEffects, [{provide: ShoppingListService, useValue: service}]);
  });

  describe('loading', () => {
    it('loads the lists', async () => {
      const result = await ctx.emitted(ctx.effects.loadShoppingLists$, ShoppingListActions.loadShoppingLists());

      expect(result).toEqual([ShoppingListActions.loadShoppingListsSuccess({data: lists})]);
    });

    it('turns a failed load into a failure action', async () => {
      service.getAllShoppingList.and.returnValue(throwError(() => error));

      const result = await ctx.emitted(ctx.effects.loadShoppingLists$, ShoppingListActions.loadShoppingLists());

      expect(result).toEqual([ShoppingListActions.loadShoppingListsFailure({error})]);
    });
  });

  describe('service calls', () => {
    const cases: [string, () => Observable<Action>, Action, Action, () => jasmine.Spy][] = [
      ['createShoppingList', () => ctx.effects.createShoppingList$, ShoppingListActions.createShoppingList({data: list}),
        ShoppingListActions.createShoppingListSuccess({data: list}), () => service.createShoppingList],
      ['updateShoppingList', () => ctx.effects.updateShoppingList$, ShoppingListActions.updateShoppingList({data: list}),
        ShoppingListActions.updateShoppingListSuccess({data: list}), () => service.updateShoppingList],
      ['deleteShoppingList', () => ctx.effects.deleteShoppingList$, ShoppingListActions.deleteShoppingList({data: list}),
        ShoppingListActions.deleteShoppingListSuccess({data: list}), () => service.deleteShoppingList],
      ['resetShoppingList', () => ctx.effects.resetShoppingList$, ShoppingListActions.resetShoppingList({data: list}),
        ShoppingListActions.resetShoppingListSuccess({data: list}), () => service.resetShoppingList]
    ];

    for (const [name, effect, action, success, spy] of cases) {
      it(`${name} emits exactly its success action (no extra reload)`, async () => {
        spy().and.returnValue(of(list));

        const result = await ctx.emitted(effect(), action);

        expect(result).toEqual([success]);
        expect(service.getAllShoppingList).not.toHaveBeenCalled();
      });
    }

    it('turns a failed create into a failure action', async () => {
      service.createShoppingList.and.returnValue(throwError(() => error));

      const result = await ctx.emitted(ctx.effects.createShoppingList$, ShoppingListActions.createShoppingList({data: list}));

      expect(result).toEqual([ShoppingListActions.createShoppingListFailure({error})]);
    });

    it('passes the list id and item to the item effects', async () => {
      service.createItem.and.returnValue(of(item));
      service.updateItem.and.returnValue(of(item));
      service.deleteItem.and.returnValue(of(item));

      expect(await ctx.emitted(ctx.effects.createArtikel$, ShoppingListActions.createItem({shoppingId: 1, data: item})))
        .toEqual([ShoppingListActions.createItemSuccess({data: item})]);
      expect(await ctx.emitted(ctx.effects.updateArtikel$, ShoppingListActions.updateItem({shoppingId: 1, data: item})))
        .toEqual([ShoppingListActions.updateItemSuccess({data: item})]);
      expect(await ctx.emitted(ctx.effects.deleteArtikel$, ShoppingListActions.deleteItem({shoppingId: 1, data: item})))
        .toEqual([ShoppingListActions.deleteItemSuccess({data: item})]);

      expect(service.createItem).toHaveBeenCalledWith(1, item);
      expect(service.updateItem).toHaveBeenCalledWith(1, item);
      expect(service.deleteItem).toHaveBeenCalledWith(1, item);
    });

    it('archives the purchased items of a list', async () => {
      service.archivePart.and.returnValue(of([item]));

      const result = await ctx.emitted(ctx.effects.archiviereArtikel$, ShoppingListActions.archiveItem({shoppingId: 1}));

      expect(service.archivePart).toHaveBeenCalledWith(1);
      expect(result).toEqual([ShoppingListActions.archiveItemSuccess({data: [item]})]);
    });
  });

  describe('success handling (toast, navigation, reload)', () => {
    const cases: [string, () => Observable<Action>, Action, string][] = [
      ['create list', () => ctx.effects.createShoppingListSuccess$, ShoppingListActions.createShoppingListSuccess({data: list}), 'shoppinglist.created'],
      ['update list', () => ctx.effects.updateShoppingListSuccess$, ShoppingListActions.updateShoppingListSuccess({data: list}), 'shoppinglist.updated'],
      ['delete list', () => ctx.effects.deleteShoppingListSuccess$, ShoppingListActions.deleteShoppingListSuccess({data: list}), 'shoppinglist.deleted'],
      ['reset list', () => ctx.effects.resetShoppingListSuccess$, ShoppingListActions.resetShoppingListSuccess({data: list}), 'shoppinglist.reseted'],
      ['create item', () => ctx.effects.createArtikelSuccess$, ShoppingListActions.createItemSuccess({data: item}), 'part.created'],
      ['update item', () => ctx.effects.updateArtikelSuccess$, ShoppingListActions.updateItemSuccess({data: item}), 'part.updated'],
      ['delete item', () => ctx.effects.deleteArtikelSuccess$, ShoppingListActions.deleteItemSuccess({data: item}), 'part.deleted'],
      ['archive items', () => ctx.effects.archiviereArtikelSuccess$, ShoppingListActions.archiveItemSuccess({data: [item]}), 'part.archived']
    ];

    for (const [name, effect, action, messageKey] of cases) {
      it(`${name}: shows "${messageKey}", goes home and reloads the lists once`, async () => {
        const result = await ctx.emitted(effect(), action);

        expect(ctx.messageService.add).toHaveBeenCalledOnceWith({severity: 'success', summary: messageKey});
        expect(ctx.router.navigateByUrl).toHaveBeenCalledOnceWith('/home');
        expect(service.getAllShoppingList).toHaveBeenCalledTimes(1);
        expect(result).toEqual([ShoppingListActions.loadShoppingListsSuccess({data: lists})]);
      });
    }
  });
});
