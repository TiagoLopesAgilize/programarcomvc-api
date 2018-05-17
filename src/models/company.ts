var mongoose = require('mongoose');
var Schema = mongoose.Schema;
import { Document, Schema, Model, model } from 'mongoose';

export const CompanySchema: Schema = new Schema({
    name: String,
    endereco: String,
    photoURL: String,
});

export const Company: Model = model("Company", CompanySchema);