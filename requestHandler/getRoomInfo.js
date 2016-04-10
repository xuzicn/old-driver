const connection  = require('../db/connection');
const responseError = require('../lib/responseError');
const responseData = require('../lib/responseData');
const validateQuery = require('../lib/validateQuery');
const getValue = require('../lib/getValue');

const doesScopes = require('../lib/doesScopes')

const fs = require('fs');
const path = require('path');

function kkk(hours, from, to) {
	var fromHour = new Date(from).getHours(),
		toHour = new Date(to).getHours();

 	console.log('aaa', fromHour, toHour, from, to);
	for (var i = fromHour; i < toHour; i++) {
		if (hours.indexOf(i) == -1 && i >= workingHours.from && i < workingHours.to) {
			hours.push(i);
		}
	}
	return hours;
}

function paraller(bookings, from, to) {
	if (!bookings || !Array.isArray(bookings) || bookings.length == 0) return undefined;
	
	// 填充从每天工作开始时间到结束时间的小时数字
	var orderedTime = [];

	// 剔除已预订的小时
	const hourStep = 3600000;
	bookings.forEach(function (booking) {
		if (booking.from <= from || booking.to >= to) return;
		kkk(orderedTime, Number.parseInt(booking.from), Number.parseInt(booking.end));
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
		const from = new Date(Number.parseInt(date[0]), Number.parseInt(date[1]-1), Number.parseInt(date[2]), workingHours.from).valueOf();
		const to = new Date(Number.parseInt(date[0]), Number.parseInt(date[1]-1), Number.parseInt(date[2]), workingHours.to).valueOf();

		connection.connect().select({
			text: fs.readFileSync(path.join(__dirname, '..', 'db', 'sql', 'getRoomInfo.sql')).toString(),
			values: [roomId]
		}).result(function (e, result, fields) {
			if (!!e) {
				responseError(res, e.message);
			} else {
				responseData(res, paraller(result, from, to));
			}
		}).disconnect();
	});
};
