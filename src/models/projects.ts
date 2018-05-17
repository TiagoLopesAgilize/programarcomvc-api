// Priorização : Retorno de informações de endpoint 

// GET /servidor/aplicacao/projeto/business/ambiente/endpoint-uri
// Exemplo: GET http://servidor/aplicacao/SinistroOA.PagamentoSinistroServiceEBS/PagamentoBusinessService/OSB-TST2/endpoint-uri
// Deve retornar : https://wastst2innovare.portoseguro.brasil/sinistroprocessoWS/PagamentoSinistroWebService_v1_0ImplService

// GET /servidor/aplicacao/projeto/business/ambiente/read-timeout
// Exemplo: GET http://servidor/aplicacao/SinistroOA.PagamentoSinistroServiceEBS/PagamentoBusinessService/OSB-TST2/read-timeout
// Deve retornar : 5

// GET /servidor/aplicacao/projeto/business/ambiente/connection-timeout
// Exemplo: GET http://servidor/aplicacao/SinistroOA.PagamentoSinistroServiceEBS/PagamentoBusinessService/OSB-TST2/connection-timeout
// Deve retornar : 1

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Projectchema = new Schema({
    name: String,
    technology: String,
    timeStampLastModified: String,
    uuidUserLastModified: String,
    environments: [Schema.Types.Mixed],
    timestamp: Date,
});

module.exports = mongoose.model('Project', Projectchema);