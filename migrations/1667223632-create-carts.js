const carts = [
  {user_id: 1, time_of_creation: '2022-10-31', type_id: 1, label: 'This is the first personal Task', rating: 8, due_date: 'undefined' , status_id: 1, group_id: 0},
];

exports.up = async (sql) => {
  await sql`INSERT INTO carts
  (user_id, time_of_creation, type_id, label, rating, status_id)
VALUES
 (1, '2022-10-31', 1, 'This is the first personal Task', 8, 1),
 (1, '2022-10-31', 2, 'This is the first personal Treat', 3, 1)
  `;

  await sql`INSERT INTO carts
  (user_id, time_of_creation, type_id, label, rating, status_id, group_id)
VALUES
 (1, '2022-10-31', 1, 'This is the first shared Task', 5, 3, 1),
 (1, '2022-10-31', 2, 'This is the first shared Treat', 4, 3, 1)`
};

exports.down = async (sql) => {
  await sql`DELETE FROM carts`
};