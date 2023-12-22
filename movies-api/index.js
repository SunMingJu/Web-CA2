import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usersRouter from './api/users';
import peopleRouter from './api/people';
import reviewsRouter from './api/reviews';
import './db';
import defaultErrHandler from './errHandler';
import moviesRouter from './api/movies';   //import movies router
import session from 'express-session';
import authenticate from './authenticate';

dotenv.config();

const errHandler = (err, req, res, next) => {
  /* if the error in development then send stack trace to display whole error,
  if it's in production then just send error message  */
  if(process.env.NODE_ENV === 'production') {
    return res.status(500).send(`Something went wrong!`);
  }
  res.status(500).send(`Hey!! You caught the error 👍👍. Here's the details: ${err.stack} `);
};

const app = express();

const port = process.env.PORT;

const swaggerJsDoc = require('swagger-jsdoc');

const swaggerUi = require('swagger-ui-express');

const passport = require('passport');


app.use(express.json());

app.use(passport.initialize());

app.use('/api/movies', moviesRouter);

app.use('/api/reviews', reviewsRouter);

app.use('/api/people', peopleRouter);

app.use('/api/users', usersRouter);

app.use(errHandler);

var path = require('path');
const swaggerOpt = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Movies API',
        version: '1.0.0',
        description: 'Web-CA2',
        servers: [
          { 
            url: 'http://localhost:8080',
            description: 'Development server',
          },
        ],
    }
  },
  apis:['./api/movies/index.js',
   './api/genres/index.js',
    './api/people/index.js',
     './api/users/index.js',
      './api/reviews/index.js']
};
const swaggerSpec = swaggerJsDoc(swaggerOpt);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});