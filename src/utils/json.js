const fs = require('fs');
const print = require('./print');

module.exports = {
    write: async ($path, $params) => {
        return await new Promise(($resolve, $reject) => {
            fs.readFile($path, ($err, $data) => {
                if ($err) return $reject($err);
                
                let person = $data.toString();
                person = JSON.parse(person);

                person[$params.user['uid']] = $params; // 插入数据

                let str = JSON.stringify(person);
                fs.writeFile($path, str, ($err) => {
                    if ($err) return $reject($err);

                    print.success('JSON写入成功');
                    return $resolve();
                });
            });
        }).catch(($err) => {
            return print.error($err);
        });
    },
    read: async ($path) => {
        return await new Promise(($resolve, $reject) => {
            fs.readFile($path, ($err, $data) => {
                if ($err) return $reject($err);

                let person = $data.toString();
                person = JSON.parse(person);

                return $resolve(person);
            })
        }).catch(($err) => {
            return print.error($err);
        })
    }
}
