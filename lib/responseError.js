module.exports = function responseError(res, message) {
    res.set('Content-Type', 'application/json');
    res.send({
        ret: false,
        msg: message
    });
}