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

export async function getUserByUsername(username: string) {
  if (!username) return undefined;

  const [user] = await sql<UserWithoutPasswordHash[]>`
  SELECT
    user_id,
    username,
    email
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
) {
  const [userWithoutPasswordHash] = await sql<UserWithoutPasswordHash[]>`
  INSERT INTO users
    (username, email, password_hash)
  VALUES
  (${username}, ${email}, ${passwordHash} )
  RETURNING
    user_id,
    username,
    email,
    budget
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
    users.budget
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
