

import {Router, Request, Response, NextFunction} from 'express';

const AssetsProd = require('../gew3-new');

var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost:27017/programarcomvc'); // connect to our database
var Desconto = require('../models/desconto');

export class DescontoRouter {
  router: Router

  /**
   * 
   * Initialize the ProjectRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }
 
  /**
   * Save all Assets for a mock project.
   */
  public saveMockTest(req: Request, res: Response, next: NextFunction) {

    var desconto = new Desconto({
        "name": "AdicionarInfComplementaresPJIntegrarionService",
        "technology": "OSB Project",
        "environments": [
            {
                "name": "OSB-HML2",
                "assets": [
                    {
                        "name": "AdicionarInfComplementaresPJServiceSoapV1_0",
                        "type": "BusinessService",
                        "protocol": "",
                        "service-type": "",
                        "uri": "",
                        "endpoint-uri": "http://li123/app/v1/pj",
                        "read-timeout": "",
                        "connection-timeout": "",
                        "authentication": "None",
                        "service-account": "",
                        "workmanager": "",
                        "https": "",
                        "grupoLdap": "",
                        "user": "",
                        "password": "",
                        "resultCachingSupport":"",
                        "cacheTokenExpression":"",
                        "cacheExpirationTime":"",
                        "timestamp": "1506448830180"
                    }
                ]
            }
        ]
    }); 

    
    desconto.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'desconto created!' });
    });

  }

  /**
   * GET all Descontos.
   */
  public getAllDescontos(req: Request, res: Response, next: NextFunction) {

      Desconto.find(function(err, descontos) {
        if (err)
            res.send(err);

        res.json(descontos);
    });
  }

    public getAllAssetsJson(req: Request, res: Response, next: NextFunction) {

        AssetsProd.forEach(element => {
            
            var project = new Desconto(element);  
            project.save(function(err) {
             res.json(err);
            });

        });

        res.json(AssetsProd);
 
  }


  // save the desconto with this id
  public save(req: Request, res: Response, next: NextFunction) {
      
    var project = new Desconto(); // create a new instance of the project model
    project.name = req.body.name;
    project.client = req.body.client;
    project.valor = req.body.valor;

    project.desconto = req.body.desconto;

    project.timeStampLastModified = req.body.timeStampLastModified;
    project.uuidUserLastModified = req.body.uuidUserLastModified;
        
    project.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'desconto created! Id = ' +  req.body.id  });
    });
  } 

  // update the project with this id
  public update(req: Request, res: Response, next: NextFunction) {
    Desconto.findById(req.params.id, function(err, project) {

        if (err)
            res.send(err);

        project.name = req.body.name;

        project.technology = req.body.technology;

        project.environments = req.body.enviroments;

        project.timeStampLastModified = req.body.timeStampLastModified;
        project.uuidUserLastModified = req.body.uuidUserLastModified;

        
        console.log('########## UPDATE > Enviroments ######'+JSON.stringify(req.body));

       // console.log('########## UPDATE > Enviroments ######'+req.body.enviroments);

        project.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'project updated!' });
        });

    });
  }

  // delete the project with this id
  public delete(req: Request, res: Response, next: NextFunction) {
    Desconto.remove({
        _id: req.params.id
    }, function(err, project) {
        if (err) {
          console.error(`${req.params.id} error on delete`);
          res.send(err);
        }
        res.json({ message: 'Successfully deleted' });
    });
  } 


    // delete the project with this id
  public clearAllDatabase(req: Request, res: Response, next: NextFunction) {
    Desconto.remove({
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
     
        let lProject = Desconto.find({ "_id": query }).exec(function(err, hero) {

            if (lProject) {

                   console.log(lProject instanceof require('mpromise'));
                 
                    lProject.then(function (doc) {
                        console.log(doc);
                        const projectRet = doc[0];
                        res.status(200)
                            .send({
                                status: res.status,
                                projectRet
                            });
                    });

          
            } else {
                res.status(404)
                    .send({
                        message: 'No project found with the given id. = ' + query,
                        status: res.status
                    });
            }
        })
    }


  /**
   * GET one hero by id
   */
   public  getEndPoints(req, res, next) {
        let query = req.params.idPorjeto;
     
        let hero = Desconto.find({ "endPoints": query }).exec(function(err, hero) {

            if (hero) {
                res.status(200)
                    .send({
                        message: 'Success',
                        status: res.status,
                        hero
                    });
            } else {
                res.status(404)
                    .send({
                        message: 'No project found with the given id. = ' + query,
                        status: res.status
                    });
            }
        })
    }

  public getInfoAssets(req, res, next) {
     /*  
     
                  let query = { name: "SinistroOA.PagamentoSinistroServiceEBS",
                        assets: { $elemMatch: {  "name": "SinistroServiceAccount", 
                                environments: { $elemMatch: {name: 'OSB-TST2' } } 
                        }}
                    };
                ?nameProject=SinistroOA.PagamentoSinistroServiceEBS&nameAsset=SinistroServiceAccount&nameEnviroment=OSB-TST2
                */
      
        let query = { name: req.query.nameProject,
                        environments: { $elemMatch: {  "name": req.query.nameEnviroment, 
                                assets: { $elemMatch: {name: req.query.nameAsset} } 
                        }}
                    };

           console.log('nameProject = '+ req.query.nameProject);
              console.log('nameAsset = '+ req.query.nameAsset);
                 console.log('nameEnviroment = '+ req.query.nameEnviroment);

        let hero = Desconto.find( query ).exec(function(err, hero) {

            if (hero) {
                res.status(200)
                    .send({
                        message: 'Success',
                        status: res.status,
                        hero
                    });
            } else {
                res.status(404)
                    .send({
                        message: 'No project found with the given id. = ' + query,
                        status: res.status
                    });
            }
        })
    }

    getEndPointAsset(req, res, next) {
     /*  
     
                  let query = { name: "SinistroOA.PagamentoSinistroServiceEBS",
                        assets: { $elemMatch: {  "name": "SinistroServiceAccount", 
                                environments: { $elemMatch: {name: 'OSB-TST2' } } 
                        }}
                    };
                ?nameProject=SinistroOA.PagamentoSinistroServiceEBS&nameAsset=SinistroServiceAccount&nameEnviroment=OSB-TST2
                */

        let query = { name: req.params.projeto,
                        environments: { $elemMatch: {  "name": req.params.enviroment, 
                                assets: { $elemMatch: {name: req.params.asset} } 
                        }}
                    };

        let hero = Desconto.find( query, {"environments.$": 1, "environments.assets.endpoint-uri": 1}  ).exec(function(err, hero) {

            if (hero) {
                
                let data = {};
                hero.forEach(element => {
             
                    element.environments.forEach(itemEnv => {
                           itemEnv.assets.forEach(asset => {
                                if(asset.name == req.params.asset){
                                    data = asset;
                                    console.log(data);
                                    return;
                                }
                            });
                    });      
                });
 
                if (data.hasOwnProperty('endpoint-uri')) {
                    data = data['endpoint-uri'];
                }
                
                res.status(200).send(data.toString());

            } else {
                res.status(404)
                    .send({
                        message: 'No project found with the given id. = ' + query,
                        status: res.status
                    });
            }
        })
    }

     getReadTimeOutAsset(req, res, next) {

   let query = { name: req.params.projeto,
                        environments: { $elemMatch: {  "name": req.params.enviroment, 
                                assets: { $elemMatch: {name: req.params.asset} } 
                        }}
                    };

        let hero = Desconto.find( query, {"environments.$": 1, "environments.assets.read-timeout": 1}  ).exec(function(err, hero) {

            if (hero) {
            let data = {};
            hero.forEach(element => {
             
                   element.environments.forEach(itemEnv => {
                           itemEnv.assets.forEach(asset => {
                                if(asset.name == req.params.asset){
                                    data = asset;
                                    console.log(data);
                                    return;
                                }
                            });
                    });      
                });
 
                if (data.hasOwnProperty('read-timeout')) {
                    data = data['read-timeout'];
                }

                res.status(200).send(data.toString());

            } else {
                res.status(404)
                    .send({
                        message: 'No read timeout found with the given id. = ' + query,
                        status: res.status
                    });
            }
        })
    }

    
     getConnectionTimeOutAsset(req, res, next) {

        let query = { name: req.params.projeto,
                        environments: { $elemMatch: {  "name": req.params.enviroment, 
                                assets: { $elemMatch: {name: req.params.asset} } 
                        }}
                    };

        let hero = Desconto.find( query, {"environments.$": 1, "environments.assets.connection-timeout": 1}  ).exec(function(err, hero) {

            if (hero) {
            let data = {};
            hero.forEach(element => {
             
                   element.environments.forEach(itemEnv => {
                           itemEnv.assets.forEach(asset => {
                                if(asset.name == req.params.asset){
                                    data = asset;
                                    console.log(data);
                                    return;
                                }
                            });
                    });        
                });
 
                if (data.hasOwnProperty('connection-timeout')) {
                    data = data['connection-timeout'];
                }

             res.status(200).send(data.toString());

            } else {
                res.status(404)
                    .send({
                        message: 'No connection timeout found with the given params. = ' + query,
                        status: res.status
                    });
            }
        })
    }
  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/projects-sve-mock', this.saveMockTest);

    this.router.get('/', this.getAllDescontos);
 
    this.router.get('/:id', this.getOne);

    this.router.post('/', this.save);

    this.router.put('/:id', this.update);

    this.router.delete('/:id', this.delete);

    this.router.get('/clear', this.clearAllDatabase);
    

  }

}

// Create the DescontoRouter, and export its configured Express.Router
const descontoRouter = new DescontoRouter();
descontoRouter.init();

export default descontoRouter.router;
