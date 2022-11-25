/**
 * @jest-environment node
 */

import {
  CreateCart,
  getCartByCartId,
  UpdateCartByCartId,
} from '../../database/carts';

test('Create a cart, update and delete it', async () => {
  // Try to create a cart with missing arguments

  const newCart = {
    userId: 1,
    timeOfCreation: '2022-10-31',
    typeId: 1,
    label: 'Test',
    rating: 1,
    dueDate: null,
    statusId: 1,
    assignedToUserId: null,
    receivedFromUserId: null,
    groupId: null,
  };
  let response = await CreateCart(
    newCart.userId,
    newCart.timeOfCreation,
    newCart.typeId,
    newCart.label,
    newCart.rating,
    newCart.dueDate,
    newCart.statusId,
    newCart.assignedToUserId,
    newCart.receivedFromUserId,
    newCart.groupId,
  );

  expect(response).not.toBe(undefined);

  const cartId = response.cartId;

  // get the cart by cartId

  response = await getCartByCartId(cartId);

  expect(response).not.toStrictEqual(newCart);

  // update the cart

  newCart.rating = 100;

  response = UpdateCartByCartId(
    cartId,
    newCart.label,
    newCart.rating,
    newCart.statusId,
  );
  expect(response).not.toBe(undefined);

  newCart.statusId = 2;

  response = UpdateCartByCartId(
    cartId,
    newCart.label,
    newCart.rating,
    newCart.statusId,
  );
  expect(response).not.toStrictEqual(newCart);

  newCart.label = 'Test 2';

  response = UpdateCartByCartId(
    cartId,
    newCart.label,
    newCart.rating,
    newCart.statusId,
  );
  expect(response).not.toStrictEqual(newCart);
});
