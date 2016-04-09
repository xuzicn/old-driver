const connection  = require('../db/connection');
const responseError = require('../lib/responseError');
const responseData = require('../lib/responseData');
const validateQuery = require('../lib/validateQuery');
const getValue = require('../lib/getValue');

const doesScopes = require('../lib/doesScopes')

const fs = require('fs');
const path = require('path');


const workingHours = { from: 8, to: 20 };

function getTodayInHour(h) {
	var date = new Date();
	return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h).valueOf();
}


function getRooms(dbc, args) {
	return new Promise(function (resolve, reject) {
		dbc.select({
			text: fs.readFileSync(path.join(__dirname, '..', 'db', 'sql', 'getRooms.sql')).toString(),
			values: [args.site, args.from, args.to]
		}).result((e, result, fields) => {
	        if (!!e) {
	        	reject(e.message);
	        } else {
	        	var roomDic = {}, rooms = [];
	        	result.forEach(function (room) {
	        		var theRoom = roomDic[room.id];
	        		var timeslot = (room.fromTime === null || room.fromTime === undefined) ? false : {
	        			from: room.fromTime,
	        			to: room.toTime
	        		};
	        		if (theRoom == undefined) {
	        			theRoom = {
	        				roomId: room.id,
	        				roomSize: room.roomSize,
	        				roomDevice: room.devices,
	        				roomName: room.roomName,
	        				timeSlots: !timeslot ? [] : [timeslot]
	        			};
	        			roomDic[theRoom.roomId] = theRoom;
	        			rooms.push(theRoom);
	        		} else {
	        			if (!!timeslot) theRoom.timeSlots.push(timeslot);
	        		}
	        	});
	        	roomDic = undefined;

	        	rooms.forEach(function (room) {
	        		room.avaliable = doesScopes(room.timeSlots).hasGapBetween({ from: args.from, to: args.to });
	        		delete room.timeSlots;
	        	})
	        	resolve(rooms);
	        }
		});
	});
}

module.exports = function (app) {
	app.get('/getBaseInfo', (req, res) => {
		var dbc = connection.connect();
	    new Promise(function (resolve, reject) {
		    dbc.select({
		        text: 'Select id, name from Site'
		    }).result((e, result, fields) => {
		        if (!!e) {
		            responseError(res, e.message);
		            resolve([true])
		        } else if (!result || result.length == 0) {
		        	console.log(arguments)
		            responseData(res, {
		            	msg: "没有site",
		            	sites: [],
		            	roomList: [],
		            	time: { begin: workingHours.from, end: workingHours.to }
		            });
		            resolve([true]);
		        } else {
				    var siteId, sites;
		        	siteId = result[0].id;
		        	sites = result.map(function (s) {
		        		return {
		        			text: s.name,
		        			value: s.id
		        		};
		        	});
		        	resolve([false, siteId, sites]);
		        }
		    });
	    }).then(function (a) {
	    	var responsed = a[0],
	    		siteId = a[1],
	    		sites = a[2];

	    	if (responsed || siteId == undefined) {
	    		dbc.disconnect();
	    		return true;
	    	} else {
	    		return getRooms(dbc, {
	    			site: siteId,
	    			from: getTodayInHour(workingHours.from),
	    			to: getTodayInHour(workingHours.to)
	    		}).then((rooms) => {
	    			responseData(res, {
						sites: sites,
						time: { begin: workingHours.from, end: workingHours.to },
						roomList: rooms
	    			});
	    			dbc.disconnect();
	    			return true;
	    		})
	    	}
	    }).catch(function(e) {
	    	dbc.disconnect();
	    	console.log(e.stack);
	    	responseError(res, e.message);
	    });
	});
//http://localhost:8080/getRoomList?site=1&from=1&to=2
	app.get('/getRoomList', (req, res) => {
		if (!validateQuery(req.query, res, {
			site: '未指定site id',
			from: '未指定开始时间',
			to: '未指定结束时间'
		})) return;
		var dbc = connection.connect();
		getRooms(dbc, {
			site: getValue(req.query, 'site', 'int', 0),
			from: getValue(req.query, 'from', 'int', 0),
			to: getValue(req.query, 'to', 'int', 0)
		}).then(function(rooms) {
			dbc.disconnect();
			responseData(res, rooms);
		}).catch(function() {
	    	dbc.disconnect();
	    	console.log(e.stack);
	    	responseError(res, e.message);
		});
	});
};


  // - ret: true/false
  // - msg: ''
  // - sites: [{ text: value: }]
  // - time: { begin: 8, en: 20}
  // - roomList: [{ roomId: roomName: roomSize: roomDevice: }]