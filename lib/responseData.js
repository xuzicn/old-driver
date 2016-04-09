const _ = require('underscore');
module.exports = function (res, data) {
    res.set('Content-Type', 'application/json');
    res.send({
    	ret: true,
    	data: data
    });
}