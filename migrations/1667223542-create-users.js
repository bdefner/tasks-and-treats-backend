const users = [
  {
    username: 'Beppino',
    email: 'notreal@email.at',
    password_hash:
      '$2b$12$7uko00ffLocRlRNImwl.zu4oP3ctHK9NgZ5ustrhaMIjhp83Egvia',
  },

  // passwords are: abc123

  {
    username: 'Franzi',
    email: 'notreal2@email.at',
    password_hash:
      '$2b$12$7uko00ffLocRlRNImwl.zu4oP3ctHK9NgZ5ustrhaMIjhp83Egvia',
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
