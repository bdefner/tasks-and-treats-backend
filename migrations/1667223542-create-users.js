const users = [
  {
    username: 'Beppino',
    email: 'notreal@email.at',
    password_hash: 'dsh78932z4iughf32987zrwer342',
  },
  {
    username: 'Franzi',
    email: 'notreal2@email.at',
    password_hash: 'dsh78932z4iutzrtzrtzhfghft',
  },
];

exports.up = async (sql) => {
  await sql`
    INSERT INTO users ${sql(users, 'username', 'email', 'password_hash')}
  `;
};

exports.down = async (sql) => {
  for (const user of users) {
    await sql`
      DELETE FROM
        users
      WHERE
        username = ${user.username} AND
        password_hash = ${user.password_hash}
    `;
  }
};
