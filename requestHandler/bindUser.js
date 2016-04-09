const connection  = require('../db/connection');
const responseError = require('../lib/responseError');
const responseData = require('../lib/responseData');
const validateQuery = require('../lib/validateQuery');
const getValue = require('../lib/getValue');

module.exports = function (app) {
	app.post('/bindUser', (req, res) => {
		console.log('aaa', req.body)
		if (!validateQuery(req.body, res, {
			openId: '未指定openId',
			name: '未指定用户名',
			telephone: '未指定电话'
		})) return;

		connection.connect().insert({
			text: 'INSERT INTO User SET ?',
			values: {
				openId: getValue(req.body, 'openId', 'string', ''),
				name: getValue(req.body, 'name', 'string', ''),
				telephone: getValue(req.body, 'telephone', 'string', ''),
			}
		}).result(function (e, result, fields) {
			if (!!e) {
				responseError(res, e.message);
			} else {
				responseData(res, {
					success: result.affectedRows === 1
				});
			}
		}).disconnect();
	});
};