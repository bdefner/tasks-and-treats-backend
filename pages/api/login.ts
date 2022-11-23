import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSession } from '../../database/sessions';
import { getUserWithPasswordHashByUsername } from '../../database/users';
import { createCsrfSecret } from '../../utils/csrf';

type LoginResponseBody =
  | { errors: { message: string }[] }
  | {
      user: {
        username: string;
        userId: number;
        userEmail: string;
        budget: number;
        sessionToken: string;
      };
    };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<LoginResponseBody>,
) {
  // Check for request method
  if (request.method !== 'POST') {
    response.status(401).json({
      errors: [{ message: 'This api endpoint only allows the method POST' }],
    });
  } else {
    // Check if the request body is parsed

    let parsedRequestBody = request.body;

    try {
      parsedRequestBody = JSON.parse(request.body);
    } catch (error) {
      console.log(error);
    }

    // Check if the input is correct
    if (!parsedRequestBody.username || !parsedRequestBody.password) {
      response.status(400).json({
        errors: [
          {
            message: 'username or password not provided!',
          },
        ],
      });
    }

    // Check if the username exists

    const userByUsername = await getUserWithPasswordHashByUsername(
      parsedRequestBody.username,
    );
    if (!userByUsername) {
      response.status(401).json({ errors: [{ message: `User not found!` }] });
      return;
    }

    // Check if the password_hash matches

    const isPasswordValid = await bcrypt.compare(
      parsedRequestBody.password,
      userByUsername.passwordHash,
    );

    if (!isPasswordValid) {
      response
        .status(401)
        .json({ errors: [{ message: 'Could not verify the password' }] });
      return;
    }

    // Create a csrf secret

    const secret = await createCsrfSecret();

    // Create session token
    const session = await createSession(
      userByUsername.userId,
      crypto.randomBytes(80).toString('base64'),
      secret,
    );
    // Response of successful request

    response.status(200).json({
      user: {
        username: userByUsername.username,
        userId: userByUsername.userId,
        userEmail: userByUsername.email,
        budget: userByUsername.budget,
        sessionToken: session.token,
      },
    });
  }
}
