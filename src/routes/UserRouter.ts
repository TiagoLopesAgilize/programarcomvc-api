const config  = require('../config/config');

import { Router, Request, Response, NextFunction } from 'express';
const AssetsProd = require('../gew2');
import { connect } from 'mongoose';
import passport = require('passport');
import { sign, verify, TokenExpiredError } from 'jsonwebtoken';

import { User } from '../models/user';
import { UserController } from '../controllers/UserController';

var Project = require('../models/projects');

const requireAuth = passport.authenticate('jwt', { session: false });  
const requireLogin = passport.authenticate('local', { session: false , successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', });  

export class UserRouter {

  router: Router;
  authRoutes: Router;
  userController: UserController = new UserController();
  
  constructor() {
    this.router = Router();
    this.authRoutes = Router();
    this.init();

  }
  
  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {

    // Set auth routes as subgroup/middleware to apiRoutes
    this.router.use('/auth', this.authRoutes);

    // Registration route
    this.authRoutes.post('/register-jwt', this.userController.register);

    //Validate token
    this.authRoutes.get('/validate-token', requireAuth, this.userController.isTokenValid);

    // Login route
    this.router.post('/login', this.userController.login);

    //this.router.get('/', requireAuth, this.userController.getMe);
    this.router.get('/user-save-mock', this.userController.saveMockTest);
      
    this.router.post('/loginPost', this.userController.loginPost);
    
    this.router.get('/profile', this.userController.isLoggedIn, this.userController.profile);

    this.router.post('/signup', this.userController.register);

    this.router.get('/logout', this.userController.logout);

    //this.router.get('/' , requireAuth, this.userController.getAllUsers);
    
    //this.router.get('/:id', requireAuth ,this.userController.getOne);
                       
    //this.router.post('/', requireAuth, this.userController.save);

    this.router.put('/:id', this.userController.update);

    //this.router.delete('/:id', this.userController.delete);

    //this.router.get('/clear', this.userController.clearAllDatabase);

    //this.router.get('/', requireAuth, this.roleAuthorization('Member') , this.getAllUsers);
  }

}

// Create the userRouter, and export its configured Express.Router
const userRouter = new UserRouter();
userRouter.init();

export default this.userRouter.router;