const https = require('https')
const urlencode = require('urlencode')
const chalk = require('chalk')
const userAgents = require('./userAgents')

module.exports = (_uid, _client_id) => {
    return new Promise((resolve, reject) => {
        let options = {
            hostname: 'www.luogu.com.cn',
            path: '/user/' + _uid,
            headers: {
                'User-Agent': userAgents[parseInt(Math.random() * userAgents.length)],
                'Cookie': '__client_id=' + _client_id + '; _uid=' + _uid
            }
        }

        console.log('[User] 正在获取用户信息...\nUID: ' + _uid)
    
        // 获取数据
        https.get(options, (_response) => {
            let data = ''
            let reg = /"%(.*)"/g
    
            _response.on('data', (_data) => {
                data += _data.toString()
            })
    
            _response.on('end', () => {
                data = data.match(reg)[0]
                data = data.replace(/"/g, '')
                data = urlencode.decode(data, 'gbk')
                data = JSON.parse(data)
    
                if (data['code'] == 200) {
                    try {
                        // 通过题目难度统计
                        let problems_num = {
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
                            problems_num['problem' + problem['difficulty']]++
                        }

                        console.log('[User] 用户名: ' + data.currentData.user['name'])
                        resolve([data.currentData['user'], data.currentData['passedProblems'], problems_num])
                        return
                    } catch (_error) {
                        console.error(chalk.red('[User] 获取用户信息失败，可能是cookie过期或无效\n' +  _error))
                        reject(_error)
                        return
                    }
                } else {
                    console.error(chalk.red('[User] 获取用户信息失败，状态码' + data['code']))
                    reject()
                    return
                }
            })
    
        }).on('error', (_error) => {
            console.error(chalk.red('[User] 获取用户数据失败\n' + _error))
            reject(_error.message)
            return
        })
    
    })
}
