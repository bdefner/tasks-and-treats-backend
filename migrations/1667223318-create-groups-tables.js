exports.up = async (sql) => {
  await sql`
  CREATE TABLE groups(
    group_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    share_token varchar(90) NOT NULL,
    user_a_id int NOT NULL,
    user_b_id int NOT NULL
  )`
};

exports.down = async (sql) => {
  await sql`DROP TABLE groups`
};
