import {HttpErrorResponse} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {PartEffects} from './part.effects';
import {PartsActions} from './part.actions';
import {PartService} from '@app/service/Part.service';
import {Part} from '@app/entities/Part';
import {setupEffects} from '@app/testing/effects-testing';

describe('PartEffects', () => {
  const part: Part = {id: 1, name: 'Milk', categoryId: 2};
  const parts = [part];
  const error = new HttpErrorResponse({status: 500});

  let service: jasmine.SpyObj<PartService>;
  let ctx: ReturnType<typeof setupEffects<PartEffects>>;

  beforeEach(() => {
    service = jasmine.createSpyObj<PartService>('PartService', ['getAllPart', 'createPart', 'updatePart', 'deletePart']);
    service.getAllPart.and.returnValue(of(parts));
    ctx = setupEffects(PartEffects, [{provide: PartService, useValue: service}]);
  });

  it('loads the parts', async () => {
    const result = await ctx.emitted(ctx.effects.loadParts$, PartsActions.loadParts());

    expect(result).toEqual([PartsActions.loadPartsSuccess({data: parts})]);
  });

  it('turns a failed load into a failure action', async () => {
    service.getAllPart.and.returnValue(throwError(() => error));

    const result = await ctx.emitted(ctx.effects.loadParts$, PartsActions.loadParts());

    expect(result).toEqual([PartsActions.loadPartsFailure({error})]);
  });

  it('create, update and delete emit only their success action (no extra reload)', async () => {
    service.createPart.and.returnValue(of(part));
    service.updatePart.and.returnValue(of(part));
    service.deletePart.and.returnValue(of(part));

    expect(await ctx.emitted(ctx.effects.createPart$, PartsActions.createPart({data: part})))
      .toEqual([PartsActions.createPartSuccess({data: part})]);
    expect(await ctx.emitted(ctx.effects.updatePart$, PartsActions.updatePart({data: part})))
      .toEqual([PartsActions.updatePartSuccess({data: part})]);
    expect(await ctx.emitted(ctx.effects.deletePart$, PartsActions.deletePart({data: part})))
      .toEqual([PartsActions.deletePartSuccess({data: part})]);
    expect(service.getAllPart).not.toHaveBeenCalled();
  });

  it('turns a failed delete into a failure action', async () => {
    service.deletePart.and.returnValue(throwError(() => error));

    const result = await ctx.emitted(ctx.effects.deletePart$, PartsActions.deletePart({data: part}));

    expect(result).toEqual([PartsActions.deletePartFailure({error})]);
  });

  const successCases = [
    ['created', () => ctx.effects.createPartSuccess$, PartsActions.createPartSuccess({data: part}), 'part.created'],
    ['updated', () => ctx.effects.updatePartSuccess$, PartsActions.updatePartSuccess({data: part}), 'part.updated'],
    ['deleted', () => ctx.effects.deletePartSuccess$, PartsActions.deletePartSuccess({data: part}), 'part.deleted']
  ] as const;

  for (const [name, effect, action, messageKey] of successCases) {
    it(`${name}: shows "${messageKey}", goes home and reloads once`, async () => {
      const result = await ctx.emitted(effect(), action);

      expect(ctx.messageService.add).toHaveBeenCalledOnceWith({severity: 'success', summary: messageKey});
      expect(ctx.router.navigateByUrl).toHaveBeenCalledOnceWith('/home');
      expect(service.getAllPart).toHaveBeenCalledTimes(1);
      expect(result).toEqual([PartsActions.loadPartsSuccess({data: parts})]);
    });
  }
});
