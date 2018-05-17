import { Router, Request, Response, NextFunction } from 'express';
const config = require('../config/config');

const AssetsProd = require('../gew2');

import { connect } from 'mongoose';
import passport = require('passport');

import { sign, verify, TokenExpiredError } from 'jsonwebtoken';
import { compareSync, genSaltSync, genSalt, hashSync, compare, hash } from 'bcrypt-nodejs';

import { User } from '../models/user';
import CompanyController from './CompanyController';

var Project = require('../models/projects');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

export class UserController {

    constructor() { }

    // Set user info from request
    public setUserInfo(request: any) {
        return {
            _id: request._id,
            name: request.name,
            email: request.email,
            idEmpresa: request.idEmpresa,
            role: request.role,
        }
    }

    // Set user info from request
    public setUserInfoLogin(request: any) {
        return {
            _id: request.body._id,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            email: request.body.email,
            role: request.body.role,
        }
    }

    public generateToken(user: any) {

        let payload = JSON.stringify({ id: user.id });

        return sign(payload, config.secretKey);

        /* let token = sign({
                   sub: user._id,
                   username: user.email,
                  // exp: Math.floor(Date.now() / 1000) + (60),
                   exp: 1000000000,
                   issuer: 'teste@teste.com.br',
                   audience: 'aud'
               }, 'scoobydoo');

       return token;*/
    }

