const chalk = require('chalk')
const http = require('http')
const url = require('url')
const querystring = require('querystring')
var config = require('./config')

var querys = {
    'rating': '总估值',
    'contestRating': '练习情况',
    'socialRating': '社区贡献',
    'practiceRating': '比赛情况',
    'basicRating': '基础信用',
    'prizeRating': '获得成就',
}

// 获取端口号
var port = 98
//if (process.argv.splice(2)[0] != null)
//    port = process.argv.splice(2)[0]

// 读取用户信息
require('./user')(config.uid, config.client_id).then((_config) => {
    config.user = _config

    // 创建服务器
    http.createServer((_request, _response) => {
        console.log('[Server] URL: ' + _request.url)
        let args = querystring.parse(url.parse(_request.url).query) // 获取参数

        if (!_request.url.match(/gen/)) {
            _response.writeHead(404)
            _response.end('404 Not Found')
        } else if (args['query'] == null) {
            _response.writeHead(400)
            _response.end('400 Bad Request')
        } else if (args['query'] in querys) {
            _response.writeHead(200, { 'Content-Type': 'image/svg+xml;charset=utf-8' })

            // 生成小盾牌
            require('./make/shields')(querys[args['query']], config.user.rating[args['query']], 'red').then((_data) => {
                _response.write(_data)
            }).then(() => _response.end())
        } else {
            _response.writeHead(400)
            _response.end('400 Bad Request\nType error')
        }
    }).listen(port, (_error) => {
        if (_error)
            throw _error
        console.log('[Server] 服务器正在 ' + port + ' 端口上运行...')
    })

})
