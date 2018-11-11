# AM04-05-Prisma
## Before Section 8
* Run `Docker Quickstart Terminal` to run Docker at `192.168.99.100`
* Run `docker-compose up -d` in project directory `blog` to start Prisma at port `4466`
* Run `$ npm run start` to use GraphQL playground through Node.js at `localhost:4000`
* To use Prisma API playground at `192.168.99.100:4466`:
  * Run `$ prisma token` in the `blog` directory to generate token
  * Use the token in http header `{"Authorization":"Bearer <token>"}`
## Section 8 and Beyond
### Development Mode
* Run `prisma deploy -e ../config/dev.env` in `blog` directory (if changes have been made)
* Run `npm run dev` for playground at `localhost:4000`
### Production Mode
* Run `prisma deploy -e ../config/prod.env` in `blog` directory (if changes have been made)
* Go to playground at `am04-08.herokuapp.com`
