const connection  = require('../db/connection');
const responseError = require('../lib/responseError');
const responseData = require('../lib/responseData');
const validateQuery = require('../lib/validateQuery');
const getValue = require('../lib/getValue');

module.exports = function (app) {
	app.post('/bookRoom', (req, res) => {
		if (!validateQuery(req.body, res, {
			from: '未指定开始时间',
			to: '未指定结束时间',
			roomId: '未指定roomId',
			openId: '未指定openId',
			comment: '未指定会议内容',
			attendees: '未指定参会者'
		})) return;


		var attendees = getValue(req.body, 'attendees', 'string', '').split(',');

		connection.connect().insert({
			text: ['INSERT INTO Booking (bookerId, fromTime, toTime, meetingRoomId, comment, attendees, orderTime)', 
			      	'(SELECT u.id, ?, ?, ?, ?, (SELECT GROUP_CONCAT(distinct openId) from User WHERE User.openId in (' + [attendees.map(() => '?')].join(',')  + ')), ?',
			      	'FROM User u WHERE u.openId=?)'].join(' '),
			values: [
				getValue(req.body, 'from', 'int', 0), 
				getValue(req.body, 'to', 'int', 0), 
				getValue(req.body, 'roomId', 'int', 0), 
				getValue(req.body, 'comment', 'string', 0)
			].concat(attendees).concat([new Date().valueOf(), getValue(req.body, 'openId', 'string', 0)])
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