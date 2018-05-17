import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as  cors from 'cors';

import ProjectRouter from './routes/ProjectRouter';
import UserRouter from './routes/UserRouter';
import StoreRouter from './routes/StoreRouter';
import AlunosRouter from './routes/AlunosRouter';

import * as passportLocal from "passport-local";
import passport = require('passport');
import session = require('express-session');
const config  = require('./config/config');

// passport strategies setup
require('./config/passport').setupStrategies(passport);

class App {

  // ref to Express instance
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
        // passport setup
    this.express.use(session({
        secret: config.secretKey,
        saveUninitialized: true,
        resave: true
    }));

    this.express.use(passport.initialize());
    //this.express.use(passport.session()); // persistent login sessions

    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authentication, Authorization");
        next();
    });
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    router.get('/', (req, res, next) => {
      res.json({
        message: 'API programar com vc!'
      });
    });

    this.express.use('/', router);
    this.express.use('/api/v1/soa', ProjectRouter);
    this.express.use('/users', UserRouter);
    this.express.use('/lojas', StoreRouter);
    this.express.use('/aluno', AlunosRouter);
    }

}

export default new App().express;