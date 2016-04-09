const connection  = require('../db/connection');
const responseError = require('../lib/responseError');
const responseData = require('../lib/responseData');
const validateQuery = require('../lib/validateQuery');
const getValue = require('../lib/getValue');

const doesScopes = require('../lib/doesScopes')

const fs = require('fs');
const path = require('path');

function paraller(bookings) {
	if (!bookings || !Array.isArray(bookings) || bookings.length == 0) return undefined;
	
	// 填充从每天工作开始时间到结束时间的小时数字
	var orderedTime = (function () {
		var n = [];
		for (var i = global.workingHours.from; i < global.workingHours.to; i++) {
			n.push(i);
		}
		return n;
	})();

	// 剔除已预订的小时
	const hourStep = 3600000;
	bookings.forEach(function (booking) {
		var cursor = booking.from;
		const end = booking.to;
		while (cursor < end) {
			var i = orderedTime.indexOf(new Date(cursor).getHour());
			if (i >= 0) {
				orderedTime.splice(i, 1);
			}
			cursor += hourStep;
		};
	});

	return {
		roomName: bookings[0].roomName,
		roomSize: bookings[0].roomSize,
		roomDevice: bookings[0].roomDevice,
		time: { begin: workingHours.from, end: workingHours.to },
		orderedTime: orderedTime
	};
}

module.exports = function (app) {
	app.get('/getRoomInfo', (req, res) => {
		if (!validateQuery(req.query, res, {
			roomId: '未指定roomId',
			date: '未指定日期yyyy-mm-dd'
		})) return;

		const roomId = getValue(req.query, 'roomId', 'int', 0);
		const date = getValue(req.query, 'date', 'string', '').split('-');
		const from = new Date(Number.parseInt(date[0]), Number.parseInt(date[1]-1), Number.parseInt(2), workingHours.from).valueOf();
		const to = new Date(Number.parseInt(date[0]), Number.parseInt(date[1]-1), Number.parseInt(2), workingHours.to).valueOf();

		connection.connect().select({
			text: fs.readFileSync(path.join(__dirname, '..', 'db', 'sql', 'getRoomInfo.sql')).toString(),
			values: [roomId, from, to, from, to]
		}).result(function (e, result, fields) {
			if (!!e) {
				responseError(res, e.message);
			} else {
				responseData(res, paraller(result));
			}
		}).disconnect();
	});
};