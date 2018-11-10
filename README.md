# AM04-05-Prisma

* Run `Docker Quickstart Terminal` to run Docker at `192.168.99.100`
* Run `docker-compose up -d` in project directory `blog` to start Prisma at port `4466`
* Run `$ npm run start` to use GraphQL playground through Node.js at `localhost:4000`
* To use Prisma API playground at `192.168.99.100:4466`:
  * Run `$ prisma token` in the `blog` directory to generate token
  * Use the token in http header `{"Authorization":"Bearer <token>"}`
