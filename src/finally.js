var Promise = require('./core.js');
Promise.prototype.finally = function (f) {
    console.log('finally')
}
