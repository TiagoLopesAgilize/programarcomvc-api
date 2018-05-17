var mongoose = require('mongoose');
var Schema = mongoose.Schema;
import { Document, Schema, Model, model } from 'mongoose';

export const StoreSchema: Schema = new Schema({
    name: String,
    descricao: String,
    desconto: String,
    valor: String,
    address: String,
    image: String,
    timeStampLastModified: String,
    idUserLastModified: String,
    enterprises: [Schema.Types.Mixed],
    timestamp: Date,
    imagemDestaque: String
});

export const Store: Model = model("Store", StoreSchema);