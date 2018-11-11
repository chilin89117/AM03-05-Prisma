import prisma from '../../src/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const testUser1 = {
  input: {
    name: 'tester1',
    email: 'tester1@example.com',
    password: bcrypt.hashSync('123456')
  },
  returnedUser: undefined,
  jwt: undefined
};

const testUser2 = {
  input: {
    name: 'tester2',
    email: 'tester2@example.com',
    password: bcrypt.hashSync('123456')
  },
  returnedUser: undefined,
  jwt: undefined
};

const postOne = {
  input: {
    title: 'Published Post', 
    body: 'Test body 1', 
    published: true    
  },
  returnedPost: undefined
};

const postTwo = {
  input: {
    title: 'Draft Post', 
    body: 'Test body 2', 
    published: false,
  },
  returnedPost: undefined
};

const commentOne = {
  input: {
    text: "Comment by testUser2 on published post"
  },
  returnedComment: undefined
};

const commentTwo = {
  input: {
    text: "Comment by testUser1 on published post"
  },
  returnedComment: undefined
};

const seedDatabase = async () => {
  jest.setTimeout(9000);
  // Delete all test data
  await prisma.mutation.deleteManyComments();
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  // Create 2 test users and their jwt's
  testUser1.returnedUser = await prisma.mutation.createUser({data: testUser1.input});
  testUser1.jwt = jwt.sign({userId: testUser1.returnedUser.id}, process.env.JWT_SECRET);
  testUser2.returnedUser = await prisma.mutation.createUser({data: testUser2.input});
  testUser2.jwt = jwt.sign({userId: testUser2.returnedUser.id}, process.env.JWT_SECRET);
  
  // Create 2 posts belonging to testUser1
  postOne.returnedPost = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {connect: {id: testUser1.returnedUser.id}}}
  });
  postTwo.returnedPost = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {connect: {id: testUser1.returnedUser.id}}}
  });

  // Create comments
  commentOne.returnedComment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      author: {connect: {id: testUser1.returnedUser.id}},
      post: {connect: {id: postOne.returnedPost.id}}
    }
  });
  commentTwo.returnedComment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      author: {connect: {id: testUser2.returnedUser.id}},
      post: {connect: {id: postOne.returnedPost.id}}
    }
  });
};

export {seedDatabase as default, testUser1, testUser2, postOne, postTwo, commentOne, commentTwo};
