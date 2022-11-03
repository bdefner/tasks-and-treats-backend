import { sql } from './connect';

export type User = {
  userId: number;
  username: string;
  email: string;
  passwordHash: string;
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
    email
  `;

  // return the user without the password_hash!
  return userWithoutPasswordHash;
}
