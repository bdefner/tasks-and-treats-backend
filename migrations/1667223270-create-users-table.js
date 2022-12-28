exports.up = async (sql) => {
  await sql`
  CREATE TABLE users(
  user_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username varchar(70) NOT NULL UNIQUE,
  email varchar(70) NOT NULL,
  password_hash varchar (100) NOT NULL,
  budget integer,
  invite_token varchar(10)
)`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE users`;
};
