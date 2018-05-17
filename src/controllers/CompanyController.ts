import { Router, Request, Response, NextFunction } from 'express';
const config = require('../config/config');
const AssetsProd = require('../gew2');
import { connect } from 'mongoose';
import { Company } from '../models/company';

export default class CompanyController {

    constructor() { }

    public save(req: Request, res: Response, next: NextFunction) {
        const company = new Company();
        company.name = req.body.name;
        company.endereco = req.body.endereco;
        company.photoURL = req.body.photoURL;
        company.save(function (err) {
            if (err) {
                res.send(err);
            }
            console.log("company = " + company);
            console.log("company.id = " + company.id);
            res.json({ message: 'Company created! Id = ' + company.id });
        });
    }

    public update(req: Request, res: Response, next: NextFunction) {
        const company = new Company();
        company.findById(req.params.id, function (err, product) {
            if (err)
                res.send(err);
            company.name = req.body.name;
            company.endereco = req.body.endereco;
            company.photoURL = req.body.photoURL;
            company.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'company updated!' });
            });

        });
    }

    public delete(req: Request, res: Response, next: NextFunction) {
        Company.remove({
            _id: req.params.id
        }, function (err, project) {
            if (err) {
                console.error(`${req.params.id} error on delete`);
                res.send(err);
            }
            res.json({ message: 'Successfully deleted' });
        });
    }

    public getAll(req: Request, res: Response, next: NextFunction) {
        Company.find({ "idEmpresa": req.user.idEmpresa }, function (err, companies) {
            if (err)
                res.send(err);

            res.json(companies);
        });
    }

    /**
     * GET one hero by id
     */
    public getOne(req, res, next) {
        let query = req.params.id;

        Company.findOne({ "_id": query }).exec(function (err, company) {
            if (company) {
                return res.status(200).json(company);
            } else {
                return res.status(404)
                    .json({
                        message: 'empresa não encontrada',
                        status: res.status
                    });
            }
        })
    }


}

