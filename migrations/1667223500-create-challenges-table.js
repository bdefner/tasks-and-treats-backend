exports.up = async (sql) => {
  await sql`
  CREATE TABLE challenges(
    challenge_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    label varchar (70) NOT NULL UNIQUE,
    description varchar (100),
    reward integer NOT NULL
  )`;
};

exports.down = async (sql) => {
  await sql`DROP TABLE challenges`;
};
