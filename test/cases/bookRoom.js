const request = require('request');
const expect = require('chai').expect;

const baseUrl = 'http://localhost:8080/bookRoom';

describe('#预定会议室', function (argument) {
	it('预定成功', function () {
		return new Promise(function (resolve, reject) {
			request.post(baseUrl, {
				form: {
					from: 9,
					to: 12,
					roomId: 1,
					openId: '1111',
					comment: 'xxxx',
					attendees: 'fu*ksungod,dragon.wang'
				}
			}, function (e, res, body) {
				console.log(body)
				body = JSON.parse(body);
				expect(e).to.not.exist;
				expect(body).to.exist;
				expect(body.msg).to.not.exist;
				expect(body.success).to.be.true;
				expect(body.ret).to.be.true;
				resolve();
			});
		})
	});
});