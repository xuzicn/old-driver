const mysql = require('mysql');
const chalk = require('chalk');
const connectionOpts = {
  host: '127.0.0.1',
  user: 'root',  
  password: 'likeeee',
  charset: 'utf8'
};

const dbname ='old_driver';


function Connection() {
	const client = mysql.createConnection(connectionOpts);
	client.connect();
	client.query(`use ${dbname}`);
	this._client = client;
	this._temporary = {
		chain: Promise.resolve()
	};
	return this;
}

Connection.prototype.disconnect = function () {
	var me = this;
	this._temporary.chain.then(function () {
		me._client.end();
	})
	return this;
}

Connection.prototype.result = function(fn) {
	var me = this;
	this._temporary.chain = this._temporary.chain.then(function() {
		try {
			fn(me._temporary.result.err, me._temporary.result.results, me._temporary.result.fields);
		} catch (e) {
			console.log(e);
			console.log(e.stack)
		}
	}).catch(function (e) {
		console.log(e.stack);
		return Promise.reject(e);
	});
	return this;
}

Connection.prototype.insert = function (command) {
	var me = this,
		sql = command, 
		statements = [];
	if (typeof command === 'object') {
		sql = command.text;
		statements = command.values;
	}
	console.log(chalk.green(`running sql command '${sql}'. arguments: `), statements);
	this._temporary.chain = this._temporary.chain.then(function () {
		return new Promise(function (resolve, reject) {
			me._client.query(sql, statements, function (err, results) {
				if (!!err) {
					console.log(chalk.red(`Fail to run sql command. ${err.message}.`));
				}
				console.log(chalk.red(JSON.stringify(results)))
				me._temporary.result = {
					err: err,
					results: results,
					fields: []
				}
				resolve();
			});
		})
	});
	return this;
}

Connection.prototype.select = function (command) {
	var me = this,
		sql = command, 
		statements = [];
	if (typeof command === 'object') {
		sql = command.text;
		statements = command.values;
	}
	console.log(chalk.green(`running sql command '${sql}'. arguments: `), statements);
	this._temporary.chain = this._temporary.chain.then(function () {
		return new Promise(function (resolve, reject) {
			me._client.query(sql, statements, function (err, results, fields) {
				if (!!err) {
					console.log(chalk.red(`Fail to run sql command. ${err.message}.`));
				}
				me._temporary.result = {
					err: err,
					results: results,
					fields: fields
				}
				resolve();
			});
		})
	});
	return this;
}


module.exports = {
	connect: function() {
		return new Connection();
	}
}