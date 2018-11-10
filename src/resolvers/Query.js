import getUserId from '../utils/getUserId';

const Query = {
  me(parent, args, {prisma, req}, info) {
    const userId = getUserId(req, true);
    return prisma.query.user({where: {id: userId}});
  },
  users(parent, args, {prisma}, info) {
    const opArgs = {
      first: args.first, 
      skip: args.skip, 
      after: args.after,
      orderBy: args.orderBy
    };
    if(args.query) opArgs.where = {name_contains: args.query};
    return prisma.query.users(opArgs, info);
  },
  posts(parent, args, {prisma}, info) {
    const opArgs = {
      first: args.first, 
      skip: args.skip, 
      after: args.after,
      orderBy: args.orderBy,
      where: {published: true}};
    if(args.query) {
      opArgs.where.OR = [
        {title_contains: args.query},
        {body_contains: args.query},
      ];
    }
    return prisma.query.posts(opArgs, info);
  },
  myPosts(parent, args, {prisma, req}, info) {
    const userId = getUserId(req, true);
    const opArgs = {
      first: args.first, 
      skip: args.skip, 
      after: args.after,
      orderBy: args.orderBy,
      where: {author: {id: userId}}};
    if(args.query) {
      opArgs.where.OR = [
        {title_contains: args.query},
        {body_contains: args.query},
      ];
    }
    return prisma.query.posts(opArgs, info);
  },
  async post(parent, {id}, {prisma, req}, info) {
    // Get userId as string or null
    const userId = getUserId(req, false);
    // If there is userId, return all of user's posts
    // If no userId, return only published posts
    const posts = await prisma.query.posts(
      {where: {id, OR: [{published: true}, {author: {id: userId}}]}},
      info);
    if(posts.length === 0) throw new Error('Post not found.');
    return posts[0];
  },
  comments(parent, args, {prisma}, info) {
    const opArgs = {
      first: args.first, 
      skip: args.skip, 
      after: args.after,
      orderBy: args.orderBy
    };
    return prisma.query.comments(opArgs, info);
  }
};

export {Query as default};
