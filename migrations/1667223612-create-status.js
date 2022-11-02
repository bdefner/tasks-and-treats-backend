const status = [
  {label: 'private'},
  {label: 'pending'},
  {label: 'accepted'},
  {label: 'in process'},
  {label: 'done'},
]

exports.up = async (sql) => {
  await sql`
    INSERT INTO status ${sql(status, 'label')}
  `;
};

exports.down = async (sql) => {
  for (const item of status) {
    await sql`
      DELETE FROM
        status
      WHERE
        label = ${item.label}
    `;
  }
};
