var Promise = require('./core.js');


Promise.resolve = function (value) {
    console.log('gsdresolve', value)
}

var iterableToArray = function (iterable) {
    if (typeof Array.from === 'function') {
        return Array.from(iterable);
    }
    return Array.prototype.slice.call(iterable);
}
Promise.all = function (arr) {
    var args = iterableToArray(arr);
    return new Promise(function (resolve, reject) {
        if (args.length === 0) return resolve([]);
        var remaining = args.length;
        function res(i, val) {
            if (val && (typeof val === 'object' || typeof val === 'function')) {
                if (val instanceof Promise && val.then === Promise.prototype.then) {
                    val.then(function (val) {
                        res(i, val);
                    }, reject);
                }
                return
            }
            args[i] = val;
            if (--remaining === 0) {
                resolve(args);
            }
        }
        for (var i = 0; i < args.length; i++) {
            res(i, args[i]);
        }
    })
}
Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
        reject(value);
    });
}
