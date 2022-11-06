// This endpoint receives a userId and a session token. It checks if the Token matches the one stored for the userId in the database as well for the expiration date. If ok, it returns the users carts

import { NextApiRequest, NextApiResponse } from 'next';
import { getAllCartsByUserId } from '../../database/carts';

export default async function getAllCarts(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  let sessionTokenIsValid = false;

  // Check if the request body is parsed

  let parsedRequestBody = request.body;

  try {
    parsedRequestBody = JSON.parse(request.body);
  } catch (error) {
    console.log(error);
  }

  console.log('parsedRequestBody.userId: ', parsedRequestBody.userId);

  // Check if userId and sessionToken is provided

  console.log('!parsedRequestBody.userId: ', !parsedRequestBody.userId);

  if (!parsedRequestBody.userId) {
    response
      .status(400)
      .json({ errors: [{ message: 'userId or sessionToken not provided' }] });
  }

  // Check for a valid session token

  // ToDo: Check if the session token matches the user and that it's not expired

  sessionTokenIsValid = true;

  if (!sessionTokenIsValid) {
    response
      .status(401)
      .json({ errors: [{ message: 'Invalid sessionToken for userId' }] });
  }

  // Get the carts
  const carts = await getAllCartsByUserId(parsedRequestBody.userId);

  // Respond the carts
  response.status(200).json(carts);
}
