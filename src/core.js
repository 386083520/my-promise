module.exports = Promise;
function Promise(fn) {
    this._state = 0;
    this._value = null;
    doResolve(fn, this);
}

function doResolve(fn, promise) {
    var res = tryCallTwo(fn, function (value) {
        console.log('gsdresolve', value)
    }, function (reason) {
        console.log('gsdreject', reason)
    })
}

function tryCallTwo(fn, a, b) {
    try {
        fn(a, b);
    } catch (ex) {

    }
}
