const doesScopes = require('../../lib/doesScopes');
const expect = require('chai').expect;

const gapScope = {
	from: 1460246400000,
	to: 1460289600000
}

function fff (des, expectResult) {
	var scopes = des == '' ? [] : des.split('^').map((s) => {
		s = s.replace(/[\[\]]/g, '').split(',');
		return {
			from: Number.parseInt(s[0]),
			to: Number.parseInt(s[1])
		};
	});
	console.log(scopes);
	var a = doesScopes(scopes).hasGapBetween(gapScope);
	it(des, function () {
		if (expectResult === true) {
			expect(a).to.be.true
		} else {
			expect(a).to.be.false;
		}
	});
}

describe('#ScopeCheck', function() {
	[{
		d: '[1460246400000,1460257200000]',
		r: true
	// }, {
	// 	d: '[100,200]^[300,500]^[200,300]^[400,1200]',
	// 	r: false
	// }, {
	// 	d: '[-100,200]^[300,500]^[200,300]^[400,1200]',
	// 	r: false
	// }, {
	// 	d: '',
	// 	r: true
	}].forEach((tc) => {
		fff(tc.d, tc.r);
	})
});