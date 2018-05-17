var mongoose = require('mongoose');
var Schema = mongoose.Schema;
import { Document, Schema, Model, model } from 'mongoose';
import { Store } from './store';
//import { Product } from '../models/product';

export const FechamentoCaixaSchema: Schema = new Schema({
    dtFechamento: Date,
    idEmpresa:String,
    fechamento:Schema.Types.Mixed,
    valorCreditoAjustado:Number,
    valorDebitoAjustado:Number,
    valorDinheiroAjustado:Number
});

export const FechamentoCaixa: Model = model("FechamentoCaixa", FechamentoCaixaSchema);