module.exports = Promise;

function noop() {}

var IS_ERROR = {};

function Promise(fn) {
    this._state = 0;
    this._value = null;
    doResolve(fn, this);
}

Promise.prototype.then = function(onFulfilled, onRejected) {
    var res = new Promise(noop);
    handle(this, new Handler(onFulfilled, onRejected, res));
    return res
}

function handle(self, deferred) {
    handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    var ret = tryCallOne(cb, self._value);
    if (ret === IS_ERROR) {

    }else {
        resolve(deferred.promise, ret);
    }
}

function Handler(onFulfilled, onRejected, promise){
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
    this.promise = promise;
}

function resolve(self, newValue) {
    self._state = 1;
    self._value = newValue;
}

function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
}

function doResolve(fn, promise) {
    var res = tryCallTwo(fn, function (value) {
        console.log('gsdresolve', value)
        resolve(promise, value);
    }, function (reason) {
        console.log('gsdreject', reason)
        reject(promise, reason);
    })
}

function tryCallOne(fn, a) {
    try {
        return fn(a);
    } catch (ex) {

    }
}

function tryCallTwo(fn, a, b) {
    try {
        fn(a, b);
    } catch (ex) {

    }
}
