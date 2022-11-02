import { NextApiRequest, NextApiResponse } from 'next';

export default function getAllCarts(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') {
    response
      .status(405)
      .json({ message: 'This route only allows the method GET' });
  }
  response.json({ hello: 'world', method: request.method });
}
