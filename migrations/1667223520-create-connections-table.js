exports.up = async (sql) => {
  await sql`
  CREATE TABLE connections(
    connection_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_requested_id integer REFERENCES users (user_id) ON DELETE CASCADE,
    user_received_id integer REFERENCES users (user_id) ON DELETE CASCADE,
    connection_token varchar(10) UNIQUE NOT NULL

  )`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE connections`;
};
