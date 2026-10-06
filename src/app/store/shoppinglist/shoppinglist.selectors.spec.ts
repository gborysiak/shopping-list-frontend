import {selectShoppingListsWithParts} from './shoppinglist.selectors';
import {ShoppingList} from '@app/entities/ShoppingList';
import {Part} from '@app/entities/Part';

describe('selectShoppingListsWithParts', () => {
  const parts: Part[] = [{id: 1, name: 'Milk', categoryId: 10}];

  const lists: ShoppingList[] = [{
    id: 5,
    name: 'Weekly',
    shoppingListItem: [
      {id: 1, partRefId: 1, name: 'Milk', quantity: 1, purchased: false},
      {id: 2, partRefId: 99, name: 'Unknown', quantity: 2, purchased: true}
    ]
  }, {
    id: 6,
    name: 'Empty'
  }];

  it('attaches the matching part to each item', () => {
    const result = selectShoppingListsWithParts.projector(lists, parts);

    expect(result[0].shoppingListItem![0].part).toEqual(parts[0]);
  });

  it('leaves items without a matching part untouched', () => {
    const result = selectShoppingListsWithParts.projector(lists, parts);

    expect(result[0].shoppingListItem![1].part).toBeUndefined();
  });

  it('keeps lists without items', () => {
    const result = selectShoppingListsWithParts.projector(lists, parts);

    expect(result[1].shoppingListItem).toBeUndefined();
  });

  it('returns copies, so the store state is never mutated', () => {
    const result = selectShoppingListsWithParts.projector(lists, parts);

    result[0].shoppingListItem![0].purchased = true;

    expect(lists[0].shoppingListItem![0].purchased).toBeFalse();
    expect(lists[0].shoppingListItem![0].part).toBeUndefined();
  });
});
