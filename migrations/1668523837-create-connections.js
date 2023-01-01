const connections = [
  {
    user_requested_id: 1,
    user_received_id: 2,
    connection_token: 'XXXXXXXXXX',
  },
  {
    user_requested_id: 1,
    user_received_id: 3,
    connection_token: 'YXXXXXXXXX',
  },
];

exports.up = async (sql) => {
  await sql`
  INSERT INTO connections ${sql(
    connections,
    'user_requested_id',
    'user_received_id',
    'connection_token',
  )}
`;
};

exports.down = async (sql) => {
  for (const connection of connections) {
    await sql`
      DELETE FROM
        connections
      WHERE
      user_requested_id = ${connection.user_requested_id}
    `;
  }
};
