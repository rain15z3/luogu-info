const http = require('http')
const url = require('url')
const querystring = require('querystring')
const chalk = require('chalk')
var fs = require('fs')
var config = require('./config')

var querys = {
    'rating': '总估值',
    'contestRating': '比赛情况',
    'socialRating': '社区贡献',
    'practiceRating': '练习情况',
    'basicRating': '基础信用',
    'prizeRating': '获得成就',
    'problem0': '未评定',
    'problem1': '入门',
    'problem2': '普及-',
    'problem3': '普及/提高-',
    'problem4': '普及+/提高',
    'problem5': '提高+/省选-',
    'problem6': '省选/NOI-',
    'problem7': 'NOI/NOI+/CTSC',
    'visitor': '访客总数'
}

var port = 98
var timeout = 600000

if (process.argv[2] == null) {
    console.error(chalk.red('请传入正确的端口号后再重试'))
    process.exit()
} else if (process.argv[3] == null) {
    console.error(chalk.red('请传入正确的UID后再重试'))
    process.exit()
} else if (process.argv[4] == null) {
    console.error(chalk.red('请传入正确的Cookie后再重试'))
    process.exit()
}

port = process.argv[2]
config.uid = process.argv[3]
config.client_id = process.argv[4]

update()
setInterval(update, timeout) // 实时更新数据

function request(_request, _response) {
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
        let query_num, query_color = 'red'
        if (args['query'].match(/problem/)) { // 通过题目数量
            query_num = config.problems_num[args['query']]
            query_color = 'blue'

            // 目标
            if (args['to'] != null) {
                if (parseInt(query_num) >= parseInt(args['to']))
                    query_color = 'green'
                query_num = query_num + ' / ' + args['to']
            }
        } else if (args['query'].match(/rating/i)) { // 咕值
            query_num = config.user.rating[args['query']]
        } else if (args['query'] == 'visitor') { // 访客统计
            let data = fs.readFileSync('visitor.txt', {encoding: 'utf8'})
            data = parseInt(data) + 1
            fs.writeFileSync('visitor.txt', data.toString(), {encoding: 'utf8'})
            query_num = data


            /*fs.readFile('visitor.txt', {encoding: 'utf8', flag: 'w+'}, (_error, _data) => {
                if (_error)
                    return console.error(chalk.red(_error))
                _data = parseInt(_data) + 1
                fs.writeFileSync('visitor.txt', _data.toString(), {encoding: 'utf8', flag: 'w+'})
                query_num = _data
            })*/
        }

        require('./make/shields')(querys[args['query']], query_num, query_color).then((_data) => {
            _response.write(_data)
        }).then(() => _response.end())
    } else {
        _response.writeHead(400)
        _response.end('400 Bad Request\nType error')
    }
}

// 读取用户信息
function update() {
    require('./user')(config.uid, config.client_id).then((_config) => {
        config.user = _config[0]
        config.problems = _config[1]
        config.problems_num = _config[2]
    })
}

// 创建服务器
http.createServer(request).listen(port, (_error) => {
    if (_error) {
        console.log(chalk.red(_error))
        throw _error
    }
    console.log('[Server] 服务器正在 ' + port + ' 端口上运行...')
})
