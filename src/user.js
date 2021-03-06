const https = require('https');
const urlencode = require('urlencode');
const print = require('./utils/print');
const userAgents = require('./utils/userAgents');

module.exports = {
    getInfo: async ($uid, $client_id, $guest, $response) => {
        return await new Promise(($resolve, $reject) => {
            let options = {
                hostname: 'www.luogu.com.cn',
                path: '/user/' + $uid,
                headers: {
                    'User-Agent': userAgents[parseInt(Math.random() * userAgents.length)],
                    'Cookie': '__client_id=' + $client_id + '; _uid=' + $uid
                }
            }

            https.get(options, ($res) => {
                let data = '';
                let reg = /"%(.*)"/g;

                $res.on('data', ($chunk) => {
                    data += $chunk;
                });

                $res.on('end', () => {
                    // 处理数据
                    data = data.match(reg)[0];
                    data = data.replace(/"/g, '');
                    data = urlencode.decode(data, 'gbk');
                    data = JSON.parse(data);

                    if (data.code != 200) {
                        return $reject('获取JSON失败，状态码非200');
                    }

                    if (!('rating' in data.currentData.user) && !$guest) {
                        return $reject('Cookie已过期，请及时更换');
                    }

                    // 统计题目难度
                    let difficulty = {
                        problem0: 0,
                        problem1: 0,
                        problem2: 0,
                        problem3: 0,
                        problem4: 0,
                        problem5: 0,
                        problem6: 0,
                        problem7: 0,
                    }

                    for (let problem of data.currentData['passedProblems']) {
                        difficulty['problem' + problem['difficulty']]++;
                    }

                    let returnObj = {};
                    if (!$guest) {
                        // 处理返回数据
                        returnObj = {
                            user: data.currentData.user.rating['user'],
                            rating: data.currentData.user['rating'],
                            passedProblems: difficulty,
                            cookie: $client_id
                        }

                        returnObj['followingCount'] = data.currentData.user['followingCount'];
                        returnObj['followerCount'] = data.currentData.user['followerCount'];
                        returnObj['passedProblemCount'] = data.currentData.user['passedProblemCount'];
                        returnObj['submittedProblemCount'] = data.currentData.user['submittedProblemCount'];
                        delete returnObj.rating.user;
                    } else {
                        returnObj = {
                            user: data.currentData.user,
                            passedProblems: difficulty
                        }

                        delete returnObj.user.introduction;
                    }

                    return $resolve(returnObj);
                });
            }).on('error', ($err) => {
                return $reject(`获取JSON失败: ${$err.message}`);
            });
        }).catch(($err) => {
            if ($response)
                require('./server').response($response, 403, $err);
            return print.error($err);
        });
    }
}