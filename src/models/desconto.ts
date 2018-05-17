var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DescontoSchema = new Schema({
    name: String,
    desconto: String,
    valor: Number,
    timeStampLastModified: String,
    idUserLastModified: String,
    enterprises: [Schema.Types.Mixed],
    timestamp: Date,
});

module.exports = mongoose.model('Desconto', DescontoSchema);