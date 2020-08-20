const print = require('./utils/print');
const conf = require('./conf');

try {
    require('./server').run(); // 创建服务器
    setInterval(require('./update'), conf['timeout']); // 更新用户数据
} catch ($err) {
    print.error($err);
}

