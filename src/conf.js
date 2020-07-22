const getDate = require('./utils/func/getDate');
const config = require('../config.json');
const users = require('../users.json'); // 用户数据

module.exports = {
    users: users,
    port: config['port'] || 98,
    timeout: config['timeout'] || 7200000,
    log_path: `logs/${getDate('yyyyMMddhhmmss')}.log`,
    querys: {
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
        'visitor': '访客总数',
        'ac': 'AC率',
        'passedProblemCount': '通过数量',
        'submittedProblemCount': '提交数量',
        'followerCount': '粉丝',
        'followingCount': '关注'
    }
}
