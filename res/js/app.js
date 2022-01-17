function subBefore(s, sep, def) {
    for (var i = 0; i <= s.length - sep.length; i++) {
        if (s.substring(i, i + sep.length) == sep) {
            return s.substring(0, i)
        }
    }
    return def
}

function subAfter(s, sep, def) {
    for (var i = 0; i <= s.length - sep.length; i++) {
        if (s.substring(i, i + sep.length) == sep) {
            return s.substring(i + sep.length)
        }
    }
    return def
}

function parseQuery(url) {
    var m = {};
    var query = subAfter(url, '?', '');
    if (query == '') {
        return m;
    }
    var pairs = query.split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i]
        var key = subBefore(pair, '=', '');
        if (key == '') {
            continue
        }
        key = decodeURIComponent(key);

        var value = subAfter(pair, '=', '');
        if (value == '') {
            continue
        }
        value = decodeURIComponent(value)
        m[key] = value
    }
    return m;
}