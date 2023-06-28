eslint are aggressive on this app, so we have to uninstall a few dependencies
just to ignore the the errors

`npm uninstall prettier eslint-plugin-prettier eslint-config-prettier`

after creating the file docker-compose.yml that contains all the docker image information to mount, the image version data are in docker hub, always use official images

I run the next command on the terminal

`docker compose up -d`

to create the image, add the folder to the .gitignore file "mongo/"

Copy .env.template and rename it .env to have a reference as the repository won't include my .env


To use environment variables we need to install a dependency

`npm i @nestjs/config`

Mongo .env variable to connect to local mongo compass

MONGO_URI=mongodb://localhost:27017/mean-db

Then configure it like this

ConfigModule.forRoot(),
MongooseModule.forRoot(process.env.MONGO_URI),

inside Module imports, then all the environment variables will be available


Also need to install validators for the Dto s

`npm i class-validator class-transformer`

and configure like this

copy this code

`app.useGlobalPipes( 
 new ValidationPipe({
 whitelist: true,
 forbidNonWhitelisted: true,
 })
);`

inside `main.ts` right above the `await app.listen(3000);` and do the respective imports.


install bcryptjs to hash passwords

`npm i bcryptjs`

also install the following to get the bcryptjs types

`npm i --save-dev @types/bcryptjs`

Install JSon WebToken for authentication

`npm install --save @nestjs/jwt`

created a guard to check authenticating with

`nest g gu auth/guards `

added config cors in main.ts

When deploying the node app on github, 
Fernando said that he prefered to deploy nest applications changing the start config in the package.json

```
    "start": "node dist/main",
    "start:original": "nest start",

```

start:original is it was originally set, the "start" is the modified version