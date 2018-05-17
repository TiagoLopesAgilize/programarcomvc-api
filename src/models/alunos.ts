var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlunosSchema = new Schema({
    name: String,  
    points: Number,
    grade: Number,
    timeStampLastModified: String,
    idUserLastModified: String,
    schedules: [Schema.Types.Mixed],
    avatars: [Schema.Types.Mixed],
    enterprises: [Schema.Types.Mixed],
    university: [Schema.Types.Mixed],
    timestamp: Date,
});

module.exports = mongoose.model('Alunos', AlunosSchema);