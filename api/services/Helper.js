
var moment = require('moment');
var Q = require('q');
var util = require('util');
var escape  = require('escape-html');

module.exports = {

    validate: function(errors, errorsDefine) {
        var validateObject = errors;

        for (var field in validateObject) {

            for (var index in validateObject[field]) {
                
                var error = validateObject[field][index];
                var rule = validateObject[field][index].rule;

                validateObject[field][index].message = errorsDefine[field][rule];
            }
        }

        return validateObject;
    },

    escapeHtmlRecords : function(records) {

        var result = records;
        if (util.isArray(records)) {
            for (var index in result) {
                for (var key in result[index]) {
                    result[index][key] = escape(result[index][key]);
                }
            };
            
            return result;
        }

        if (util.isObject(records)) {
            for (var key in result) {
                result[key] = escape(result[key]);
            }

            return result;
        }
    }

}