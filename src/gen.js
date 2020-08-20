const fs = require('fs');
const conf = require('./conf');
const print = require('./utils/print');
const json = require('./utils/json');

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
            let visitor = await json.read('./visitor.json');

            if ($data.user['uid'] in visitor) {
                visitor[$data.user['uid']] = parseInt(visitor[$data.user['uid']]) + 1;
            } else {
                visitor[$data.user['uid']] = 1;
            }

            query_num = visitor[$data.user['uid']];
            await json.insert('./visitor.json', visitor[$data.user['uid']], $data.user['uid']);
        } catch ($err) {
            print.error($err);
        }
    }

    if ('fast' in $args) {
        return require('shields-less').svg({
            leftText: conf.querys[$args['query']].toString(),
            rightText: query_num.toString(),
            style: 'squre'
        });
    } else {
        return await require('./make/shields')(conf.querys[$args['query']], query_num, query_color);
    }
}
