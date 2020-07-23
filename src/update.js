const fs = require('fs');
const print = require('./utils/print');
const user = require('./user');
let conf = require('./conf');

module.exports = async () => {
    let length = Object.keys(conf.users).length, total = 1;
    for (let index in conf.users) {
        print.info(`正在更新用户数据[${total++}/${length}]`);
        let uid = conf.users[index].user['uid'], cookie = conf.users[index]['cookie'];

        // 获取用户数据
        try {
            let data = await user.getInfo(uid, cookie, false);
            conf.users[uid] = data;
            print.success(`用户: ${data.user['name']}(${data.user['uid']})`);
        } catch ($err) {
            print.error($err);
        }
    }

    // 文件存储
    try {
        if (conf.users == null)
            throw '文件写入失败';

        fs.writeFile('./users.json', JSON.stringify(conf.users), { flag: 'w+' }, ($err) => {
            if ($err) print.error($err);
            print.success('文件写入成功');
        }); // TODO: 优化性能
    } catch ($err) {
        print.error($err);
    }
}
