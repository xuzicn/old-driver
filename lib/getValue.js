const _ = require('underscore');

module.exports = function (obj, name, type, defaultVal) {
	if (!obj.hasOwnProperty(name)) return defaultVal;
    var val = obj[name];
    switch (type) {
        case 'int':
            val = Number.parseInt(val);
        case 'string':
            val = _.isString(val) ? val : val.toString();
        default:
            break;
    }
    return val;
}