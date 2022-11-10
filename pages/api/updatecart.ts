import { NextApiRequest, NextApiResponse } from 'next';
import {
  CreateCart,
  getCartByCartId,
  UpdateCartByCartId,
} from '../../database/carts';
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
      !parsedRequestBody.label ||
      !parsedRequestBody.rating ||
      !parsedRequestBody.statusId ||
      !parsedRequestBody.sessionToken
    ) {
      response.status(400).json({
        errors: [
          {
            message:
              'Bad request: userId, rating, label, statusId or sessionToken not provided!',
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

    // Check if the cart exists

    const currentCart = await getCartByCartId(parsedRequestBody.cartId);

    console.log('currentCart:', currentCart);

    if (!currentCart?.cartId) {
      response.status(404).json({
        errors: [{ message: 'Cart not found!' }],
      });
      return;
    }
    // Update Cart

    const updatedCart = await UpdateCartByCartId(
      parsedRequestBody.cartId,
      parsedRequestBody.label,
      parsedRequestBody.rating,
      parsedRequestBody.statusId,
    );

    console.log('updatedCart: ', updatedCart);

    // Response of successful request

    response.status(200).json({
      cart: { cartId: updatedCart.cartId },
    });
    return;
  }
}
