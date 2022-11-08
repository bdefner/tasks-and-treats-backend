import { NextApiRequest, NextApiResponse } from 'next';
import {
  deleteSessionByToken,
  getValidSessionByToken,
} from '../../database/sessions';

type LogoutResponseBody =
  | { errors: { message: string }[] }
  | { success: string };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<LogoutResponseBody>,
) {
  // Check if the request body is parsed

  let parsedRequestBody = request.body;

  try {
    parsedRequestBody = JSON.parse(request.body);
  } catch (error) {
    console.log(error);
  }
  console.log('request.body.sessionToken ', parsedRequestBody.sessionToken);

  // Check if the method is POST

  if (request.method !== 'POST') {
    response.status(401).json({
      errors: [{ message: 'This api endpoint only allows the method POST' }],
    });
  }

  // Check if the request body contains a sessionToken key

  if (!parsedRequestBody.sessionToken || !parsedRequestBody.userId) {
    response
      .status(400)
      .json({ errors: [{ message: 'session token or userId not provided' }] });
    return;
  }

  // Validate the sent token

  const confirmedToken = await getValidSessionByToken(
    parsedRequestBody.sessionToken,
  );

  // Check if the session token exists

  if (!confirmedToken) {
    response
      .status(400)
      .json({ errors: [{ message: 'session token is not valid' }] });
    return;
  }

  console.log('confirmedToken.userId: ', confirmedToken.userId);
  console.log('parsedRequestBody.userId: ', parsedRequestBody.userId);
  // Security check: The parsedRequestBody.UserId = userId associated with the Token

  if (confirmedToken.userId !== parseInt(parsedRequestBody.userId)) {
    response
      .status(400)
      .json({ errors: [{ message: 'userId could not be verified' }] });
    return;
  }

  // Remove session token from database

  const databaseResponse = await deleteSessionByToken(
    parsedRequestBody.sessionToken,
  );

  // Response of successful request

  response.status(200).json({
    success: `Session token deleted: ${JSON.stringify(
      databaseResponse?.token,
    )}`,
  });
}
