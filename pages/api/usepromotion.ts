import { NextApiRequest, NextApiResponse } from 'next';
import {
  getUserBySessionToken,
  updateUserByInviteToken,
  User,
} from '../../database/users';

type AuthResponseBody =
  | { errors: { message: string }[] }
  | {
      user: {
        username: string;
      };
    };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<AuthResponseBody>,
) {
  if (request.method !== 'POST') {
    response.status(401).json({
      errors: [{ message: 'This api endpoint only allows the method POST' }],
    });
  }

  // Check if the request body is parsed

  let parsedRequestBody = request.body;

  try {
    parsedRequestBody = JSON.parse(request.body);
  } catch (error) {
    console.log(error);
  }

  // Check if the request contains a session token

  if (!parsedRequestBody.sessionToken) {
    response
      .status(400)
      .json({ errors: [{ message: 'No session token passed' }] });
    return;
  }

  const user = await getUserBySessionToken(parsedRequestBody.sessionToken);

  if (!user) {
    response
      .status(400)
      .json({ errors: [{ message: 'Session token not valid' }] });
    return;
  }

  // Check if the request body contains an inviteToken

  if (!parsedRequestBody.inviteToken) {
    response
      .status(400)
      .json({ errors: [{ message: 'inviteToken is missing' }] });
  }

  // Try to update budget on user of inviteToken

  const userOfInviteToken = await updateUserByInviteToken(
    parsedRequestBody.inviteToken,
  );

  // if (!userOfInviteToken.user) {
  //   response.status(400).json({ errors: [{ message: 'invalid inviteToken' }] });
  // }

  // Response of successful request

  response.status(200).json({ user: { username: userOfInviteToken.username } });
}
