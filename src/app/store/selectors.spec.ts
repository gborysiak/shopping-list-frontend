import {initialTestState} from '@app/testing/test-providers';
import {selectCategoryAndParts, selectCategoryById} from './category/category.selectors';
import {selectPartById} from './part/part.selector';
import {selectItemById, selectShoppingListById} from './shoppinglist/shoppinglist.selectors';
import {selectLogin} from './auth/auth.selectors';

describe('selectors', () => {
  const state = {
    ...initialTestState,
    category: {
      loading: false,
      category: [{id: 1, name: 'Fruit'}, {id: 2, name: 'Dairy'}, {id: 3, name: 'Empty'}]
    },
    part: {
      loading: false,
      part: [
        {id: 10, name: 'Apple', categoryId: 1},
        {id: 11, name: 'Milk', categoryId: 2},
        {id: 12, name: 'Cheese', categoryId: 2}
      ]
    },
    shoppingList: {
      shoppingList: [{
        id: 5,
        name: 'Weekly',
        shoppingListItem: [
          {id: 100, partRefId: 10, name: 'Apple', quantity: 1, purchased: false},
          {id: 101, partRefId: 11, name: 'Milk', quantity: 2, purchased: true}
        ]
      }]
    },
    auth: {loginUser: {username: 'alice', password: ''}}
  };

  it('selectCategoryById finds a category', () => {
    expect(selectCategoryById(2)(state).name).toBe('Dairy');
  });

  it('selectPartById finds a part', () => {
    expect(selectPartById(12)(state).name).toBe('Cheese');
  });

  it('selectShoppingListById finds a list', () => {
    expect(selectShoppingListById(5)(state).name).toBe('Weekly');
  });

  it('selectItemById finds an item inside a list', () => {
    expect(selectItemById(5, 101)(state).name).toBe('Milk');
  });

  it('selectLogin returns the logged-in user', () => {
    expect(selectLogin(state)?.username).toBe('alice');
  });

  describe('selectCategoryAndParts', () => {
    it('groups parts under their category', () => {
      const result = selectCategoryAndParts(state);

      expect(result.map(category => category.parts.map(part => part.name))).toEqual([['Apple'], ['Milk', 'Cheese'], []]);
    });

    it('keeps the category fields', () => {
      expect(selectCategoryAndParts(state)[1]).toEqual(jasmine.objectContaining({id: 2, name: 'Dairy'}));
    });
  });
});
