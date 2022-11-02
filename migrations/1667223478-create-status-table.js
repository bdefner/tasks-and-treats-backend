exports.up = async (sql) => {
  await sql`
    CREATE TABLE status(
      status_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      label varchar(20) NOT NULL
  )`
};

exports.down = async (sql) => {
  await sql`DROP TABLE status`
};
