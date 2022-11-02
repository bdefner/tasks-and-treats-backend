// import { sql } from './connect';

export const carts = [
  {
    text: 'Do this!',
    taskInput: 'Do this',
    rating: 3,
    id: Math.random().toString(),
    cartId: 1,
  },
  {
    text: 'Do that!',
    taskInput: 'Do that',
    rating: 8,
    id: Math.random().toString(),
    cartId: 2,
  },
];

// export type Carts = {
//   id: number;
//   text: string;
//   rating: number;
//   type: string;
//   shared_token_id: number | null;
// };

// // Get all carts
// export async function getAllCarts() {
//   const carts = await sql<Carts[]>`
//   SELECT * FROM carts
//   `;
//   return carts;
// }
