import { Router, Request, Response, NextFunction } from 'express';
const config = require('../config/config');
const AssetsProd = require('../gew2');
import { connect } from 'mongoose';
import { Fechamento } from '../models/fechamento';
import { Store } from '../models/store';
import { FechamentoModel } from '../models/fechamento.model';
import { FechamentoCaixa } from '../models/fechamento-caixa';

var Util = require('../helpers/util');

export default class FechamentoController {

    constructor() { }

    public save(req: Request, res: Response, next: NextFunction) {
        const fechamento = new Fechamento();

        fechamento.idEmpresa = req.user.idEmpresa;
        fechamento.pedidos = req.body.pedidos;
        fechamento.quantidadeItens = req.body.quantidadeItens;

        fechamento.formaPagamento = req.body.formaPagamento;
        fechamento.valorTotal = req.body.valorTotal;
        fechamento.valorPago = req.body.valorPago;
        fechamento.valorTroco = req.body.valorTroco;

        fechamento.valorCaixinha = req.body.valorCaixinha;
        fechamento.valorDesconto = req.body.valorDesconto;

        fechamento.divisaoContas = req.body.divisaoContas;
        fechamento.numeroContas = req.body.numeroContas;
        fechamento.dtCreate = new Date();
        fechamento.caixaFechado = false;

        let message = this.validar(fechamento, res);
        if (message) {
            return res.status(422).json(message);
        }

        fechamento.save(function (err) {
            if (err) {
                //return res.send(err);
                return res.status(510).json({ message: err.message });
            }
            res.json({ message: 'Fechamento Realizado! Id = ' + fechamento.id });
        });
    }

    public getAllFechamentos(req: Request, res: Response, next: NextFunction) {
        Fechamento.find({ "idEmpresa": req.user.idEmpresa }, function (err, stores) {
            if (err)
                return res.status(510).json({ message: err.message });
            //res.send(err);

            res.json(stores);
        });
    }
    public getContasFechadas(req: Request, res: Response, next: NextFunction) {
        Fechamento.find({ "idEmpresa": req.user.idEmpresa, "fechamentoCaixaId": null }, function (err, stores) {
            if (err)
                return res.status(510).json({ message: err.message });
            //res.send(err);

            res.json(stores);
        });
    }

    public extrairFechamento(fechamentos):FechamentoModel{
        let fech = <FechamentoModel>{};
        fech.valorDebito = 0;
        fech.qtdDebito = 0;
        fech.valorCredito = 0;
        fech.qtdCredito = 0;
        fech.valorDinheiro = 0;
        fech.qtdDinheiro = 0;
        fech.valorMedio = 0;
        fech.produtosVendidos = new Array<any>();
        let pedidos = [];

        if (fechamentos) {
            var i = 0;
            for (i; i < fechamentos.length; i++) {
                let fechamento = fechamentos[i];
                pedidos = pedidos.concat(fechamento.pedidos);
                if (fechamento.formaPagamento === 'debito') {
                    fech.valorDebito = fech.valorDebito + fechamento.valorPago;
                    fech.qtdDebito++;
                }
                else if (fechamento.formaPagamento === 'credito') {
                    fech.valorCredito = fech.valorCredito + fechamento.valorPago;
                    fech.qtdCredito++;
                }
                else if (fechamento.formaPagamento === 'dinheiro') {
                    fech.valorDinheiro = fech.valorDinheiro + Util.getRealNumber(fechamento.valorPago, null);
                    fech.qtdDinheiro++;
                }
                else {
                    var j = 0;
                    for (j; j < fechamento.divisaoContas.length; j++) {
                        let conta: any = fechamento.divisaoContas[j];
                        let vl = parseFloat(conta.valorPago);

                        if (conta.formaPagamento === 'debito') {
                            fech.valorDebito = fech.valorDebito + vl;
                            fech.qtdDebito++;
                        }
                        else if (conta.formaPagamento === 'credito') {
                            fech.valorCredito = fech.valorCredito + vl;
                            fech.qtdCredito++;
                        }
                        else {
                            fech.valorDinheiro = fech.valorDinheiro + vl;
                            fech.qtdDinheiro++;
                        }
                    }
                }
            }

            // if(fech.qtdDebito > 0) 
            //     fech.valorMedio = fech.valorMedio + (fech.valorDebito / fech.qtdDebito);
            // if(fech.qtdCredito > 0) 
            //     fech.valorMedio = fech.valorMedio + (fech.valorCredito / fech.qtdCredito);
            // if(fech.qtdDinheiro > 0) 
            //     fech.valorMedio = fech.valorMedio + (fech.valorDinheiro / fech.qtdDinheiro);

            fech.valorTotal = fech.valorCredito + fech.valorDebito + fech.valorDinheiro;
            fech.valorMedio = fech.valorTotal / fechamentos.length;
            fech.valorMedio = parseFloat(fech.valorMedio.toFixed(2));

            let pedidosSum = pedidos.reduce((p, c) => {
                let productId = c.produto._id;
                let valor = c.produto.valor * c.quantidade;
                if (!p.hasOwnProperty(productId)) {
                    p[productId] = { 'produto': c.produto, 'quantidade': c.quantidade, 'valor': valor };
                } else {
                    p[productId].quantidade += c.quantidade;
                    p[productId].valor += valor;
                }
                return p;
            }, {});
            fech.produtosVendidos = [];
            Object.keys(pedidosSum).forEach((key) => { 
                fech.produtosVendidos.push(pedidosSum[key]); 
            });
        }
        return fech;
    }

