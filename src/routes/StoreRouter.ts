const config  = require('../config/config');

import { Router, Request, Response, NextFunction } from 'express';
const AssetsProd = require('../gew2');
import { connect } from 'mongoose';
import passport = require('passport');
import { sign, verify, TokenExpiredError } from 'jsonwebtoken';

import { Store } from '../models/store';
import StoreController  from '../controllers/StoreController';


const requireAuth = passport.authenticate('jwt', { session: false });  

export class StoreRouter {

  router: Router;
  authRoutes: Router;
  storeController: StoreController = new StoreController();
  
  constructor() {
    this.router = Router();
    this.init();

  }
  
  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {

    this.router.get('/store-save-mock', this.storeController.saveMockTest);
    
    this.router.post('/nova-loja', requireAuth, this.storeController.save);
      
    this.router.put('/modificar-loja/:id', requireAuth ,this.storeController.update);
    
    this.router.get('/' , requireAuth ,this.storeController.getAllStores);
    
    this.router.get('/obter-loja/:id', requireAuth ,this.storeController.getOne);
                       
    this.router.delete('/:id', requireAuth, this.storeController.delete);

    this.router.get('/clear', requireAuth,this.storeController.clearAllDatabase);

  }

}

// Create the storeRouter, and export its configured Express.Router
const storeRouter = new StoreRouter();
storeRouter.init();

export default this.storeRouter.router;