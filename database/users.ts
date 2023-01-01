import { sql } from './connect';

export type User = {
  userId: number;
  username: string;
  email: string;
  passwordHash: string;
  budget: number;
};

export type UserWithoutPasswordHash = {
  userId: number;
  username: string;
  email: string;
};

export async function getUserBudgetByUserId(userId: string) {
  if (!userId) return undefined;

  const [user] = await sql<UserWithoutPasswordHash[]>`
  SELECT
    user_id,
    username,
    budget
  FROM
    users
  WHERE
    users.user_id = ${parseInt(userId)}
  `;

  return user;
}

export async function getUserByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<UserWithoutPasswordHash[]>`
  SELECT
    user_id,
    username,
    email,
    invite_token
  FROM
    users
  WHERE
    users.username = ${username}
  `;

  return user;
}

// For Login only

export async function getUserWithPasswordHashByUsername(username: string) {
  const [user] = await sql<User[]>`
  SELECT
   *
  FROM
    users
  WHERE
    users.username = ${username}
  `;

  return user;
}

export async function createUser(
  username: string,
  email: string,
  passwordHash: string,
  budget: number,
  inviteToken: string,
) {
  const [userWithoutPasswordHash] = await sql<UserWithoutPasswordHash[]>`
  INSERT INTO users
    (username, email, password_hash, budget, invite_token)
  VALUES
  (${username}, ${email}, ${passwordHash}, 0, ${inviteToken})
  RETURNING
    user_id,
    username,
    email,
    budget,
    invite_token
  `;

  // return the user without the password_hash!
  return userWithoutPasswordHash;
}

export async function getUserBySessionToken(token: string) {
  if (!token) return undefined;

  const [user] = await sql<{ id: number; username: string }[]>`

  SELECT
    users.user_id,
    users.username,
    users.email,
    users.budget,
    users.invite_token
  FROM
    users,
    sessions
  WHERE
    sessions.token = ${token} AND
    sessions.user_id = users.user_id;
    -- AND
    -- sessions.expiry_timestamp > now();
  `;

  return user;
}

export async function updateUserByInviteToken(InviteToken: string) {
  const [user] = await sql<User[]>`
  UPDATE
    users
  SET
    budget= budget +10
  WHERE
    invite_token = ${InviteToken}
  RETURNING
    username
  `;
  return user;
}

export async function updateUserBudgetById(userId: number, budget: number) {
  const [user] = await sql<User[]>`
  UPDATE
    users
  SET
    budget=${budget}
  WHERE
    user_id = ${userId}
  RETURNING
    user_id,
    budget
  `;
  return user;
}

export async function updateUserById(
  userId: number,
  username: string,
  userEmail: string,
) {
  const [user] = await sql<User[]>`
  UPDATE
  users
SET
  username= ${username},
  email= ${userEmail}
WHERE
  user_id = ${userId}
RETURNING
  user_id,
  username,
  email
`;
  return user;
}

export async function deleteUser(userId: number) {
  const [user] = await sql<User[]>`
  DELETE FROM
    users
  WHERE
    user_id = ${userId}
  RETURNING
    user_id`;
  return user;
}
