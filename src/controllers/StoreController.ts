import { Router, Request, Response, NextFunction } from 'express';
const config  = require('../config/config');
const AssetsProd = require('../gew2');
import { connect } from 'mongoose';
import { Store } from '../models/store';
 

export default class StoreController {

    constructor() {}

    public save(req: Request, res: Response, next: NextFunction) {
            const store = new Store(); 
            store.name = req.body.name;
            store.descricao = req.body.descricao;
            store.desconto = req.body.desconto;
            store.valor = req.body.valor;
            store.address = req.body.address; 
            store.image = req.body.image; 
            store.imagemDestaque = req.body.imagemDestaque; 
            store.save(function(err) {
                if (err){
                    res.send(err);
                }    

                res.json({ message: 'store created! Id = ' +  req.body.id  });
            });
    } 

    public update(req: Request, res: Response, next: NextFunction) {
        const store = new Store(); 
        store.findById(req.params.id, function(err, store) {
            if (err)
                res.send(err);

            store.name = req.body.name;
            store.descricao = req.body.descricao;
            store.desconto = req.body.desconto;
            store.valor = req.body.valor;
            store.address = req.body.address; 
            store.image = req.body.image; 
            store.imagemDestaque = req.body.imagemDestaque; 
            store.save(function(err) {
                if (err){
                    res.send(err);
                }
                res.json({ message: 'store updated!' });
            });

        });
    }

    public delete(req: Request, res: Response, next: NextFunction) {
        Store.remove({
            _id: req.params.id
        }, function(err, project) {
            if (err) {
            console.error(`${req.params.id} error on delete`);
            res.send(err);
            }
            res.json({ message: 'Successfully deleted' });
        });
    }

    public getAllStores(req: Request, res: Response, next: NextFunction) {
        Store.find(function(err, stores) {
            if (err)
                res.send(err);

            res.json(stores);
        });
    }

    public validar(req: Request, res: Response, next: NextFunction) {  
        const name = req.body.name;
        const descricao = req.body.descricao;
        const desconto = req.body.desconto;
        const valor = req.body.valor;
        const address = req.body.address; 
        const image = req.body.image; 

        
        if (!descricao) {
            return res.status(422).json({ message: 'Falta o endereço de descricao.'});
        }

        if (!name) {
            return res.status(422).json({ message: 'Falta seu nome.'});
        }

        // Return error if no password provided
        if (!desconto) {
            return res.status(422).json({ message: 'É necessário ter uma desconto' });
        }
       
    }

  /**
   * Save all Assets for a mock store.
   */
    public saveMockTest(req: Request, res: Response, next: NextFunction) {
        /* */
        const store = new Store(
            { 
                "name": "Netflix4",
                "descricao": "Netflix4 é um provedor global de filmes e séries de televisão via streaming, atualmente com mais de 100 milhões de assinantes.",
                "desconto":"10",
                "valor": "450.00",
                "address": 'São Paulo - 2Km',
                "image":"assets/images/logo.jpg"            
            },
        ); 
            
        store.save(function(err) {
            if (err) {
                res.send(err);
            } else {
                res.json({ message: 'store created!' });
            }
        });

    }

    

    // delete the project with this id
    public clearAllDatabase(req: Request, res: Response, next: NextFunction) {
        Store.remove({
        }, function(err, project) {
            if (err) {
            console.error(`${req.params.id} error on clear`);
            res.send(err);
            }
            res.json({ message: 'Successfully clear' });
        });
    } 



  /**
   * GET one hero by id
   */
   public  getOne(req, res, next) {
        let query = req.params.id;
     
        Store.findOne({ "_id": query }).exec(function(err, store) {
            if (store) {
                return res.status(200).json(store);
            } else {
               return res.status(404)
                    .json({ 
                        message: 'Store não encontrado',
                        status: res.status
                    });
            }
        })
    }


}

