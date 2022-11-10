exports.up = async (sql) => {
  await sql`
  CREATE TABLE carts(
    cart_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id integer REFERENCES users (user_id) ON DELETE CASCADE,
    time_of_creation DATE NOT NULL,
    type_id integer NOT NULL,
    label varchar(140) NOT NULL,
    rating integer NOT NULL,
    due_date DATE,
    status_id integer NOT NULL,
    assigned_to_user_id integer,
    received_from_user_id integer,
    group_id integer REFERENCES groups (group_id) ON DELETE CASCADE
  )`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE carts`;
};
