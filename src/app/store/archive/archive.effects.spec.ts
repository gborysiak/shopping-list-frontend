import {HttpErrorResponse} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {ArchiveEffects} from './archive.effects';
import {ArchiveActions} from './archive.actions';
import {ShoppingListService} from '../../service/ShoppingList.service';
import {setupEffects} from '@app/testing/effects-testing';

describe('ArchiveEffects', () => {
  let service: jasmine.SpyObj<ShoppingListService>;
  let ctx: ReturnType<typeof setupEffects<ArchiveEffects>>;

  beforeEach(() => {
    service = jasmine.createSpyObj<ShoppingListService>('ShoppingListService', ['loadAllPartArchive']);
    ctx = setupEffects(ArchiveEffects, [{provide: ShoppingListService, useValue: service}]);
  });

  it('loads the archive', async () => {
    service.loadAllPartArchive.and.returnValue(of([]));

    const result = await ctx.emitted(ctx.effects.loadArchiv$, ArchiveActions.loadArchive());

    expect(result).toEqual([ArchiveActions.loadArchiveSuccess({data: []})]);
  });

  it('turns a failed load into a failure action', async () => {
    const error = new HttpErrorResponse({status: 500});
    service.loadAllPartArchive.and.returnValue(throwError(() => error));

    const result = await ctx.emitted(ctx.effects.loadArchiv$, ArchiveActions.loadArchive());

    expect(result).toEqual([ArchiveActions.loadArchiveFailure({error})]);
  });
});
