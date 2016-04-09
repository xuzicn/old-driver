
/*
 * 检查majorScope内是否有空档的
 *    majorScope: { from: int, to: int }
 *    gaps: [{  from: int, to: int }]
 * return boolean
 */

function hasGapBetween(majorScope) {
	var gaps = this.gaps;
	if (gaps.length == 0) return true;

	var hasGap = false, currentFrom = majorScope.from;
	for (var i = 0, len = gaps.length; i < len; i++) {
		if (currentFrom >= majorScope.to) break;
		if (currentFrom < gaps[i].from) {
			hasGap = true;
			break;
		} else {
			currentFrom = gaps[i].to;
		}
	}
	return hasGap;
}

module.exports = function (gaps) {
	return {
		gaps: gaps.sort(function (a, b) {
			return a.from >= b.from;
		}),
		hasGapBetween: hasGapBetween
	};
}