const https = require('https');
const print = require('../utils/print');

module.exports = async ($label, $message, $color) => {
    return await new Promise(($resolve, $reject) => {
        print.info(`正在生成小徽章: ${$label} | ${$message}`);

        let url = `https://img.shields.io/static/v1?label=${$label}&message=${$message}&color=${$color}&style=for-the-badge`;
        let data = '';

        // 获取图片
        try {
            https.get(url, ($res) => {
                $res.on('data', ($chunk) => {
                    data += $chunk.toString();
                });

                $res.on('end', () => {
                    print.success(`生成成功`);
                    return $resolve(data);
                });
            }).on('error', ($error) => {
                $reject($error.message);
            });
        } catch ($err) {
            return print.error($err);
        }
    })
}