    public fecharCaixa(req: Request, res: Response, next: NextFunction) {
        let fcCtr = new FechamentoController();
        Fechamento.find({ "idEmpresa": req.user.idEmpresa, "fechamentoCaixaId": null }).exec(function (err, fechamentos) {
            if (err)
                return res.status(510).json({ message: err.message });

            if (fechamentos && fechamentos.length > 0) {
                var msgRetorno = '';
                var i = 0;
                var j = fechamentos.length;
                var promises = [];
                let fech = fcCtr.extrairFechamento(fechamentos);
                let fechamentoCaixa = new FechamentoCaixa();
                fechamentoCaixa.dtFechamento = new Date();
                fechamentoCaixa.fechamento = fech;

                fechamentoCaixa.save().then((fc)=>{
                    for (i; i < fechamentos.length; i++) {
                        fechamentos[i].fechamentoCaixaId = fc.id;
                        
                        var prom = new Promise( (resolve, reject) =>{
                            fechamentos[i].save(function(err) {
                                if (err){
                                   reject({ message: err.message });
                                }
                                resolve(fechamentos[i]);
                            });
                        });
                        promises.push(prom);
                    }
                    Promise.all(promises).then((o)=>{
                        console.log(o);
                        return res.json({ message: 'Caixa fechado com sucesso!' });
                    })
                    .catch(err => {
                        return res.status(510).json({ message: err.message })
                    });
                });

            }
            else {
                return res.json({ message: 'Caixa não possui nenhuma conta em aberto' });
            }
            //return res.status(510).json({ message: err.message });
        });
    }

    public getFechamentosAberto(req, res, next) {
        let fcCtr = new FechamentoController();
        Fechamento
            .find({ "idEmpresa": req.user.idEmpresa, "fechamentoCaixaId": null })
            .exec(function (err, fechamentos) {
                if (err)
                    return res.status(510).json({ message: err.message });
                let fech = fcCtr.extrairFechamento(fechamentos);
                return res.status(200).json(fech);
            });
    }

    /**
     * GET one hero by id
     */
    public getOne(req, res, next) {
        let query = req.params.id;

        Fechamento.findOne({ "_id": query }).exec(function (err, fechamento) {
            if (err)
                return res.status(510).json({ message: err.message });
            if (fechamento) {
                return res.status(200).json(fechamento);
            } else {
                return res.status(404)
                    .json({
                        message: 'Fechamento não encontrado',
                        status: res.status
                    });
            }
        })
    }

    public delete(req, res, next) {
        Fechamento.remove({
            _id: req.params.id
        }, function (err, project) {
            if (err) {
                console.error(`${req.params.id} error on delete`);
                res.send(err);
            }
            res.json({ message: 'Registro removido!' });
        });
    }

    public validar(fechamento: any, res: Response) {
        if (!fechamento.pedidos || fechamento.pedidos.lenght < 1) {
            return { message: 'Pedidos: Campo Obrigatório' };
        }
        if (!fechamento.valorTotal || Util.getRealNumber(fechamento.valorTotal, null) <= 0) {
            return { message: 'Valor Total: Campo Obrigatório' };
        }
        if (fechamento.divisaoContas) {
            fechamento.formaPagamento = 'contaDividida';
            for (var i = 0; i < fechamento.divisaoContas.length; i++) {
                if (!fechamento.divisaoContas[i].formaPagamento) {
                    return { message: 'Existe alguma conta sem pagar na divisão de contas!' };
                }
            }
            fechamento.numeroContas = fechamento.divisaoContas.length;
        }
        if (fechamento.formaPagamento === 'dinheiro' && (!fechamento.divisaoContas || fechamento.divisaoContas.lenght < 1)) {
            if (!fechamento.valorPago || Util.getRealNumber(fechamento.valorPago, null) <= 0) {
                return { message: 'Não foi informado o valor pago em dinheiro!' };
            }
        }
    }
}

