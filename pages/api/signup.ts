import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from '../../database/users';

type RegisterResponseBody =
  | { errors: { message: string }[] }
  | { user: { username: string } };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<RegisterResponseBody>,
) {
  console.log(request.body.username);
  // Check for request method
  if (request.method !== 'POST') {
    response
      .status(401)
      .json({ message: 'This route only allows the method POST' });
  } else {
    // Check if the input is correct

    if (
      // typeof request.body.username !== 'string' ||
      // typeof request.body.password !== 'string' ||
      !request.body.username ||
      !request.body.email ||
      !request.body.password
    ) {
      response.status(400).json({
        message: 'Bad request: username, email or password not provided!',
      });
    }

    // Check if the username already exists

    const userByUsername = await getUserByUsername(request.body.username);
    if (userByUsername) {
      response.status(401).json({ message: `Username is already taken!` });
    }

    // ToDo Check if the email address  is already taken

    // const userByEmail = await getUserByEmail(request.body.email);

    // // if (userByEmail) {
    // //   response
    // //     .status(401)
    // //     .json({ message: 'Email address is already in use!' });
    // // }

    // Hash the password

    const passwordHash = await bcrypt.hash(request.body.password, 12);

    // Create the user

    const userWithoutPasswordHash = await createUser(
      request.body.username,
      request.body.email,
      passwordHash,
    );

    response
      .status(200)
      .json({ user: { username: userWithoutPasswordHash.username } });
  }
}
