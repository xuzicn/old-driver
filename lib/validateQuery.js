module.exports = function (args, response, rules) {
    for (var i in rules) {
        if (!rules.hasOwnProperty(i)) continue;
        
        if (!args.hasOwnProperty(i)) {
            response.send({
                ret: false,
                msg: rules[i]
            });
            return false;
        }
    }
    return true;
}