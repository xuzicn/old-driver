global.workingHours = { from: 8, to: 20 };

const connection = require('./db/connection.js');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sql = require('squel');
const fs = require('fs');

const chalk = require('chalk');

const root = path.join(__dirname, '..', '..');

const app = express();
const server = require('http').Server(app);

const url = require('url');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./requestHandler/getBaseInfo')(app);
require('./requestHandler/getRoomInfo')(app);
require('./requestHandler/userInfo')(app);
require('./requestHandler/bindUser')(app);
require('./requestHandler/bookRoom')(app);
require('./requestHandler/getMessages')(app);

// function responseDbQuery(res, e, result, fields, dataConstructFn) {
//     res.set('Content-Type', 'application/json');
//     if (e) {
//         res.send({
//             ret: false,
//             msg: e.message,
//             stack: e.stack
//         })
//     } else {
//         if (!dataConstructFn) {
//             dataConstructFn = function (row) {
//                 var r = {};
//                 for (var i in row) {
//                     if (row.hasOwnProperty(i)) {
//                         r[i] = row[i];
//                     }
//                 }
//                 return r;
//             }
//         }
//         res.send({
//             ret: true,
//             // data: (result || []).map(dataConstructFn),
//             msg: null
//         });
//     }
// }

// function validateQuery(res, query, rules) {
//     for (var i in rules) {
//         if (!rules.hasOwnProperty(i)) continue;
        
//         if (!query.hasOwnProperty(i)) {
//             res.send({
//                 error: 1,
//                 message: rules[i]
//             });
//             return false;
//         }
//     }
//     return true;
// }

// function getValue(obj, name, type, defaultVal) {
//     if (!obj.hasOwnProperty(name)) return defaultVal;
//     var val = obj[name];
//     switch (type) {
//         case 'int':
//             val = Number.parseInt(val);
//         case 'string':
//             val = val.toString();
//         default:
//             break;
//     }
//     return val;
// }


// app.get('/getRoomInfo', (req, res) => {
//     const args = req.query;
//     if (!validateQuery(res, args, {
//         roomId: '必须指定会议室id',
//         date: '请选定查询日期'
//     })) return;
// });

// app.get('/meetingrooms/get', (req, res) => {
//     const args = req.query;
//     var s = sql.select()
//       .fields({
//         'MR.id': 'id',
//         'MR.name': 'name',
//         'MR.address': 'address',
//         'S.id': 'siteId',
//         'S.name': 'siteName'
//       })
//       .from('MeetingRoom', 'MR')
//       .left_join('Site', 'S', 'S.id=MR.siteid');
//     if (args.hasOwnProperty('id')) {
//         s = s.where('S.id = ?', args.id);
//     }
//     s = s.toParam();
//     connection.connect().select(s).result(function(e, r, f) {
//         responseDbQuery(res, e, r, f);
//     }).disconnect();
// });

// app.get('/avaliablerooms/get', (req, res) => {
//     var s = {
//         text: fs.readFileSync('./db/sql/getAvalibleRooms.sql').toString(),
//         values: [1, 10000000, 1, 10000000000000000, 1]
//     };
//     connection.connect().select(s).result(function(e, r, f) {
//         responseDbQuery(res, e, r, f);
//     }).disconnect();
// });

// app.get('/freerooms/get', (req, res) => {
//     const args = req.query;
//     if (!validateQuery(res, args, {
//         site: '必须指定办公区域id',
//         from: '没有指定查询开始时间',
//         to: '没有指定查询结束时间'
//     })) return;

//     const fromDate = getValue(args, 'from', 'int', 0);
//     const toDate = getValue(args, 'to', 'int', Number.MAX_SAFE_INTEGER);
    
//     var s = {
//         text: fs.readFileSync('./db/sql/getAvalibleRooms.sql').toString(),
//         values: [fromDate, toDate, fromDate, toDate, args.site]
//     };
//     connection.connect().select(s).result(function(e, r, f) {
//         responseDbQuery(res, e, r, f);
//     }).disconnect();
// });

// app.get('/roomcalendar/get', (req, res) => {
//     const args = req.query;
//     if (!validateQuery(res, args, {
//         room: '必须指定会议室id'
//     })) return;

//     const roomId = getValue(args, 'room', int);
//     const fromDate = getValue(args, 'from', 'int', 0);
//     const toDate = getValue(args, 'to', 'int', Number.MAX_SAFE_INTEGER);

    
// });

server.listen(8080, () => {
    console.log(chalk.green('Server started.'));
});