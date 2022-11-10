import { sql } from './connect';

export type Carts = {
  cartId: number;
  userId: number;
  timeOfCreation: string;
  typeId: number;
  label: string;
  rating: number;
  dueDate: string | null;
  statusId: number;
  assignedToUserId: number | null;
  receivedFromUserId: number | null;
  groupId: number | null;
};

export async function getCartByCartId(cartId: number) {
  if (!cartId) return undefined;

  const [cart] = await sql<Carts[]>`
  SELECT
    *
  FROM
    carts
  WHERE
    cart_id = ${cartId}
  `;

  return cart;
}

export async function getAllCartsByUserId(userId: number) {
  if (!userId) return undefined;

  const carts = await sql<Carts[]>`
  SELECT
    *
  FROM
    carts
  WHERE
    user_id = ${userId}
  `;

  return carts;
}

export async function CreateCart(
  userId: number,
  timeOfCreation: Date,
  typeId: number,
  label: string,
  rating: number,
  dueDate: Date | null,
  statusId: number,
  assignedToUserId: number | any,
  receivedFromUserId: number | any,
  groupId: number | any,
) {
  // values that are potentially not provided need to be null
  const saveDueDate = dueDate ? dueDate : null;
  const saveAssignedToUserId = assignedToUserId ? assignedToUserId : null;
  const saveReceivedFromUserId = receivedFromUserId ? receivedFromUserId : null;
  const saveGroupId = groupId ? groupId : null;

  const [cartId] = await sql<Carts[]>`
  INSERT INTO carts
    (user_id, time_of_creation, type_id, label, rating, due_date, status_id, assigned_to_user_id, received_from_user_id, group_id)
  VALUES
    (${userId}, ${timeOfCreation}, ${typeId}, ${label}, ${rating}, ${saveDueDate}, ${statusId}, ${saveReceivedFromUserId}, ${saveAssignedToUserId}, ${saveGroupId})
  RETURNING
    cart_id
  `;
  return cartId;
}

export async function DeleteCartByCartId(cartId: number) {
  // if (!cartId || typeof cartId !== 'number') {
  //   return undefined;
  // }

  const [cart] = await sql<Carts[]>`
    DELETE FROM
      carts
    WHERE
      cart_id = ${cartId}
    RETURNING *
  `;
  return cart;
}

export async function UpdateCartByCartId(
  cartId: number,
  label: string,
  rating: number,
  statusId: number,
) {
  const [cart] = await sql<Carts[]>`
    UPDATE
      carts
    SET
      label = ${label},
      rating = ${rating},
      status_id= ${statusId}
    WHERE
      cart_id = ${cartId}
    RETURNING *
  `;
  console.log('cart', cart);
  return cart;
}
