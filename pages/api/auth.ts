import { NextApiRequest, NextApiResponse } from 'next';
import { getUserBySessionToken } from '../../database/users';

type AuthResponseBody =
  | { errors: { message: string }[] }
  | { user: { username: string; userId: number; userEmail: string } };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST') {
    response.status(401).json({
      errors: [{ message: 'This api endpoint only allows the method POST' }],
    });
  }

  let parsedRequestBody = request.body;

  try {
    parsedRequestBody = JSON.parse(request.body);
  } catch (error) {
    console.log(error);
  }
  console.log('request.body: ', request.body);

  // Check if the request contains a session token

  console.log('request.body.sessionToken: ', parsedRequestBody.sessionToken);

  if (!parsedRequestBody.sessionToken) {
    response
      .status(400)
      .json({ errors: [{ message: 'No session token passed' }] });
    return;
  }

  const user = await getUserBySessionToken(parsedRequestBody.sessionToken);
  console.log('user: ', user);

  if (!user) {
    response
      .status(400)
      .json({ errors: [{ message: 'Session token not valid' }] });
    return;
  }

  // Response of successful request

  if (user) {
    response.status(200).json({
      user: {
        username: user.username,
        userId: user.userId,
        userEmail: user.email,
      },
    });
  }
}