    //========================================
    // Login Route JWT
    //========================================
    public login(req, res, next) {

        let useCtr = new UserController();
        User.findOne({ email: req.body.email }, function (err, user) {
            console.log("USER ON LOGIN >> " + user);
            if (err) {
                res.send(err);
            }

            if (!user) {
                return res.status(401).json({
                    message: 'Usuário não existe',
                });
            }

            compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    res.send(err);
                } else {

                    if (result) {
                        return res.status(200).json({
                            // token: 'JWT ' + lUserRoutObj.generateToken(user),
                            token: useCtr.generateToken(user),
                            user: new UserController().setUserInfo(user)
                        });
                    } else {
                        return res.status(401).json({
                            message: 'Inválido Password!',
                        });
                    }
                }


            });

        });

    }



    //========================================
    // Registration Route
    //========================================
    public register(req: Request, res: Response, next: NextFunction) {
        // Check for registration errors
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;
        const confirm_password = req.body.confirma_password;
        var idEmpresa = req.body.idEmpresa;
        // Return error if no email provided
        if (!email) {
            return res.status(422).json({ message: 'Falta o endereço de email.' });
        }

        // Return error if full name not provided
        if (!name) {
            return res.status(422).json({ message: 'Falta seu nome.' });
        }

        // Return error if no password provided
        if (!password) {
            return res.status(422).json({ message: 'É necessário ter uma senha' });
        }

        if (password != confirm_password) {
            return res.status(422).json({ message: 'A confirmação da senha está diferente da senha!' });
        }

        if (!idEmpresa)
            idEmpresa = '1';

        const userctl = new UserController();
        //let useCtr= new UserController();
        User.findOne({ email: email }, function (err, existingUser) {
            if (err) { return next(err); }

            // If user is not unique, return error
            if (existingUser) {
                return res.status(422).json({ message: 'O email já existe.' });
            }

            // If email is unique and password was provided, create account
            let user = new User({
                email: email,
                password: password,
                name: name,
                idEmpresa: idEmpresa
            });

            user.save(function (err, user) {
                if (err) { res.status(401).json({ message: err }) }

                console.log(user);
                let userInfo = userctl.setUserInfo(user);

                res.status(200).json({
                    token: userctl.generateToken(userInfo),
                    user: userInfo
                });
            });
        });
    }
    //========================================
    // Authorization Middleware
    //========================================

    // Role authorization check
    public roleAuthorization(role: String) {
        return function (req: Request, res: Response, next: NextFunction) {
            const user = req.user;
            console.log("Authorization - " + user);
            User.findById(user._id, function (err, foundUser) {

                if (err) {
                    res.status(422).json({ error: 'No user was found.' });
                    return next(err);
                }

                // If user is found, check role.
                if (foundUser.role == role) {
                    return next();
                }

                res.status(401).json({ error: 'You are not authorized to view this content.' });
                return next('Unauthorized');
            })
        }
    }


    /**
     * Save all Assets for a mock project.
     */
    public saveMockTest(req: Request, res: Response, next: NextFunction) {

        var user = new User({ // Projeto do OSB
            "login": "lucas",
            "name": "Lucas",
            "email": "lucas@descontos.com.br",
            "password": "12345",
            "timestamp": 1459361875337,
            "role": "Owner"
        });


        user.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.json({ message: 'user created!' });
            }
        });

    }

    /**
     * GET all Users.
     */
    public getAllUsers(req: Request, res: Response, next: NextFunction) {
        User.find(function (err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    }


    // delete the project with this id
    public save(req: Request, res: Response, next: NextFunction) {
        const user = new User(); // create a new instance of the user model
        user.name = req.body.name; // set the users name (comes from the request)
        user.senha = req.body.passwd;
        user.idEmpresa = req.body.idEmpresa;
        user.roles = req.body.roles;
        user.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'user created! Id = ' + req.body.id });
        });
    }

    // update the project with this id
    public update(req: Request, res: Response, next: NextFunction) {
        User.findById(req.params.id, function (err, user) {

            if (err)
                res.send(err);

            user.name = req.body.name;
            //user.senha = req.body.passwd;
            user.idEmpresa = req.body.idEmpresa;
            //user.roles = req.body.roles;
            user.save(function (err) {
                if (err)
                    res.send(err);

                res.json({ message: 'user updated!' });
            });

        });
    }

    // delete the project with this id
    public delete(req: Request, res: Response, next: NextFunction) {
        User.remove({
            _id: req.params.id
        }, function (err, project) {
            if (err) {
                console.error(`${req.params.id} error on delete`);
                res.send(err);
            }
            res.json({ message: 'Successfully deleted' });
        });
    }


    // delete the project with this id
    public clearAllDatabase(req: Request, res: Response, next: NextFunction) {
        User.remove({
        }, function (err, project) {
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
    public getOne(req, res, next) {
        let query = req.params.id;

        let hero = User.find({ "_id": query }).exec(function (err, hero) {

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


    /**
     * GET one hero by id
     */
    public getEndPoints(req, res, next) {
        let query = req.params.idPorjeto;

        let hero = User.find({ "endPoints": query }).exec(function (err, hero) {

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

        let query = {
            name: req.query.name,
            roles: {
                $elemMatch: { "name": req.query.nameRole }
            }
        };

        let user = User.find(query).exec(function (err, hero) {

            if (user) {
                res.status(200)
                    .send({
                        message: 'Success',
                        status: res.status,
                        hero
                    });
            } else {
                res.status(404)
                    .send({
                        message: 'No user found with the given id. = ' + query,
                        status: res.status
                    });
            }
        })
    }

    public loginPost(req, res, next) {

        res.status(200)
            .send({
                message: 'No user found with the given id. = ',
                status: res.status
            });

        console.log(`login post`);
        passport.authenticate('local-login', {
            successRedirect: 'profile',
            failureRedirect: 'login',
            failureFlash: true
        })
    }

    /* PROFILE SECTION */
    public profile(req, res, next) {
        /* res.render('users/profile', {
             contentHeader: {
                 title: 'User Profile',
                 subtitle: 'Detail information'
             },
             user: req.user // get the user from session and pass to template
         });*/
        console.log(`profile`);
        res.json({ message: 'Successfully login' });
    };

    /* LOGOUT */
    public logout(req, res, next) {

        req.logout();
        res.redirect('/');

    }

    // route middleware to make sure a user is logged in
    public isLoggedIn(req, res, next) {
        // if user is authenticate in the session, carry on
        if (req.isAuthenticated()) {
            return next();
        }
        // in any other case, redirect to the home
        res.redirect('/');
    }

    public isTokenValid(req, res, next) {
        res.status(200).json('ok');
    }


}

export default new UserController();