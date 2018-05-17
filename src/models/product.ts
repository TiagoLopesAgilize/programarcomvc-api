var mongoose = require('mongoose');
var Schema = mongoose.Schema;
import { Document, Schema, Model, model } from 'mongoose';

export const ProductSchema: Schema = new Schema({
    name: String,
    descricao: String,
    desconto: String,
    valor: String,
    address: String,
    image: String,
    timeStampLastModified: String,
    idUserLastModified: String,
    idEmpresa: String,
    timestamp: Date,
    imagemDestaque: String,
    order: Number,
    idSection: String
});

export const Product: Model = model("Product", ProductSchema);