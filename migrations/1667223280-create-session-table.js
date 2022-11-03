exports.up = async (sql) => {
  await sql`
  CREATE TABLE sessions(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  token varchar(110) NOT NULL UNIQUE,
  expiry_timestamp timestamp NOT NULL DEFAULT NOW() + INTERVAL '7 days',
  csrf_secret varchar NOT NULL,
	user_id integer REFERENCES users (user_id) ON DELETE CASCADE
)`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE sessions`;
};
