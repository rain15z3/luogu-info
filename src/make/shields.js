const https = require('https')
const chalk = require('chalk')

module.exports = (_label, _message, _color) => {
    return new Promise((resolve, reject) => {
        console.log('[Shields] 正在生成小盾牌: ' + chalk.yellow(_label) + ' | ' + chalk.green(_message))

        let url = `https://img.shields.io/static/v1?label=${_label}&message=${_message}&color=${_color}&style=for-the-badge`
        let data = ''

        // 获取图片
        https.get(url, (_response) => {
            _response.on('data', (_data) => {
                data += _data.toString()
            })

            _response.on('end', () => {
                console.log(chalk.green('[Shields] 生成成功'))
                resolve(data)
            })
        }).on('error', (_error) => {
            reject(_error.message)
            console.error(chalk.red('[Shields] 生成图标失败\n' + _error))
        })
    })
}
