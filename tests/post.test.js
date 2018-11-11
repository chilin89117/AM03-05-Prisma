import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import getClient from './utils/getClient';
import seedDatabase, {testUser1, postOne, postTwo} from './utils/seedDatabase';
import {getPosts, myPosts, updatePost, createPost, deletePost, subscribeToPosts} from './utils/postOperations';

const client = getClient();

beforeEach(seedDatabase);

test('====== Should expose published posts ======', async () => {
  const response = await client.query({query: getPosts});
  expect(response.data.posts.length).toBe(1);
  expect(response.data.posts[0].published).toBe(true);
});

test('====== Should fetch both posts for test user ======', async () => {
  const authClient = getClient(testUser1.jwt);
  const {data} = await authClient.query({query: myPosts});
  expect(data.myPosts.length).toBe(2);
});

test('====== Should be able to update own post ======', async () => {
  const authClient = getClient(testUser1.jwt);
  // Unpublish the published post
  const variables = {
    id: postOne.returnedPost.id,
    data: {
      published: false
    }
  };
  const {data} = await authClient.mutate({mutation: updatePost, variables});
  // Check the database in addition to checking the response
  const postExists = await prisma.exists.Post({id: postOne.returnedPost.id, published: false});
  expect(data.updatePost.published).toBe(false);
  expect(postExists).toBe(true);
});

test('====== Should be able to create post ======', async () => {
  const authClient = getClient(testUser1.jwt);
  const variables = {
    data: {
      title: 'Title',
      body: 'Body',
      published: true,
    }
  };
  const {data} = await authClient.mutate({mutation: createPost, variables});
  const postExists = await prisma.exists.Post({id: data.createPost.id});
  expect(data.createPost.title).toBe(variables.data.title);
  expect(data.createPost.body).toBe(variables.data.body);
  expect(data.createPost.published).toBe(variables.data.published);
  expect(postExists).toBe(true);
});

test('====== Should be able to delete post ======', async () => {
  const authClient = getClient(testUser1.jwt);
  const variables = {
    id: postTwo.returnedPost.id
  };
  const {data} = await authClient.mutate({mutation: deletePost, variables});
  const postExists = await prisma.exists.Post({id: postTwo.returnedPost.id});
  expect(data.deletePost.id).toBe(postTwo.returnedPost.id);
  expect(postExists).toBe(false);
});

// Use done() to end test case, otherwise test case ends before being notified to execute next()
test('====== Should subscribe to posts ======', async (done) => {
  client.subscribe({query: subscribeToPosts})
        .subscribe({next(response) {
          expect(response.data.post.mutation).toBe('DELETED');
          done();
        }});

  // Delete a post to trigger next() function
  await prisma.mutation.deletePost({where: {id: postOne.returnedPost.id}});
});
