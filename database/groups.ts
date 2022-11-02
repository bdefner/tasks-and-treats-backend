import { sql } from './connect';

export const groups = [
  {
    id: 1,
    name: 'private',
    type: 'task',
    shared_token: 'kjghjkgjhg',
  },
  {
    id: 2,
    name: 'Andrea',
    type: 'task',
    shared_token_id: '',
  },
  {
    id: 3,
    name: 'Franzi',
    type: 'task',
    shared_token_id: '',
  },
  {
    id: 4,
    name: 'Juan',
    type: 'task',
    shared_token_id: '',
  },
  {
    id: 5,
    name: 'Ramón',
    type: 'task',
    shared_token_id: '',
  },
];

// Types

// export type Group = {
//   id: number;
//   name: string;
//   type: string;
//   shared_token_id: number | null;
// };

// // Get all groups
// export async function getAllGroups() {
//   const groups = await sql<Group[]>`
//   SELECT * FROM groups
//   `;
//   return groups;
// }
