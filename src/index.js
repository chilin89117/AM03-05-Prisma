import '@babel/polyfill/noConflict';
import {GraphQLServer, PubSub} from 'graphql-yoga';
import prisma from './prisma';
import {resolvers, fragmentReplacements} from './resolvers/resolvers';

const pubSub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(req) {
    return {pubSub, prisma, req};
  },
  fragmentReplacements
});

server.start({port: process.env.PORT || 4000}, () => console.log('AM04-05-Prisma ...'));
