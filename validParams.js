module.exports = function (obj, fields) {
	fields.forEach(function(f) {
		var name = f.name,
			required = f.required;

		if (required && (!obj.hasOwnProperty(name) || obj[name] === undefined)) {
			throw new Error(`${name} field is required but not specified`)
		}
	});
}