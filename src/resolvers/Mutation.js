import bcrypt from 'bcryptjs';
import getHashPwd from '../utils/getHashPwd';
import getToken from '../utils/getToken';
import getUserId from '../utils/getUserId';

const Mutation = {
  async createUser(parent, {data}, {prisma}, info) {
    // Prisma can handle errors, but this allows custom error messages
    const emailTaken = await prisma.exists.User({email: data.email});
    if(emailTaken) throw new Error('Email taken.');
    const hash = await getHashPwd(data.password);
    // Do not use 'info' when returning custom types
    const user = await prisma.mutation.createUser({data: {...data, password: hash}});
    return {user, token: getToken(user.id)};
  },
  deleteUser(parent, args, {prisma, req}, info) {
    // No need to delete user's posts/comments because it's already configured with @relation
    const userId = getUserId(req);
    return prisma.mutation.deleteUser({where: {id: userId}}, info);
  },
  async updateUser(parent, {data}, {prisma, req}, info) {
    const userId = getUserId(req);
    if(typeof data.password === 'string') data.password = await getHashPwd(data.password);
    return prisma.mutation.updateUser({where: {id: userId}, data}, info);
  },
  createPost(parent, {data}, {prisma, req}, info) {
    const userId = getUserId(req);
    return prisma.mutation.createPost({data: {
      title: data.title,
      body: data.body,
      published: data.published,
      author: {connect: {id: userId}}
    }}, info);
  },
  async deletePost(parent, {id}, {prisma, req}, info) {
    const userId = getUserId(req);
    const postExists = await prisma.exists.Post({id, author: {id: userId}});
    if(!postExists) throw new Error('Unable to delete post.');
    return prisma.mutation.deletePost({where: {id}}, info);
  },
  async updatePost(parent, {id, data}, {prisma, req}, info) {
    const userId = getUserId(req);
    const postExists = await prisma.exists.Post({id, author: {id: userId}});
    if(!postExists) throw new Error('Unable to update post.');
    const isPpublished = await prisma.exists.Post({id, published: true});
    if(isPpublished && !data.published) await prisma.mutation.deleteManyComments({where: {post: {id}}});
    return prisma.mutation.updatePost({where: {id}, data}, info);
  },
  async createComment(parent, {data}, {prisma, req}, info) {
    const userId = getUserId(req);
    const postExists = await prisma.exists.Post({id: data.post, published: true});
    if(!postExists) throw new Error('Unable to create comment.');
    return prisma.mutation.createComment({data: {
      text: data.text,
      author: {connect: {id: userId}},
      post: {connect: {id: data.post}}
    }}, info);
  },
  async deleteComment(parent, {id}, {prisma, req}, info) {
    const userId = getUserId(req);
    const commentExists = await prisma.exists.Comment({id, author: {id: userId}});
    if(!commentExists) throw new Error('Unable to delete comment.');
    return prisma.mutation.deleteComment({where: {id}}, info);
  },
  async updateComment(parent, {id, data}, {prisma, req}, info) {
    const userId = getUserId(req);
    const commentExists = await prisma.exists.Comment({id, author: {id: userId}});
    if(!commentExists) throw new Error('Unable to update comment.');
    return prisma.mutation.updateComment({where: {id}, data}, info);
  },
  async login(parent, {data}, {prisma}, info) {
    const user = await prisma.query.user({where: {email: data.email}});
    if(!user) throw new Error('Invalid credentials.');
    const isMatch = await bcrypt.compare(data.password, user.password);
    if(!isMatch) throw new Error('Invalid credentials.');
    return {user, token: getToken(user.id)};
  }
};

export {Mutation as default};
