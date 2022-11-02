exports.up = async (sql) => {
  await sql`
  CREATE TABLE carts(
    cart_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id int NOT NULL,
    time_of_creation DATE NOT NULL,
    type_id int NOT NULL,
    label varchar(140) NOT NULL,
    rating int NOT NULL,
    due_date DATE,
    status_id int NOT NULL,
    assigned_to_user_id int,
    received_from_user_id int,
    group_id int
  )`
};

exports.down = async (sql) => {
  await sql`DROP TABLE carts`
};
