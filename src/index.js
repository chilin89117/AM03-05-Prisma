import '@babel/polyfill/noConflict';
import server from './server';

server.start({port: process.env.PORT || 4000}, () => console.log('AM04-05-Prisma ...'));
