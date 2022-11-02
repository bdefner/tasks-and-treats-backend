const groups = [
  {share_token:'123456789', user_a_id:1, user_b_id:2}
]

exports.up = async (sql) => {
  await sql`
    INSERT INTO groups ${sql(groups, 'share_token', 'user_a_id', 'user_b_id')}
  `;
};

exports.down = async (sql) => {
  for (const group of groups) {
    await sql`
      DELETE FROM
        groups
      WHERE
        share_token = ${group.share_token}
    `;
  }
};
