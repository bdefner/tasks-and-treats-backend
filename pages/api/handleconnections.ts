import cryptoRandomString from 'crypto-random-string';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  acceptConnectionRequest,
  createConnectionRequest,
  getConnectionsByConnectionToken,
  getConnectionsByUserId,
} from '../../database/connections';
import {
  getUserBudgetByUserId,
  getUserBySessionToken,
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

    const user = await getUserBySessionToken(parsedRequestBody.sessionToken);

    console.log('user:', user);
    if (!user) {
      response
        .status(401)
        .json({ errors: [{ message: 'Session token not valid' }] });
      return;
    }

    // // Check if userId is associated with the sessionToken

    if (user.userId !== parseInt(parsedRequestBody.userId)) {
      response.status(401).json({
        errors: [
          { message: 'Could not verify the user. Better luck next time!' },
        ],
      });
      return;
    }

    // Check for valid request type

    if (!parsedRequestBody.requestType) {
      response
        .status(401)
        .json({ errors: [{ message: 'requestType not provided' }] });
      return;
    }

    // Successful request: Check for type request

    if (parsedRequestBody.requestType === 'createConnection') {
      const connectionToken = cryptoRandomString({
        length: 10,
        type: 'base64',
      });

      const connection = await createConnectionRequest(
        user.userId,
        connectionToken,
      );

      response.status(200).json(connectionToken);
    }
    if (parsedRequestBody.requestType === 'acceptConnection') {
      if (!parsedRequestBody.connectionToken) {
        response
          .status(401)
          .json({ errors: [{ message: 'connectionToken not provided' }] });
        return;
      }

      // Check if connectionToken is valid

      const testConnection = await getConnectionsByConnectionToken(
        parsedRequestBody.connectionToken,
      );

      if (
        !testConnection ||
        testConnection.userReceivedId ||
        testConnection.userRequestedId === parseInt(parsedRequestBody.userId)
      ) {
        response
          .status(401)
          .json({ errors: [{ message: 'connectionToken invalid' }] });
        return;
      } else {
        const newConnection = await acceptConnectionRequest(
          user.userId,
          parsedRequestBody.connectionToken,
        );
        response.status(200).json(newConnection);
        return;
      }
    }
    if (parsedRequestBody.requestType === 'getConnections') {
      const connections = await getConnectionsByUserId(
        parsedRequestBody.userId,
      );
      console.log('connections in Backend', connections);
      response.status(200).json(connections);
      return;
    }

    if (parsedRequestBody.requestType === 'getConnectionsData') {
      const ArrayOfConnectionUserIds = parsedRequestBody.connections.split(',');
      if (!parsedRequestBody.connections || !parsedRequestBody.connections[0]) {
        response
          .status(401)
          .json({ errors: [{ message: 'no connections sent' }] });
        return;
      }

      // Get name and budget of connections

      // Mapping doesn't work for any reason, so I used a for loop
      // const connectionData = await ArrayOfConnectionUserIds.map(
      //   async (item) => {
      //     await getUserBudgetByUserId(item);
      //   },
      // );

      const connectionData = [];

      for (let i = 0; i < ArrayOfConnectionUserIds.length; i++) {
        connectionData[i] = await getUserBudgetByUserId(
          ArrayOfConnectionUserIds[i],
        );
      }

      response.status(200).json(connectionData);
    }

    response.status(401).json({ errors: [{ message: 'invalid request' }] });
    return;
  }
}
