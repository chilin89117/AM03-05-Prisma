import getUserId from '../utils/getUserId';

const User = {
  email: {
    // Fragment definition
    fragment: 'fragment userId on User {id}',
    // Show email only for logged in user
    resolve(parent, args, {req}, info) {
      const userId = getUserId(req, false);
      if(userId && userId === parent.id) return parent.email;
      else return null;
    }
  },
  posts: {
    fragment: 'fragment userId on User {id}',
    // Show only published posts
    resolve(parent, args, {prisma}, info) {
      return prisma.query.posts({where: {author: {id: parent.id}, published: true}});
    }
  },
  password(parent, args, ctx, info) {
    return "";
  }
};

export {User as default};
