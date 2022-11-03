import { sql } from './connect';

export type Carts = {
  cartId: number;
  userId: number;
  timeOfCreation: string;
  typeId: number;
  label: string;
  dueDate: string;
  statusId: number;
  assignedToUserId: number;
  receivedFromUserId: number;
  groupId: number;
};

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
