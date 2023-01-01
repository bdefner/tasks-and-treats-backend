import { sql } from './connect';

export async function createConnectionRequest(
  userId: number,
  connectionToken: string,
) {
  const [connection] = await sql<Connection[]>`
  INSERT INTO connections
    (user_requested_id, connection_token)
  VALUES
  (${userId}, ${connectionToken})
  RETURNING
    connection_id
  `;
  return connection;
}

export async function acceptConnectionRequest(
  userId: number,
  connectionToken: string,
) {
  const [connection] = await sql<Connection[]>`
  UPDATE
    connections
  SET
    user_received_id=${userId}
  WHERE
  connection_token= ${connectionToken}
  RETURNING
    connection_id
  `;
  return connection;
}

export async function getConnectionsByUserId(userId: number) {
  const connections = await sql<{ id: number }[]>`

  SELECT
    user_requested_id,
    user_received_id
  FROM
    connections
  WHERE
  user_requested_id = ${userId} OR
  user_received_id = ${userId}
  `;

  return connections;
}

export async function getConnectionsByConnectionToken(connectionToken: string) {
  if (!connectionToken) return undefined;

  const [connection] = await sql<{ id: number; username: string }[]>`

  SELECT
    user_requested_id,
    user_received_id
  FROM
    connections
  WHERE
    connection_token = ${connectionToken}
  `;

  return connection;
}
