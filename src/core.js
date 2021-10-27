module.exports = Promise;
function Promise(fn) {
    this._state = 0;
    this._value = null;
    doResolve(fn, this);
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

function tryCallTwo(fn, a, b) {
    try {
        fn(a, b);
    } catch (ex) {

    }
}
