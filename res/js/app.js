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

function apiRequest(method,uri,req,onOk,onFail,eventually){
    var xhr=new XMLHttpRequest()
    xhr.onreadystatechange=function(e){
        if(this.readyState!=4){
            return;
        }
        if(this.status==200){
            var body={};
            try{
                body=JSON.parse(this.responseText);
            }catch(e){}
            onOk(body)
        }else{
            onFail(this.responseText)
        }
        if(eventually){
            eventually()
        }
    }
    xhr.open(method,'https://6c0dfa5380a44263b06be93336628683.apig.cn-south-1.huaweicloudapis.com/https2http');
    xhr.setRequestHeader('uri',uri);
    xhr.setRequestHeader('Content-Type','application/json; charset=utf-8');
    if(req){
        req=JSON.stringify(req);
    }
    xhr.send(req);
}

function apiPublicPrices(onOk,onFail,eventually){
    apiRequest('GET','/api-v5/public/prices',null,{
        gl:navigator.language
    },onOk,onFail,eventually)
}

function apiLatestReleases(onOk,onFail,eventually){
    apiRequest('GET','/api-v5/public/latest-release',{
        gl:navigator.language
    },onOk,onFail,eventually)
}