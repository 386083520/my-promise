var Promise = require('./core.js');


Promise.resolve = function (value) {
    console.log('gsdresolve', value)
}
Promise.all = function (arr) {
    console.log('gsdall', arr)
}
Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
        reject(value);
    });
}
