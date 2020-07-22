const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const print = require('./utils/print');
const user = require('./user');
let conf = require('./conf');

let res; // 响应数据

function response(code, message) {
    message = message || '';
    res.writeHead(code, {'Content-Type': 'text/plain; charset=utf-8'});
    switch (code) {
        case 400:
            res.end(`400 Bad Request\n${message}`);
            break;
        case 401:
            res.end(`401 Unauthorized\n${message}`);
            break;
        case 403:
            res.end(`403 Forbidden\n${message}`);
            break;
        case 404:
            res.end(`404 Not Found\n${message}`);
            break;
        case 500:
            res.end(`500 Internal Server Error\n${message}`);
            break;
        case 504:
            res.end(`504 Gateway Timeout\n${message}`);
            break;
    }
}

// 创建服务器
http.createServer(async ($req, $res) => {
    res = $res;
    print.info(`接受请求: ${$req.url}`);
    let args = querystring.parse(url.parse($req.url).query); // 获取参数

    if ('uid' in args) {
        if ($req.url.match(/register/)) { // 注册用户
            if ('cookie' in args) { // TODO: 动态获取
                // 获取用户数据
                try {
                    let data = await user.getInfo(args['uid'], args['cookie'], $res);
                    conf.users[args['uid']] = data;
                    print.info(`注册用户: ${data.user['name']}(${data.user['uid']})`);
                } catch ($err) {
                    print.error($err);
                }

                // 文件存储
                try {
                    if ('save' in args && args['save'] == 'true') {
                        fs.writeFile('./users.json', JSON.stringify(conf.users), { flag: 'w+' }, () => {
                            print.success('写入文件成功');
                        }); // TODO: 优化性能
                    }
                } catch ($err) {
                    print.error($err);
                }

                $res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                $res.end(`注册用户成功，请通过/gen?uid=xxx&query=xxx的方式进行图片生成`);
            }
        } else if ($req.url.match(/gen/) && 'query' in args) { // 生成徽章
            if (conf.users[args['uid']] != null && args['query'] in conf.querys) {
                $res.writeHead(200, { 'Content-Type': 'image/svg+xml; charset=utf-8' });

                // 生成小徽章
                let user_data = conf.users[args['uid']];
                print.info(`用户: ${user_data.user['name']}(${user_data.user['uid']})`);
                let svg = await require('./gen')(user_data, args);

                $res.write(svg);
                $res.end();
            } else {
                print.error('用户未注册');
                response(403, '用户未注册，请先通过/register?uid=xxx&cookie=xxx&&save=true的方式注册用户');
            }
        } else {
            response(400);
        }
    } else {
        response(400);
    }
}).listen(conf.port, () => {
    print.success(`服务器在 ${conf.port} 端口上运行...`);
});
