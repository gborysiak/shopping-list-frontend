import {HttpErrorResponse} from '@angular/common/http';
import {of, throwError} from 'rxjs';
import {CategoryEffects} from './category.effects';
import {CategorysActions} from './category.actions';
import {CategoryService} from '@app/service/Category.service';
import {Category} from '@app/entities/Category';
import {setupEffects} from '@app/testing/effects-testing';

describe('CategoryEffects', () => {
  const category: Category = {id: 1, name: 'Fruit'};
  const categories = [category];
  const error = new HttpErrorResponse({status: 500});

  let service: jasmine.SpyObj<CategoryService>;
  let ctx: ReturnType<typeof setupEffects<CategoryEffects>>;

  beforeEach(() => {
    service = jasmine.createSpyObj<CategoryService>('CategoryService',
      ['getAllCategory', 'createCategory', 'updateCategory', 'deleteCategory']);
    service.getAllCategory.and.returnValue(of(categories));
    ctx = setupEffects(CategoryEffects, [{provide: CategoryService, useValue: service}]);
  });

  it('loads the categories', async () => {
    const result = await ctx.emitted(ctx.effects.loadCategorys$, CategorysActions.loadCategorys());

    expect(result).toEqual([CategorysActions.loadCategorysSuccess({data: categories})]);
  });

  it('turns a failed load into a failure action', async () => {
    service.getAllCategory.and.returnValue(throwError(() => error));

    const result = await ctx.emitted(ctx.effects.loadCategorys$, CategorysActions.loadCategorys());

    expect(result).toEqual([CategorysActions.loadCategorysFailure({error})]);
  });

  it('create, update and delete emit only their success action (no extra reload)', async () => {
    service.createCategory.and.returnValue(of(category));
    service.updateCategory.and.returnValue(of(category));
    service.deleteCategory.and.returnValue(of(category));

    expect(await ctx.emitted(ctx.effects.createCategory$, CategorysActions.createCategory({data: category})))
      .toEqual([CategorysActions.createCategorySuccess({data: category})]);
    expect(await ctx.emitted(ctx.effects.updateCategory$, CategorysActions.updateCategory({data: category})))
      .toEqual([CategorysActions.updateCategorySuccess({data: category})]);
    expect(await ctx.emitted(ctx.effects.deleteCategory$, CategorysActions.deleteCategory({data: category})))
      .toEqual([CategorysActions.deleteCategorySuccess({data: category})]);
    expect(service.getAllCategory).not.toHaveBeenCalled();
  });

  it('turns a failed update into a failure action', async () => {
    service.updateCategory.and.returnValue(throwError(() => error));

    const result = await ctx.emitted(ctx.effects.updateCategory$, CategorysActions.updateCategory({data: category}));

    expect(result).toEqual([CategorysActions.updateCategoryFailure({error})]);
  });

  const successCases = [
    ['created', () => ctx.effects.createCategorySuccess$, CategorysActions.createCategorySuccess({data: category}), 'category.created'],
    ['updated', () => ctx.effects.updateCategorySuccess$, CategorysActions.updateCategorySuccess({data: category}), 'category.updated'],
    ['deleted', () => ctx.effects.deleteCategorySuccess$, CategorysActions.deleteCategorySuccess({data: category}), 'category.deleted']
  ] as const;

  for (const [name, effect, action, messageKey] of successCases) {
    it(`${name}: shows "${messageKey}", goes home and reloads once`, async () => {
      const result = await ctx.emitted(effect(), action);

      expect(ctx.messageService.add).toHaveBeenCalledOnceWith({severity: 'success', summary: messageKey});
      expect(ctx.router.navigateByUrl).toHaveBeenCalledOnceWith('/home');
      expect(service.getAllCategory).toHaveBeenCalledTimes(1);
      expect(result).toEqual([CategorysActions.loadCategorysSuccess({data: categories})]);
    });
  }
});
