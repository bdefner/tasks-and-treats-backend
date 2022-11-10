import { NextApiRequest, NextApiResponse } from 'next';
import { CreateCart, DeleteCartByCartId } from '../../database/carts';
import { getUserBySessionToken } from '../../database/users';

type SignupResponseBody =
  | { errors: { message: string }[] }
  | { cart: { cartId: number } };

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<SignupResponseBody>,
) {
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
      !parsedRequestBody.sessionToken ||
      !parsedRequestBody.userId ||
      !parsedRequestBody.cartId
    ) {
      response.status(400).json({
        errors: [
          {
            message:
              'Bad request: userId, sessionToken or cartId not provided!',
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

    // Delete cart

    const deletedCart = await DeleteCartByCartId(parsedRequestBody.cartId);

    console.log('deletedCart:', deletedCart);

    // Response of successful request

    response.status(200).json({
      cart: { cartId: deletedCart?.cartId },
    });
  }
}
