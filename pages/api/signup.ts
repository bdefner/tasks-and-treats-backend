import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSession } from '../../database/sessions';
import { createUser, getUserByUsername } from '../../database/users';
import { createCsrfSecret } from '../../utils/csrf';

type SignupResponseBody =
  | { errors: { message: string }[] }
  | { user: { userId: number; username: string; sessionToken: string } };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<SignupResponseBody>,
) {
  // Check for request method
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
    // Check if the input is correct

    if (
      !parsedRequestBody.username ||
      !parsedRequestBody.email ||
      !parsedRequestBody.password
    ) {
      response.status(400).json({
        errors: [
          {
            message: 'Bad request: username, email or password not provided!',
          },
        ],
      });
    }

    // Check if the username already exists

    const userByUsername = await getUserByUsername(request.body.username);
    if (userByUsername) {
      response
        .status(401)
        .json({ errors: [{ message: `Username is already taken!` }] });
    }

    // Hash the password

    const passwordHash = await bcrypt.hash(request.body.password, 12);

    // Create the user

    const userWithoutPasswordHash = await createUser(
      parsedRequestBody.username,
      parsedRequestBody.email,
      passwordHash,
    );

    if (!userWithoutPasswordHash) {
      response.status(401).json({
        errors: [
          {
            message:
              'User registration failed for an unhandled reason. Sorry for that! Please try again.',
          },
        ],
      });
    } else {
      // Create a csrf secret

      const secret = await createCsrfSecret();

      // Create a session token

      const session = await createSession(
        userWithoutPasswordHash.userId,
        crypto.randomBytes(80).toString('base64'),
        secret,
      );

      response.status(200).json({
        user: {
          userId: userWithoutPasswordHash.userId,
          username: userWithoutPasswordHash.username,
          sessionToken: session.token,
        },
      });
    }
  }
}
