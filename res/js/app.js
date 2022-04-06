window.downloads = {
    android: 'https://wwi.lanzoux.com/ii3cDnelvva',
    windows: 'https://wwe.lanzoux.com/i4ZDUfwxs3g',
    linux: 'https://wwe.lanzoux.com/iom0Bfwxt9i',
    mac: 'https://wwe.lanzoux.com/iKnR4fwxs0d',
}
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

function loadLanguage(onOk) {
    var lang = navigator.language.replace('_', '-')
    var base = subBefore(lang, '-', lang)
    var region = subAfter(lang, '-', '')
    if (region) {
        lang = base + '-' + region.toUpperCase()
    } else {
        lang = base
    }

    var found = checkLanguage(lang)
    if (found) {
        lang = found
    } else {
        found = checkLanguage(base)
        if (found) {
            lang = base
        } else {
            lang = 'en'
        }
    }
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function (e) {
        if (this.readyState == 4 && xhr.status == 200) {
            onOk(JSON.parse(xhr.responseText))
        }
    }
    xhr.open('GET', '/res/lang/' + lang + '.json')
    xhr.send()
}

function checkLanguage(lang) {
    var supported = [
        'en',
        'zh',
        'zh-TW',
        'zh-HK',
        'ru',
        'de',
        'fr',
        'ja',
        'ko',
        'es'
    ]
    for (var i = 0; i < supported.length; i++) {
        if (supported[i] == lang) {
            return lang
        }
    }
    return ''
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