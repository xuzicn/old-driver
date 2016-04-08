const request = require('request');
const expect = require('chai').expect;

const baseUrl = 'http://localhost:8080/meetingrooms/get';

describe('#会议室列表', function() {
	it('查询所有会议室列表', function() {
		return new Promise(function (resolve, reject) {
			request.get(baseUrl, function (e, res, body) {
				body = JSON.parse(body);
				expect(e).to.not.exist;
				expect(body).to.exist;
				expect(body.stack).to.not.exist;
				expect(body.data).to.have.length.above(0);
				resolve();
			});
		});
	});
	it('查询ID为1的列表', function() {
		return new Promise(function (resolve, reject) {
			request.get(baseUrl + '?id=1', function (e, res, body) {
				body = JSON.parse(body);
				expect(e).to.not.exist;
				expect(body).to.exist;
				expect(body.stack).to.not.exist;
				expect(body.data).to.have.length.above(0);
				expect(body.data[0].id).to.equal(1);
				resolve();
			});
		});
	});
});