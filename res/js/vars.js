window.downloads = {
    android: 'https://wwi.lanzous.com/igVL2lpzi3c',
    windows: 'https://wwe.lanzous.com/i4ZDUfwxs3g',
    linux: 'https://wwe.lanzous.com/iom0Bfwxt9i',
    mac: 'https://wwe.lanzous.com/iKnR4fwxs0d',
}

function changeLanguage(me) {
    switch (me.value) {
        case 'en':
            location.href = '/en/index.html';
            break;
        case 'zh':
            location.href = '/index.html';
            break;
    }
    localStorage.setItem('language','select')
}
