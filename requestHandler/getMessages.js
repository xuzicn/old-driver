const connection  = require('../db/connection');
const responseError = require('../lib/responseError');
const responseData = require('../lib/responseData');
const validateQuery = require('../lib/validateQuery');
const getValue = require('../lib/getValue');

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
		time: { begin: workingHours.from, to:  workingHours.to },
		orderedTime: orderedTime
	};
}

module.exports = function (app) {
	app.get('/getMessages', (req, res) => {
		var allBookings = [];
		var allUsers = [];
		var dbc = connection.connect();
		new Promise(function (resolve, reject) {
			dbc.select({
				text: 'select Booking.*,MR.roomName FROM Booking LEFT JOIN MeetingRoom MR ON MR.id=Booking.meetingRoomId'
			}).result(function (e, result) {
				if (!!e) {
					responseError(res, e.message);
					reject(e.message);
				} else {
					allBookings = result.map(function (b) {
						return {
							id: Number.parseInt(b.id),
							roomName: b.roomName,
							bookerId: Number.parseInt(b.bookerid),
							fromTime: Number.parseInt(b.fromTime),
							toTime: Number.parseInt(b.toTime),
							meetingRoomId: Number.parseInt(b.meetingRoomId),
							comment: b.comment,
							attendees: b.attendees ? b.attendees : '',
							orderTime: Number.parseInt(b.orderTime)
						};
					});
					resolve();
				}
			});
		}).then(function () {
			return new Promise(function (resolve, reject) {
				dbc.select({
					text: 'select * from User'
				}).result(function(e, result) {
					if (!!e) {
						responseError(res, e.message);
						reject(e.message);
					} else {
						allUsers = result.map(function (b) {
							return {
								id: Number.parseInt(b.id),
								name: b.name,
								openId: b.openId
							};
						});
						resolve();
					}
				})
			});
		}).then(function () {
			var newMeetings = [], recentMeetings = [], 
				now = new Date().valueOf(),
				newMeetingsThr = now - 60000,
				recentMeetingsThrBegin = now + 300000
				recentMeetingsThrEnd = now + 360000;
			for (var i = 0, len = allBookings.length; i < len; i++) {
				var booking = allBookings[i];
				var bookerOpenId=allUsers.filter(function(u) {
					return u.id = booking.bookerId
				})[0].openId;
				var attendees = (booking.attendees + ',' + bookerOpenId).split(',');
				booking.attendeeOpenIds = attendees;

				if (booking.orderTime >= newMeetingsThr) {
					newMeetings.push(booking);
				}
				if (booking.fromTime >= recentMeetingsThrBegin && booking.fromTime < recentMeetingsThrEnd) {
					recentMeetings.push(bookings);
				}
			}
			responseData(res, {
				recentMeetings: recentMeetings,
				newMeetings: newMeetings
			});
			dbc.disconnect();
		}).catch(function (e) {
			dbc.disconnect();
			responseError(res, e.message);
		});
	});
};