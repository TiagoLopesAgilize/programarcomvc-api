"use strict";

var  Util = {

    formatMoney: function (valor, places, symbol, thousand, decimal) {
        places = !isNaN(places = Math.abs(places)) ? places : 2;
        symbol = symbol !== undefined ? symbol : "R$";
        thousand = thousand || ".";
        decimal = decimal || ",";
        let negative = valor < 0 ? "-" : "";
        const i = parseInt(valor = Math.abs(+valor || 0).toFixed(places), 10);
        var j = (j = i.toString().length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.toString().substr(0, j) + thousand : "") + i.toString().substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(valor - i).toFixed(places).slice(2) : "");
    },

    onlyNumber: function (str) {
        if(!str) {
            return null;
        }
        return str.toString().replace(/\D/g, '');
    },

    getRealNumber: function (strValue, divisorDec) {
        if(!divisorDec) {
            divisorDec = 100;
        }

        if(strValue && (strValue.toString().indexOf('.') !== -1 || strValue.toString().indexOf(',') !== -1)) {
            strValue = this.onlyNumber(strValue);
        }
        else {
            divisorDec = 1;
        }

        if(strValue) {
            return Number((parseInt(strValue,10) / divisorDec).toFixed(3));
        }
        
        return 0;
    },

    isInt: function (n) {
        return Number(n) === n && n % 1 === 0;
    }
}

for(var key in Util) {
    module.exports[key] = Util[key];
}