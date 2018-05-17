import { Router, Request, Response, NextFunction } from 'express';
const config  = require('../config/config');
const AssetsProd = require('../gew2');
import { connect } from 'mongoose';
import { Product } from '../models/product';
import { Section, SectionDTO } from '../models/section';
import SectionController from './SectionController';
 

export default class ProductController {

    constructor() {}

    public save(req: Request, res: Response, next: NextFunction) {
            const product = new Product(); 
            product.name = req.body.name;
            product.descricao = req.body.descricao;
            product.desconto = req.body.desconto;
            product.valor = req.body.valor;
            product.image = req.body.image;
            product.order = req.body.order;
            product.imagemDestaque = req.body.imagemDestaque; 
            product.idEmpresa = req.user.idEmpresa;

            if(req.body.pagina){
                let section = new Section();
                section.name = req.body.pagina;
                section.idEmpresa = req.user.idEmpresa;
                section.save()
                .then((created:any)=>{
                    product.idSection = created._id;
                    product.save()
                    .then((created:any)=>{
                        res.json({ message: 'Product created! Id = ' +  created.id, created : created });
                    })
                    .catch((err)=>{
                        res.status(500).send(err);
                    });
                })
                .catch((err)=>{
                    res.status(500).send(err);
                });
            }else{

                if(req.body.idSection)
                    product.idSection = req.body.idSection;
                    
                product.save()
                .then((created:any)=>{
                    res.json({ message: 'Product created! Id = ' +  created.id, created : created });
                })
                .catch((err)=>{
                    res.status(500).send(err);
                });
            }
    } 

    public update(req: Request, res: Response, next: NextFunction) {
        const product = new Product(); 
        product.findById(req.params.id, function(err, product) {
            if (err)
                res.send(err);

            product.name = req.body.name;
            product.descricao = req.body.descricao;
            product.desconto = req.body.desconto;
            product.valor = req.body.valor;
            product.address = req.body.address; 
            product.image = req.body.image; 
            product.imagemDestaque = req.body.imagemDestaque; 
            product.save(function(err) {
                if (err){
                    res.send(err);
                }
                res.json({ message: 'product updated!' });
            });

        });
    }

    public delete(req: Request, res: Response, next: NextFunction) {
        Product.remove({
            _id: req.params.id
        }, function(err, project) {
            if (err) {
            console.error(`${req.params.id} error on delete`);
            res.send(err);
            }
            res.json({ message: 'Successfully deleted' });
        });
    }

    public getAllProducts(req: Request, res: Response, next: NextFunction) {
        let query = { "idEmpresa": req.user.idEmpresa };
        let sectionsDTO = [];
        Section.find(query, (err, sections) => {
            if (err)
                res.send(err);
            
            let promises =[];

            query["idSection"] = null;
            let promDefault = Product.find( query, (err, products) => {
                if (err)
                    res.send(err);
                if(products && products.length > 0){
                    let defaultSectionDTO = <SectionDTO>{};
                    defaultSectionDTO.section = new Section();
                    defaultSectionDTO.section.name = "Geral";
                    defaultSectionDTO.section.order = 0;
                    defaultSectionDTO.products = products;
                    sectionsDTO.push(defaultSectionDTO);
                }
            });
            promises.push(promDefault);

            sections.forEach(section => {
                let sectionDTO = <SectionDTO>{};
                sectionDTO.section = section;
                query["idSection"] = section.id;
                let prom = Product.find( query, (err, products) => {
                    if (err)
                        res.send(err);
                    sectionDTO.products = products;
                    sectionsDTO.push(sectionDTO);
                });
                promises.push(prom);
            });

            Promise.all(promises).then((p) => {
                res.json(sectionsDTO);
            })
            .catch(e => {
                res.status(500).json(e);
            });
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
   * Save all Assets for a mock product.
   */
    public saveMockTest(req: Request, res: Response, next: NextFunction) {
        /* */
        const acaraje = new Product(
            { 
                "name": "Acarajé",
                "descricao": "Acarajé completo com camarão",
                "desconto":"0",
                "valor": "13.99",
                "address": '',
                "idEmpresa":'1',
                "image":""            
            },
        );
        
        const refrigerante = new Product(
            { 
                "name": "Coca-cola",
                "descricao": "Coca-cola 355ml",
                "desconto":"0",
                "valor": "5.99",
                "address": '',
                "idEmpresa":'1',
                "image":""            
            },
        );

        const bolinhoEstudante = new Product(
            { 
                "name": "Bolinho Estudante",
                "descricao": "Bolinho Estudante com canela e açúcar",
                "desconto":"0",
                "valor": "9.72",
                "address": '',
                "idEmpresa":'1',
                "image":""            
            },
        );

        const devassa = new Product(
            { 
                "name": "Cerveja Devassa",
                "descricao": "Devassa Puro Malte 355ml",
                "desconto":"0",
                "valor": "6.75",
                "address": '',
                "idEmpresa":'2',
                "image":""            
            },
        );

        const indica = new Product(
            { 
                "name": "Cerveja Indica",
                "descricao": "Indica IPA 600ml",
                "desconto":"0",
                "valor": "16.50",
                "address": '',
                "idEmpresa":'2',
                "image":""            
            },
        );

        var produtos = [ acaraje, refrigerante, bolinhoEstudante, devassa, indica ];
        
        var promises = new Array();

        produtos.forEach(produto =>{
            promises.push(produto.save());    
        });

        Promise.all(promises)
        .then(()=>{
            res.json({ message: 'product created!' });
        })
        .catch((err)=>{
            res.send(err);
        });
    }

    

    // delete the project with this id
    public clearAllDatabase(req: Request, res: Response, next: NextFunction) {
        Product.remove({
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
     
        Product.findOne({ "_id": query }).exec(function(err, product) {
            if (product) {
                return res.status(200).json(product);
            } else {
               return res.status(404)
                    .json({ 
                        message: 'product não encontrado',
                        status: res.status
                    });
            }
        })
    }


}

