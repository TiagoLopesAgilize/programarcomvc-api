const config  = require('../config/config');

import { Router, Request, Response, NextFunction } from 'express';
const AssetsProd = require('../gew2');
import { connect } from 'mongoose';
import passport = require('passport');
import { sign, verify, TokenExpiredError } from 'jsonwebtoken';

import { Product } from '../models/Product';
import ProductController  from '../controllers/ProductController';


const requireAuth = passport.authenticate('jwt', { session: false });  

export class ProductRouter {

  router: Router;
  authRoutes: Router;
  productController: ProductController = new ProductController();
  
  constructor() {
    this.router = Router();
    this.init();
  }
  
  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {

    this.router.get('/product-save-mock', this.productController.saveMockTest);
    
    this.router.post('/', requireAuth, this.productController.save);
      
    this.router.put('/:id', requireAuth ,this.productController.update);
    
    this.router.get('/' , requireAuth ,this.productController.getAllProducts);
    
    this.router.get('/:id', requireAuth ,this.productController.getOne);
                       
    this.router.delete('/:id', requireAuth, this.productController.delete);

    this.router.get('/clear', requireAuth,this.productController.clearAllDatabase);

  }

}

// Create the productRouter, and export its configured Express.Router
const productRouter = new ProductRouter();
productRouter.init();

export default productRouter.router;