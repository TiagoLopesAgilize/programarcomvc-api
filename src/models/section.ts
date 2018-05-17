var mongoose = require('mongoose');
var Schema = mongoose.Schema;
import { Document, Schema, Model, model } from 'mongoose';

export const SectionSchema: Schema = new Schema({
    name: String,
    order: Number,
    idEmpresa: String
});

export const Section: Model = model("Sections", SectionSchema);

export interface SectionDTO {
    section: any;
    products: any;
}