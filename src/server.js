const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const print = require('./utils/print');
const json = require('./utils/json');
const user = require('./user');
let conf = require('./conf');

module.exports = server = {
    response: ($res, $code, $message) => {
        $message = $message || '';
        try {
            $res.writeHead($code, { 'Content-Type': 'text/plain; charset=utf-8' });
            switch ($code) {
                case 400:
                    $res.end(`400 Bad Request\n${$message}`);
                    break;
                case 401:
                    $res.end(`401 Unauthorized\n${$message}`);
                    break;
                case 403:
                    $res.end(`403 Forbidden\n${$message}`);
                    break;
                case 404:
                    $res.end(`404 Not Found\n${$message}`);
                    break;
                case 500:
                    $res.end(`500 Internal Server Error\n${$message}`);
                    break;
                case 504:
                    $res.end(`504 Gateway Timeout\n${$message}`);
                    break;
            }
        } catch ($err) {
            print.error($err);
        }
    },
    run: () => {
        // 创建服务器
        http.createServer(async ($req, $res) => {
            print.info(`接受请求: ${$req.url}`);
            let args = querystring.parse(url.parse($req.url).query); // 获取参数

            if ('uid' in args) {
                if ($req.url.match(/register/)) { // 注册用户
                    if ('cookie' in args) {
                        // 获取用户数据
                        let data = await user.getInfo(args['uid'], args['cookie'], false, $res);
                        if (data) {
                            conf.users[args['uid']] = data;
                            print.success(`注册用户: ${data.user['name']}(${data.user['uid']})`);
                            $res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                            $res.end(`注册用户成功，请通过/gen?uid=xxx&query=xxx的方式进行图片生成`);

                            // 文件存储
                            try {
                                await json.write('./users.json', data);
                            } catch ($err) {
                                print.error($err);
                            }
                        }
                    }
                } else if ($req.url.match(/gen/) && 'query' in args) { // 生成徽章
                    if (args['query'] in conf.querys) {
                        let identity = '用户';

                        // Guest
                        if (conf.users[args['uid']] == null) {
                            let data = await user.getInfo(args['uid'], null, true, $res);
                            conf.users[args['uid']] = data;
                            identity = '访客'
                        }

                        // 设置缓存
                        if (args['query'] != 'visitor') {
                            $res.setHeader('Expires', new Date(Date.now() + 60 * 60 * 1000).toGMTString());
                            $res.setHeader('Cache-Control', 'max-age=3600');
                        }

                        $res.writeHead(200, { 'Content-Type': 'image/svg+xml; charset=utf-8' });

                        // 生成小徽章
                        let user_data = conf.users[args['uid']];
                        print.success(`${identity}: ${user_data.user['name']}(${user_data.user['uid']})`);

                        try {
                            let svg = await require('./gen')(user_data, args);
                            $res.write(svg);
                        } catch ($err) {
                            print.error($err);
                        }

                        $res.end();
                    } else {
                        server.response($res, 400, '请求的方式不支持');
                    }
                } else {
                    server.response($res, 400);
                }
            } else {
                server.response($res, 400);
            }
        }).listen(conf.port, () => {
            print.success(`服务器在 ${conf.port} 端口上运行...`);
        });
    }
}
