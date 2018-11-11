import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import getClient from './utils/getClient';
import seedDatabase, {testUser1} from './utils/seedDatabase';
import {createUser, getUsers, login, getProfile} from './utils/userOperations';

const client = getClient();

beforeEach(seedDatabase);

test('====== Should create a new user ======', async () => {
  const variables = {
    data: {
      name: 'Kate',
      email: 'kate@example.com',
      password: '123456'
    }
  };
  const response = await client.mutate({mutation: createUser, variables});
  const userExists = await prisma.exists.User({id: response.data.createUser.user.id});
  expect(userExists).toBe(true);
});

test('====== Should expose public user profiles ======', async () => {
  const response = await client.query({query: getUsers});
  expect(response.data.users.length).toBe(2);
  expect(response.data.users[0].email).toBe(null);  // 'null' because not logged in
  expect(response.data.users[0].name).toMatch(/^tester/);
});

test('====== Should not login with bad credentials ======', async () => {
  const variables = {
    email: 'bad@bad.com',
    password: '1234567'
  };
  await expect(client.mutate({mutation: login, variables})).rejects.toThrow();
});

test('====== Should not signup with short password ======', async () => {
  const variables = {
    data: {
      name: 'Shortie',
      email: 'shortie@example.com',
      password: 'abc'
    }
  };
  await expect(client.mutate({mutation: createUser, variables})).rejects.toThrow();
});

test('====== Should fetch user profile ======', async () => {
  // Use client with auth token
  const authClient = getClient(testUser1.jwt);
  const {data} = await authClient.query({query: getProfile});
  // Selected id should be the test user's id
  expect(data.me.id).toBe(testUser1.returnedUser.id);
  expect(data.me.name).toBe(testUser1.returnedUser.name);
  expect(data.me.email).toBe(testUser1.returnedUser.email);
});
