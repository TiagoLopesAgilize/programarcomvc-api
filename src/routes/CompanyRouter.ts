const config  = require('../config/config');

import { Router, Request, Response, NextFunction } from 'express';
const AssetsProd = require('../gew2');
import { connect } from 'mongoose';
import passport = require('passport');
import { sign, verify, TokenExpiredError } from 'jsonwebtoken';

import { Product } from '../models/Product';
import ProductController  from '../controllers/ProductController';
import CompanyController from '../controllers/CompanyController';

const requireAuth = passport.authenticate('jwt', { session: false });  

export class CompanyRouter {

  router: Router;
  authRoutes: Router;
  companyController: CompanyController = new CompanyController();
  
  constructor() {
    this.router = Router();
    this.init();
  }
  
  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.put('/:id', requireAuth ,this.companyController.update);
    this.router.get('/:id' , requireAuth ,this.companyController.getOne);
    this.router.get('/' , requireAuth ,this.companyController.getAll);
    this.router.post('/', requireAuth, this.companyController.save);
  }

}

// Create the companyRouter, and export its configured Express.Router
const companyRouter = new CompanyRouter();
companyRouter.init();

export default companyRouter.router;