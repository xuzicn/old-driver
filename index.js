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

function responseError(res, e) {
}

function responseData(res, data) {
    res.set('Content-Type', 'application/json');
}

function responseDbQuery(res, e, result, fields, dataConstructFn) {
    res.set('Content-Type', 'application/json');
    debugger
    if (e) {
        res.send({
            error: 1,
            data: null,
            message: e.message,
            stack: e.stack
        })
    } else {
        if (!dataConstructFn) {
            dataConstructFn = function (row) {
                var r = {};
                for (var i in row) {
                    if (row.hasOwnProperty(i)) {
                        r[i] = row[i];
                    }
                }
                return r;
            }
        }
        res.send({
            error: 0,
            data: (result || []).map(dataConstructFn),
            message: null,
            stack: null
        });
    }
}

function validateQuery(res, query, rules) {
    for (var i in rules) {
        if (!rules.hasOwnProperty(i)) continue;
        
        if (!query.hasOwnProperty(i)) {
            res.send({
                error: 1,
                message: rules[i]
            });
            return false;
        }
    }
    return true;
}

app.get('/meetingrooms/get', (req, res) => {
    const args = req.query;
    var s = sql.select()
      .fields({
        'MR.id': 'id',
        'MR.name': 'name',
        'MR.address': 'address',
        'S.id': 'siteId',
        'S.name': 'siteName'
      })
      .from('MeetingRoom', 'MR')
      .left_join('Site', 'S', 'S.id=MR.siteid');
    if (args.hasOwnProperty('id')) {
        s = s.where('S.id = ?', args.id);
    }
    s = s.toParam();
    connection.connect().select(s).result(function(e, r, f) {
        responseDbQuery(res, e, r, f);
    }).disconnect();
});

app.get('/avaliablerooms/get', (req, res) => {
    var s = {
        text: fs.readFileSync('./db/sql/getAvalibleRooms.sql').toString(),
        values: [1, 10000000, 1, 10000000000000000, 1]
    };
    connection.connect().select(s).result(function(e, r, f) {
        responseDbQuery(res, e, r, f);
    }).disconnect();
});

app.get('/freerooms/get', (req, res) => {
    const args = req.query;
    if (!validateQuery(res, args, {
        site: '必须指定办公区域id',
        from: '没有指定查询开始时间',
        to: '没有指定查询结束时间'
    })) return;

    const fromDate = Number.parseInt(args.hasOwnProperty('from') ? args.from : 0);
    const toDate = Number.parseInt(args.hasOwnProperty('to') ? args.to : 0);
    
    var s = {
        text: fs.readFileSync('./db/sql/getAvalibleRooms.sql').toString(),
        values: [fromDate, toDate, fromDate, toDate, args.site]
    };
    connection.connect().select(s).result(function(e, r, f) {
        responseDbQuery(res, e, r, f);
    }).disconnect();
});

server.listen(8080, () => {
    console.log(chalk.green('Server started.'));
});