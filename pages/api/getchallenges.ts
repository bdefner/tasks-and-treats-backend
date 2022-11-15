// This endpoint receives a userId and a session token. It returns all challenges from the database.

import { NextApiRequest, NextApiResponse } from 'next';
import { GetAllChallenges } from '../../database/challenges';
import { getUserBySessionToken } from '../../database/users';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  // Check for method

  if (request.method !== 'POST') {
    response.status(401).json({
      errors: [{ message: 'This api endpoint only allows the method POST' }],
    });
  } else {
    // Check if the body is parsed

    let parsedRequestBody = request.body;

    try {
      parsedRequestBody = JSON.parse(request.body);
    } catch (error) {
      console.log(error);
    }

    if (!parsedRequestBody.userId || !parsedRequestBody.sessionToken) {
      response.status(400).json({
        errors: [
          {
            message: 'Bad request: userId or sessionToken not provided!',
          },
        ],
      });
    }

    // Check if the sessionToken is valid

    console.log('parsedRequestBody. ', parsedRequestBody);

    const user = await getUserBySessionToken(parsedRequestBody.sessionToken);

    console.log('user: ', user);
    if (!user) {
      response
        .status(401)
        .json({ errors: [{ message: 'Session token not valid' }] });
      return;
    }

    // Check if userId is associated with the sessionToken

    if (user.userId !== parseInt(parsedRequestBody.userId)) {
      response.status(401).json({
        errors: [
          { message: 'Could not verify the user. Better luck next time!' },
        ],
      });
      return;
    }

    // Get all challenges

    const challenges = await GetAllChallenges();

    // Response of successful request

    response.status(200).json(challenges);
  }
}
