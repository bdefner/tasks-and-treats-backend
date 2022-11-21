const challenges = [
  {
    label: '👼 Noob!',
    description: 'Add your first task',
    reward: 1,
  },
  {
    label: '🧚 You deserve this',
    description: 'Redeem your first treat',
    reward: 5,
  },
  {
    label: '👨‍🎓 Junior procrastinator',
    description: 'Have 5 tasks undone for over one weeks',
    reward: -3,
  },
  {
    label: '💎 Scrimper',
    description: 'Collect 100 stars',
    reward: 20,
  },
  {
    label: '👑 Master procrastinator',
    description: 'Do not finish a task for one month',
    reward: -10,
  },
];

exports.up = async (sql) => {
  await sql`
  INSERT INTO challenges ${sql(challenges, 'label', 'description', 'reward')}
`;
};

exports.down = async (sql) => {
  for (const challenge of challenges) {
    await sql`
      DELETE FROM
        challenges
      WHERE
        label = ${challenge.label}
    `;
  }
};
