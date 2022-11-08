import { sql } from './connect';
import { User } from './users';

type Session = {
  id: number;
  token: string;
  csrfSecret: string;
};

type SessionWithUserId = {
  id: number;
  token: string;
  csrfSecret: string;
  userId: number | null; // note: test tokens do not contain a userId - remove before beta release!
};
export async function createSession(
  userId: User['userId'],
  token: string,
  csrfSecret: string,
) {
  const [session] = await sql<Session[]>`
  INSERT INTO sessions
    (token, user_id, csrf_secret)
  VALUES
    (${token}, ${userId}, ${csrfSecret})
  RETURNING
   id,
   token,
   csrf_secret
  `;

  await deleteExpiredSessions();

  return session!;
}

export async function getValidSessionByToken(token: Session['token']) {
  if (!token) return undefined;

  const [session] = await sql<SessionWithUserId[]>`
  SELECT
    sessions.id,
    sessions.token,
    sessions.csrf_secret,
    sessions.user_id
  FROM
    sessions
  WHERE
    sessions.token = ${token}
  AND
    sessions.expiry_timestamp > now()
  `;

  return session;
}

export async function deleteExpiredSessions() {
  const sessions = await sql<Session[]>`
  DELETE FROM
    sessions
  WHERE
    expiry_timestamp < now()
  RETURNING
    id,
    token,
    csrf_secret
  `;

  return sessions;
}

export async function deleteSessionByToken(token: string) {
  const [session] = await sql<Session[]>`
  DELETE FROM
    sessions
  WHERE
    sessions.token = ${token}
  RETURNING
    id,
    token,
    csrf_secret
  `;

  return session;
}
