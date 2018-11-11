import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import getClient from './utils/getClient';
import seedDatabase, {testUser1, postOne, commentOne, commentTwo} from './utils/seedDatabase';
import {deleteComment, subscribeToComments} from './utils/commentOperations';

const client = getClient();

beforeEach(seedDatabase);

test('====== Should delete own comment ======', async () => {
  const authClient = getClient(testUser1.jwt);
  const variables = {
    id: commentOne.returnedComment.id
  };
  const {data} = await authClient.mutate({mutation: deleteComment, variables});
  const commentExists = await prisma.exists.Comment({id: commentOne.returnedComment.id});3
  expect(data.deleteComment.id).toBe(commentOne.returnedComment.id);
  expect(commentExists).toBe(false);
});

test('====== Should not delete other user\'s comment ======', async () => {
  const authClient = getClient(testUser1.jwt);
  const variables = {
    id: commentTwo.returnedComment.id
  };
  await expect(authClient.mutate({mutation: deleteComment, variables})).rejects.toThrow();
  const commentExists = await prisma.exists.Comment({id: commentTwo.returnedComment.id});
  expect(commentExists).toBe(true);
});

// Use done() to end test case, otherwise test case ends before being notified to execute next()
test('====== Should subscribe to comments for a post ======', async (done) => {
  const variables = {
    postId: postOne.returnedPost.id
  };
  client.subscribe({query: subscribeToComments, variables})
        .subscribe({next(response) {
          expect(response.data.comment.mutation).toBe('DELETED');
          done();
        }});

  // Delete a comment to trigger next() function
  await prisma.mutation.deleteComment({where: {id: commentOne.returnedComment.id}});
});
