const config  = require('../config/config');

import { Router, Request, Response, NextFunction } from 'express';
const AssetsProd = require('../gew2');
import { connect } from 'mongoose';
import passport = require('passport');
import { sign, verify, TokenExpiredError } from 'jsonwebtoken';

import { Fechamento } from '../models/fechamento';
import FechamentoController  from '../controllers/FechamentoController';


const requireAuth = passport.authenticate('jwt', { session: false });  

export class FechamentoRouter {

  router: Router;
  authRoutes: Router;
  fechamentoController: FechamentoController = new FechamentoController();
  
  constructor() {
    this.router = Router();
    this.init();
  }
  
  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.post('/', requireAuth, this.fechamentoController.save.bind(this.fechamentoController));
    this.router.put('/', requireAuth, this.fechamentoController.fecharCaixa);
    this.router.get('/' , requireAuth ,this.fechamentoController.getAllFechamentos);
    this.router.get('/contas' , requireAuth ,this.fechamentoController.getContasFechadas);
    this.router.get('/:id', requireAuth ,this.fechamentoController.getOne);
    this.router.delete('/:id', requireAuth ,this.fechamentoController.delete);
    this.router.get('/all/abertos' , requireAuth ,this.fechamentoController.getFechamentosAberto);
  }

}

const fechamentoRouter = new FechamentoRouter();
fechamentoRouter.init();

export default fechamentoRouter.router;