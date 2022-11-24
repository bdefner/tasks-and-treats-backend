/**
 * @jest-environment node
 */

import {
  createUser,
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

  const newUser = await createUser(
    randomUsername,
    'noEmail@geemail.to',
    'XXXXXXX',
  );

  expect(newUser.username).toBe(randomUsername);

  let UpdatedUser = await updateUserById(
    newUser.userId,
    'John Dow',
    newUser.email,
  );

  expect(UpdatedUser).toBe(UpdatedUser);

  UpdatedUser = await updateUserBudgetById(newUser.userId, 100);

  expect(UpdatedUser.budget).toBe(100);
});
