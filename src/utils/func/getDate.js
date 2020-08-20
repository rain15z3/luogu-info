module.exports = ($format = 'yyyy-MM-dd hh:mm:ss.S') => {
    let date = new Date();
    
    let options = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'S': date.getMilliseconds()
    };

    if (/(y+)/.test($format))
        $format = $format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));

    for (var k in options) {
        if (new RegExp('(' + k + ')').test($format)) {
            $format = $format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (options[k]) : (('00' + options[k]).substr(('' + options[k]).length)));
        }
    }
    
    return $format;
}
