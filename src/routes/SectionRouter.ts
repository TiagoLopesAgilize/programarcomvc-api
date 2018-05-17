const config  = require('../config/config');

import { Router, Request, Response, NextFunction } from 'express';
const AssetsProd = require('../gew2');
import { connect } from 'mongoose';
import passport = require('passport');
import { sign, verify, TokenExpiredError } from 'jsonwebtoken';

import SectionController from '../controllers/SectionController';

const requireAuth = passport.authenticate('jwt', { session: false });  

export class SectionRouter {

  router: Router;
  authRoutes: Router;
  sectionController: SectionController = new SectionController();
  
  constructor() {
    this.router = Router();
    this.init();
  }
  
  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.put('/:id', requireAuth ,this.sectionController.update);
    this.router.get('/:id' , requireAuth ,this.sectionController.getOne);
    this.router.get('/' , requireAuth ,this.sectionController.getAll);
    this.router.post('/', requireAuth, this.sectionController.save);
  }

}

// Create the companyRouter, and export its configured Express.Router
const sectionRouter = new SectionRouter();
sectionRouter.init();

export default sectionRouter.router;