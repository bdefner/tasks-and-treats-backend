const types = [
  {label: 'task'},
  {label: 'treat'},
];

exports.up = async (sql) => {
  await sql`
    INSERT INTO types ${sql(types, 'label')}
  `;
};

exports.down = async (sql) => {
  for (const type of types) {
    await sql`
      DELETE FROM
        types
      WHERE
        label = ${type.label}
    `;
  }
};
