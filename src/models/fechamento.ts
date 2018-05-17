var mongoose = require('mongoose');
var Schema = mongoose.Schema;
import { Document, Schema, Model, model } from 'mongoose';
import { Store } from './store';
//import { Product } from '../models/product';

export const FechamentoSchema: Schema = new Schema({
   //_id: String,
   // pedidos: [{produto: Product, quantidade: Number}],
    pedidos:[Schema.Types.Mixed],
    quantidadeItens: Number,
    valorTotal: Number,
    formaPagamento: String,
    valorPago: Number,
    valorTroco: Number,
    divisaoContas:[Schema.Types.Mixed],
    numeroContas: Number,
    dtCreate: Date,
    caixinha: Boolean,
    valorCaixinha: Number,
    desconto: Boolean,
    valorDesconto: Number,
    caixaFechado: Boolean,
    loja: Schema.Types.Mixed,
    dtFechamento: Date,
    idEmpresa:String,
    fechamentoCaixaId:String
});

export const Fechamento: Model = model("Fechamento", FechamentoSchema);