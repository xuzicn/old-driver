const connection  = require('../db/connection');
const responseError = require('../lib/responseError');
const responseData = require('../lib/responseData');
const validateQuery = require('../lib/validateQuery');
const getValue = require('../lib/getValue');

module.exports = function (app) {
	app.get('/userInfo', (req, res) => {
		if (!validateQuery(req.query, res, {
			openId: '未指定openId'
		})) return;

		const openId = getValue(req.query, 'openId', 'string', '');

		connection.connect().select({
			text: 'SELECT * FROM User WHERE openId=?',
			values: [openId]
		}).result(function (e, result, fields) {
			if (!!e) {
				responseError(res, e.message);
			} else {
				responseData(res, {
					success: result && (result.length>0)
				});
			}
		}).disconnect();
	});
};