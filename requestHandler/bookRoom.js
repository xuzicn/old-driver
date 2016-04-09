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

	app.get('/getBookingList', (req, res) => {
        if (!validateQuery(req.query, res, {
            openId: '未指定openId'
        })) return;

        connection.connect().select({
            text: `
                SELECT B.id, address, comment, fromTime, toTime, roomName, roomSize FROM Booking B 
                LEFT JOIN User U ON B.bookerid=U.id
                LEFT JOIN MeetingRoom MR ON MR.id=B.meetingRoomId
                WHERE U.openid=?`,
            values: [
                getValue(req.query, 'openId', 'string', 0)
            ]
        }).result(function(e, result) {
            if (e) {
                responseError(res, e.message);
            } else {
                responseData(res, result);
            }
        }).disconnect();
    });

    app.get('/getBooking', (req, res) => {
        if (!validateQuery(req.query, res, {
            id: '未指定id'
        })) return;

        connection.connect().select({
            text: `
                SELECT B.id, attendees, comment, fromTime, toTime, roomName FROM Booking B 
                LEFT JOIN User U ON B.bookerid=U.id
                LEFT JOIN MeetingRoom MR ON MR.id=B.meetingRoomId
                WHERE B.id=?`,
            values: [
                getValue(req.query, 'id', 'string', 0)
            ]
        }).result(function(e, result) {
            if (e || !result.length) {
                responseError(res, e ? e.message : '未查到会议室预定信息');
            } else {
                responseData(res, result[0]);
            }
        }).disconnect();
    });
    
    app.post('/removeBooking', (req, res) => {
        if (!validateQuery(req.body, res, {
            id: '未指定id'
        })) return;
        
        connection.connect().select({
            text: `DELETE FROM Booking WHERE id=?`,
            values: [
                getValue(req.body, 'id', 'string', 0)
            ]
        }).result(function(e, result) {
            if (e) {
                responseError(res, e.message);
            } else {
                responseData(res, result);
            }
        }).disconnect();
    })
};