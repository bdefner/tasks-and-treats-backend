import { NextApiRequest, NextApiResponse } from 'next';
import {
  getUserBySessionToken,
  updateUserBudgetById,
  updateUserById,
} from '../../database/users';

type SignupResponseBody =
  | { errors: { message: string }[] }
  | { user: { userId: number } };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<SignupResponseBody>,
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

    console.log('user.userId ', user.userId);
    console.log(
      'parseInt(parsedRequestBody.userId: ',
      parseInt(parsedRequestBody.userId),
    );

    if (user.userId !== parseInt(parsedRequestBody.userId)) {
      response.status(401).json({
        errors: [
          { message: 'Could not verify the user. Better luck next time!' },
        ],
      });
      return;
    }

    // If the request body contains a budget, update only the budget

    if (parsedRequestBody.budget) {
      const newUserBudget = await updateUserBudgetById(
        parsedRequestBody.userId,
        parsedRequestBody.budget,
      );

      response.status(200).json({
        user: { userId: newUserBudget.userId },
      });
      return;
    }

    // If the request body does not contain a budget, update the general user information

    // ToDo: Modify to allow a password change

    if (
      !parsedRequestBody.budget &&
      parsedRequestBody.username &&
      parsedRequestBody.email
    ) {
      const updatedUser = await updateUserById(
        parsedRequestBody.userId,
        parsedRequestBody.username,
        parsedRequestBody.email,
      );

      response.status(200).json({
        user: { userId: updatedUser.userId },
      });
      return;
    }

    response.status(401).json({
      errors: [
        {
          message:
            'Invalid combination of parameters: The request body can not be processed. ',
        },
      ],
    });
    return;
  }
}
