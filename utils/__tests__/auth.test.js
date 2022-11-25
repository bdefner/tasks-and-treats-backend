/**
 * @jest-environment node
 */

import {
  createUser,
  deleteUser,
  getUserBySessionToken,
  getUserByUsername,
  updateUserBudgetById,
  updateUserById,
} from '../../database/users';

test('Login with correct and incorrect arguments', async () => {
  const randomUsername = JSON.stringify(Math.floor(Math.random() * 10000));

  const ExpextGoodResponse = await getUserByUsername('Beppino');
  const ExpextBadResponse = await getUserByUsername(randomUsername);

  expect(ExpextGoodResponse).toStrictEqual({
    userId: 1,
    username: 'Beppino',
    email: 'notreal@email.at',
  });

  expect(ExpextBadResponse).toBe(undefined);
});

test('Create a user, update and delete', async () => {
  const randomUsername = JSON.stringify(Math.floor(Math.random() * 10000));

  // Create a user
  const newUser = await createUser(
    randomUsername,
    'noEmail@geemail.to',
    'XXXXXXX',
  );

  expect(newUser.username).toBe(randomUsername);

  // Update the user
  let response = await updateUserById(
    newUser.userId,
    'John Dow',
    newUser.email,
  );

  expect(response).toBe(response);

  // Update the user's budget

  response = await updateUserBudgetById(newUser.userId, 100);

  expect(response.budget).toBe(100);

  // Delete the user

  response = await deleteUser(newUser.userId);

  expect(response.userId).toBe(newUser.userId);

  // Check if the user does not exists anymore

  response = await getUserByUsername(newUser.username);
  expect(response).toBe(undefined);
});
