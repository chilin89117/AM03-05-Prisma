import getUserId from '../utils/getUserId';

const Subscription = {
  // Subscribe to new posts with published = true
  post: {
    subscribe(parent, args, {prisma}, info) {
      return prisma.subscription.post(
        {where: {node: {published: true}}},
        info
      );
    }
  },
  // Subscribe to new comments for specific published post
  comment: {
    subscribe(parent, {postId}, {prisma}, info) {
      return prisma.subscription.comment(
        {where: {node: {post: {id: postId}}}},
        info
      );
    }
  },
  myPost: {
    subscribe(parent, args, {prisma, req}, info) {
      const userId = getUserId(req, true);
      return prisma.subscription.post(
        {where: {node: {author: {id: userId}}}},
        info
      );
    }
  }
};

export {Subscription as default};
