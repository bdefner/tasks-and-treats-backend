import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserWithPasswordHashByUsername } from '../../database/users';

type LoginResponseBody =
  | { errors: { message: string }[] }
  | { user: { username: string; userId: number; userEmail: string } };

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

    console.log('parsedRequestBody: ', parsedRequestBody);

    // Check if the input is correct
    if (
      // typeof request.body.username !== 'string' ||
      // typeof request.body.password !== 'string' ||
      !parsedRequestBody.username ||
      !parsedRequestBody.password
    ) {
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

    // Create session token

    // response of successful request

    response.status(200).json({
      user: {
        username: userByUsername.username,
        userId: userByUsername.userId,
        userEmail: userByUsername.email,
      },
    });
  }
}
