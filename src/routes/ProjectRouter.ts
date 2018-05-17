import {Router, Request, Response, NextFunction} from 'express';
const AssetsProd = require('../gew3-new');

var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost:27017/programarcomvc'); // connect to our database
var Project = require('../models/projects');

export class ProjectRouter {
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

   /* var project = new Project({ // Projeto do OSB
    "name": "SinistroOA.PagamentoSinistroServiceEBS",
    "assets": [{ // Asset / Componente
            "name": "PagamentoBusinessService",
            "type": "Business Service",
            "environments": [{
                    "name": "OSB-TST2",
                    "endpoint-uri": "https://wastst2innovare.portoseguro.brasil/sinistroprocessoWS/PagamentoSinistroWebService_v1_0ImplService-TST2",
                    "read-timeout": 5,
                    "connection-timeout": 1,
                    "authentication": "basic",
                    "service-account": "MyServiceAccount",
                    "work-manager": "SBDefaultResponseWorkManager",
                    "timestamp": 1459361875337
                },
                {
                    "name": "OSB-HML2",
                    "endpoint-uri": "https://washml2innovare.portoseguro.brasil/sinistroprocessoWS/PagamentoSinistroWebService_v1_0ImplService-HML2",
                    "read-timeout": 30,
                    "connection-timeout": 10,
                    "authentication": "basic",
                    "service-account": "MyServiceAccount",
                    "work-manager": "SBDefaultResponseWorkManager",
                    "timestamp": 1459361875337
                }
            ],
            "timestamp": 1459361875337
        },
        {
            "name": "PagamentoSinistroServiceEBSV1_0",
            "type": "Proxy Service",
            "protocol": "http",
            "service-type": "SOAP",
            "uri": "/SinistroOA.PagamentoSinistroServiceEBS/PagamentoSinistroServiceEBSV1_0",
            "environments": [{
                    "name": "OSB-TST2",
                    "https": true,
                    "authentication": "basic",
                    "work-manager": "default",
                    "ldap-group": "RE.Innovare.SinistroOA.PagamentoSinistroServiceEBS",
                    "timestamp": 1459361875337

                },
                {
                    "name": "OSB-HML2",
                    "https": true,
                    "authentication": "basic",
                    "work-manager": "default",
                    "ldap-group": "RE.Innovare.SinistroOA.PagamentoSinistroServiceEBS",
                    "timestamp": 1459361875337
                }
            ],
            "timestamp": 1459361875337
        },
        {
            "name": "SinistroServiceAccount-3",
            "type": "Service Account",
            "environments": [{
                    "name": "OSB-TST2",
                    "user": "myuser",
                    "password": "mypassword",
                    "timestamp": 1459361875337
                },
                {
                    "name": "OSB-HML2",
                    "user": "myuser2",
                    "password": "mypassword2",
                    "timestamp": 1459361875337
                }
            ],
            "timestamp": 1459361875337
        }
    ]
});*/ 

    var project = new Project({
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

// create a new instance of the project model
    //project.name = 'tiago'; // set the projects name (comes from the request)
  /*  let assets = new Array();
    
    assets.push({
            name: "SinistroServiceAccount",
            type: "Service Account"
        });

    project.name = "TTTTSinistroOA.PagamentoSinistroServiceEBS",
    project.assets = assets;*/
    
    project.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'project created!' });
    });


  //  res.send(Heroes);
  }

  /**
   * GET all EndPoints.
   */
  public getAllEndPoints(req: Request, res: Response, next: NextFunction) {

      Project.find(function(err, projects) {
        if (err)
            res.send(err);

        res.json(projects);
    });
  }

    public getAllAssetsJson(req: Request, res: Response, next: NextFunction) {

        AssetsProd.forEach(element => {
            
            var project = new Project(element);  
            project.save(function(err) {
             res.json(err);
            });

        });

        res.json(AssetsProd);
 
  }

  

  // delete the project with this id
  public save(req: Request, res: Response, next: NextFunction) {
      
    var project = new Project(); // create a new instance of the project model
    project.name = req.body.name;

    project.technology = req.body.technology;

    project.environments = req.body.enviroments;

    project.timeStampLastModified = req.body.timeStampLastModified;
    project.uuidUserLastModified = req.body.uuidUserLastModified;
        
    project.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'project created! Id = ' +  req.body.id  });
    });
  } 

  // update the project with this id
  public update(req: Request, res: Response, next: NextFunction) {
    Project.findById(req.params.id, function(err, project) {

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
    Project.remove({
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
    Project.remove({
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
     
        let lProject = Project.find({ "_id": query }).exec(function(err, hero) {

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
     
        let hero = Project.find({ "endPoints": query }).exec(function(err, hero) {

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

        let hero = Project.find( query ).exec(function(err, hero) {

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

        let hero = Project.find( query, {"environments.$": 1, "environments.assets.endpoint-uri": 1}  ).exec(function(err, hero) {

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

        let hero = Project.find( query, {"environments.$": 1, "environments.assets.read-timeout": 1}  ).exec(function(err, hero) {

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

        let hero = Project.find( query, {"environments.$": 1, "environments.assets.connection-timeout": 1}  ).exec(function(err, hero) {

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
    this.router.get('/', this.getAllEndPoints);
     this.router.get('/assets', this.getAllAssetsJson);
    this.router.get('/ttt', this.getInfoAssets);
    
    this.router.get('/:id', this.getOne);

    this.router.post('/', this.save);

    this.router.put('/:id', this.update);

    this.router.delete('/:id', this.delete);

    this.router.get('/clear', this.clearAllDatabase);
    


//http://localhost:3000/api/v1/soa/AdicionarInfComplementaresPJIntegrarionService/AdicionarInfComplementaresPJ/OSB-HML2/endpoint-uri
 //http://localhost:3000/api/v1/soa/AdicionarInfComplementaresPJIntegrarionService/AdicionarInfComplementaresPJ/OSB-HML2/read-timeout
 //http://localhost:3000/api/v1/soa/AdicionarInfComplementaresPJIntegrarionService/AdicionarInfComplementaresPJ/OSB-HML2/connection-timeout
    this.router.get('/:projeto/:asset/:enviroment/endpoint-uri', this.getEndPointAsset);
    this.router.get('/:projeto/:asset/:enviroment/read-timeout', this.getReadTimeOutAsset);
    this.router.get('/:projeto/:asset/:enviroment/connection-timeout', this.getConnectionTimeOutAsset);

  }

}

// Create the ProjectRouter, and export its configured Express.Router
const projectRouter = new ProjectRouter();
projectRouter.init();

export default this.projectRouter.router;
// GET /servidor/aplicacao/projeto/business/ambiente/endpoint-uri
// Exemplo: GET http://servidor/aplicacao/SinistroOA.PagamentoSinistroServiceEBS/PagamentoBusinessService/OSB-TST2/endpoint-uri
// Deve retornar : https://wastst2innovare.portoseguro.brasil/sinistroprocessoWS/PagamentoSinistroWebService_v1_0ImplService

// GET /servidor/aplicacao/projeto/business/ambiente/read-timeout
// Exemplo: GET http://servidor/aplicacao/SinistroOA.PagamentoSinistroServiceEBS/PagamentoBusinessService/OSB-TST2/read-timeout
// Deve retornar : 5

// GET /servidor/aplicacao/projeto/business/ambiente/connection-timeout
// Exemplo: GET http://servidor/aplicacao/SinistroOA.PagamentoSinistroServiceEBS/PagamentoBusinessService/OSB-TST2/connection-timeout
// Deve retornar : 1