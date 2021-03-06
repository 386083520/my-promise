module.exports = Promise;

function noop() {}

var IS_ERROR = {};
var LAST_ERROR = null;

function Promise(fn) {
    console.log('gsdthis', this)
    if (typeof this !== 'object') {
        throw new TypeError('Promises must be constructed via new');
    }
    if (typeof fn !== 'function') {
        throw new TypeError('Promise constructor\'s argument is not a function');
    }
    this._state = 0;
    this._value = null;
    this._deferredState = 0;
    this._deferreds = null;
    doResolve(fn, this);
}

Promise._noop = noop;

Promise.prototype.then = function(onFulfilled, onRejected) {
    var res = new Promise(noop);
    handle(this, new Handler(onFulfilled, onRejected, res));
    return res
}

function handle(self, deferred) {
    while (self._state === 3) {
        self = self._value;
    }
    if (self._state === 0) {
        if (self._deferredState === 0) {
            self._deferredState = 1;
            self._deferreds = deferred;
            return
        }
        if (self._deferredState === 1) {
            return;
        }
        self._deferreds.push(deferred);
        return;
    }
    handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
    setTimeout(() => {
        var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
            if (self._state === 1) {
                resolve(deferred.promise, self._value);
            }else {
                reject(deferred.promise, self._value);
            }
            return
        }
        var ret = tryCallOne(cb, self._value);
        if (ret === IS_ERROR) {
            reject(deferred.promise, LAST_ERROR);
        }else {
            resolve(deferred.promise, ret);
        }
    }, 0)
}

function Handler(onFulfilled, onRejected, promise){
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
}

function resolve(self, newValue) {
    if (
        newValue &&
        (typeof newValue === 'object' || typeof newValue === 'function')
    ) {
        var then = getThen(newValue);
        if (
            then === self.then &&
            newValue instanceof Promise
        ) {
            self._state = 3;
            self._value = newValue;
            finale(self);
            return;
        }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
}

function getThen(obj) {
    try {
        return obj.then;
    } catch (ex) {

    }
}

function finale(self) {
    if (self._deferredState === 1) {
        handle(self, self._deferreds);
    }
}

function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
}

function doResolve(fn, promise) {
    var done = false;
    var res = tryCallTwo(fn, function (value) {
        if (done) return;
        done = true;
        resolve(promise, value);
    }, function (reason) {
        if (done) return;
        done = true;
        reject(promise, reason);
    })
    if (!done && res === IS_ERROR) {
        done = true;
        reject(promise, LAST_ERROR);
    }
}

function tryCallOne(fn, a) {
    try {
        return fn(a);
    } catch (ex) {
        LAST_ERROR = ex;
        return IS_ERROR;
    }
}

function tryCallTwo(fn, a, b) {
    try {
        fn(a, b);
    } catch (ex) {
        LAST_ERROR = ex;
        return IS_ERROR;
    }
}
