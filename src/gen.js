const fs = require('fs');
const conf = require('./conf');
const print = require('./utils/print');

module.exports = async ($data, $args) => {
    let query_num, query_color = 'red';

    if ($args['query'].match(/problem/)) { // 通过题目数量
        query_num = $data.passedProblems[$args['query']];
        query_color = 'blue';

        // 目标数量
        if ($args['to'] != null) {
            if (parseInt(query_num) >= parseInt($args['to']))
                query_color = 'green';
            query_num = `${query_num} / ${$args['to']}`;
        }
    } else if ($args['query'].match(/rating/i)) { // 咕值
        query_num = $data.rating[$args['query']];
    } else if ($args['query'].match(/passedProblemCount/) ||// 通过数量
        $args['query'].match(/submittedProblemCount/) ||    // 提交数量
        $args['query'].match(/followerCount/) ||            // 粉丝数量
        $args['query'].match(/followingCount/)) {           // 关注数量
        query_num = $data[$args['query']];
    } else if ($args['query'].match(/ac/)) { // AC率
        let ac = parseFloat($data['passedProblemCount']) / parseFloat($data['submittedProblemCount']);
        ac *= 100;
        ac = ac.toFixed(2);
        query_num = ac + '%';
    } else if ($args['query'].match(/passedProblems/)) {
        query_num = $data.rating[$args['query']];
    } else if ($args['query'] == 'visitor') { // 访客统计
        try {
            let visitor = require('../visitor.json');

            if ($data.user['uid'] in visitor) {
                visitor[$data.user['uid']] = parseInt(visitor[$data.user['uid']]) + 1;
            } else {
                visitor[$data.user['uid']] = 1;
            }

            query_num = visitor[$data.user['uid']];
            fs.writeFile('./visitor.json', JSON.stringify(visitor), { flag: 'w+' }, () => {
                print.success('写入文件成功');
            }); // TODO: 优化性能
        } catch ($err) {
            print.error($err);
        }
    }

    // 生成图片
    // TODO: 自己实现
    try {
        return await require('./make/shields')(conf.querys[$args['query']], query_num, query_color);
    } catch ($err) {
        print.error($err);
    }
}
