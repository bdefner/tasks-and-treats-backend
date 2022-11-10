import { NextApiRequest, NextApiResponse } from 'next';
import { CreateCart } from '../../database/carts';
import { getUserBySessionToken } from '../../database/users';

type SignupResponseBody =
  | { errors: { message: string }[] }
  | { cart: { cartId: number } };

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

    if (
      !parsedRequestBody.userId ||
      !parsedRequestBody.timeOfCreation ||
      !parsedRequestBody.typeId ||
      !parsedRequestBody.label ||
      !parsedRequestBody.rating ||
      !parsedRequestBody.statusId ||
      !parsedRequestBody.sessionToken
    ) {
      response.status(400).json({
        errors: [
          {
            message:
              'Bad request: userId, timeOfCreation, typeId, rating, label, statusId or sessionToken not provided!',
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

    // Create cart

    const newCart = await CreateCart(
      parsedRequestBody.userId,
      parsedRequestBody.timeOfCreation,
      parsedRequestBody.typeId,
      parsedRequestBody.label,
      parsedRequestBody.rating,
      parsedRequestBody.dueDate,
      parsedRequestBody.statusId,
      parsedRequestBody.assignedToUserId,
      parsedRequestBody.receivedFromUserId,
      parsedRequestBody.groupId,
    );

    console.log('newCart: ', newCart);
    const cart = { cartId: newCart.cartId };

    // Response of successful request

    response.status(200).json({
      cart: { cartId: cart.cartId },
    });
  }
}
