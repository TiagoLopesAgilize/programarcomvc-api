import { Router, Request, Response, NextFunction } from 'express';
const config = require('../config/config');
const AssetsProd = require('../gew2');
import { connect } from 'mongoose';
import { Section } from '../models/section';

export default class SectionController {

    constructor() { }

    public save(req: Request, res: Response, next: NextFunction) {
        const section = new Section();
        section.name = req.body.name;
        section.order = req.body.order;
        section.idEmpresa = req.user.idEmpresa;
        section.save()
        .then((created:any)=>{
            res.json({ message: 'Section created! Id = ' +  created.id, created : created });
        })
        .catch((err)=>{
            res.status(500).send(err);
        });
    }

    public update(req: Request, res: Response, next: NextFunction) {
        const section = new Section();
        section.findById(req.params.id, function (err, product) {
            if (err)
                res.send(err);
            section.name = req.body.name;
            section.order = req.body.order;
            section.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'section updated!' });
            });

        });
    }

    public delete(req: Request, res: Response, next: NextFunction) {
        Section.remove({
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
        Section.find({ "idEmpresa": req.user.idEmpresa }, function (err, sections) {
            if (err)
                res.send(err);

            res.json(sections);
        });
    }

    /**
     * GET one hero by id
     */
    public getOne(req, res, next) {
        let query = req.params.id;

        Section.findOne({ "_id": query }).exec(function (err, section) {
            if (section) {
                return res.status(200).json(section);
            } else {
                return res.status(404)
                    .json({
                        message: 'section não encontrada',
                        status: res.status
                    });
            }
        })
    }


}

