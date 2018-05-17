import {Router, Request, Response, NextFunction} from 'express';

var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost:27017/programarcomvc'); // connect to our database
var Alunos = require('../models/alunos');

export class AlunosRouter {
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

    var aluno = new Alunos({
        "name": "Tiago de Almeida Lopes",
        "points": 0,
        "grade": 0,
        "university": [
            {
                "name": "Uninove"
            }
        ],
        "schedules":  [
            {
                "day": "Segunda", 
                "hour": "22:20"
            },
            {
                "day": "Sabado", 
                "hour": "14:00"
            }
        ],
        "avatars":  [
            {
                "name": "babygramer",
                "description": "Iniciante. Habil em aprender com velocidade!",
            }
        ],
        "enterprises": [
            {
                "name": "Agilizeware",
                "description": "Arquitetura 4, Inovação, IONIC, mobile",
            }
        ],
    }); 

    aluno.save(function(err) {
        if (err)
            res.send(err);

        res.json({ message: 'desconto created!' });
    });

  }

  /**
   * GET all Alunos.
   */
  public getAllAlunos(req: Request, res: Response, next: NextFunction) {

      Alunos.find(function(err, alunos) {
        if (err)
            res.send(err);

        res.json(alunos);
    });
  }

  // save the desconto with this id
  public save(req: Request, res: Response, next: NextFunction) {
      
    var aluno = new Alunos(); // create a new instance of the project model
    aluno.name = req.body.name;
    aluno.points = req.body.points;
    aluno.grade = req.body.grade;
    aluno.schedules = req.body.schedules;
    aluno.avatars = req.body.avatars;
    aluno.enterprises = req.body.enterprises;
    aluno.university = req.body.university;

    aluno.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'aluno created! Id = ' +  req.body.id  });
    });
  } 

  // update the project with this id
  public update(req: Request, res: Response, next: NextFunction) {
    Alunos.findById(req.params.id, function(err, aluno) {

        if (err)
            res.send(err);

        aluno.name = req.body.name;
        aluno.points = req.body.points;
        aluno.grade = req.body.grade;
        aluno.schedules = req.body.schedules;
        aluno.avatars = req.body.avatars;
        aluno.enterprises = req.body.enterprises;
        aluno.university = req.body.university;

        
        console.log('########## UPDATE > Aluno ######'+JSON.stringify(req.body));

       // console.log('########## UPDATE > Enviroments ######'+req.body.enviroments);

        aluno.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'aluno updated!' });
        });

    });
  }

  // delete the aluno with this id
  public delete(req: Request, res: Response, next: NextFunction) {
    Alunos.remove({
        _id: req.params.id
    }, function(err, aluno) {
        if (err) {
          console.error(`${req.params.id} error on delete`);
          res.send(err);
        }
        res.json({ message: 'Successfully deleted' });
    });
  } 


    // delete the project with this id
  public clearAllDatabase(req: Request, res: Response, next: NextFunction) {
    Alunos.remove({
    }, function(err, aluno) {
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
     
        let lAluno = Alunos.find({ "_id": query }).exec(function(err, hero) {

            if (lAluno) {

                   console.log(lAluno instanceof require('mpromise'));
                 
                    lAluno.then(function (doc) {
                        console.log(doc);
                        const alunoRet = doc[0];
                        res.status(200)
                            .send({
                                status: res.status,
                                alunoRet
                            });
                    });

          
            } else {
                res.status(404)
                    .send({
                        message: 'No aluno found with the given id. = ' + query,
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
     
        let hero = Alunos.find({ "endPoints": query }).exec(function(err, hero) {

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

        let hero = Alunos.find( query ).exec(function(err, hero) {

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

        let hero = Alunos.find( query, {"environments.$": 1, "environments.assets.endpoint-uri": 1}  ).exec(function(err, hero) {

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

        let hero = Alunos.find( query, {"environments.$": 1, "environments.assets.read-timeout": 1}  ).exec(function(err, hero) {

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

        let hero = Alunos.find( query, {"environments.$": 1, "environments.assets.connection-timeout": 1}  ).exec(function(err, hero) {

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
    this.router.get('/aluno-save-mock', this.saveMockTest);

    this.router.get('/', this.getAllAlunos);
 
    this.router.get('/:id', this.getOne);

    this.router.post('/', this.save);

    this.router.put('/:id', this.update);

    this.router.delete('/:id', this.delete);

    this.router.get('/clear', this.clearAllDatabase);
    

  }

}

// Create the AlunosRouter, and export its configured Express.Router
const alunosRouter = new AlunosRouter();
alunosRouter.init();

export default this.alunosRouter.router;
