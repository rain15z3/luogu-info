const chalk = require('chalk');
const fs = require('fs');
const getDate = require('./func/getDate');
const getCaller = require('./func/getCaller');
const conf = require('../conf');

function writeFileRecursive($path, $buffer, $flag, callback) {
    let lastPath = $path.substring(0, $path.lastIndexOf('/'));
    fs.mkdir(lastPath, { recursive: true }, ($err) => {
        if ($err) return callback($err);
        fs.writeFile($path, $buffer, {flag: $flag, encoding: 'utf-8'}, function ($err) {
            if ($err) return callback($err);
            return callback(null);
        });
    });
}

async function log($message) {
    writeFileRecursive(conf['log_path'], $message + '\n', 'a', ($err) => {
        if ($err) print.error(`文件写入失败: ${$err}`);
    });

    return $message;
}

module.exports = print = {
    info: ($message) => {
        let date = getDate();
        log(`[${date}][INFO][${getCaller()}] ${$message}`);
        console.log(`[${date}]${chalk.blue('[INFO]')}[${getCaller()}] ${$message}`);
    },
    warn: ($message) => {
        let date = getDate();
        log(`[${date}][WARN][${getCaller()}] ${$message}`);
        console.warn(`[${date}]${chalk.yellow(`[WARN][${getCaller()}] ` + $message)}`);
    },
    error: ($message) => {
        let date = getDate();
        log(`[${date}][ERROR][${getCaller()}] ${$message}`);
        console.error(`[${date}]${chalk.red(`[ERROR][${getCaller()}] ` + $message)}`);
    },
    fatal: ($message) => {
        let date = getDate();
        log(`[${date}][FATAL][${getCaller()}] ${$message}`);
        console.error(`[${date}]${chalk.red(`[FATAL][${getCaller()}] ` + $message)}`);
        setTimeout(() => process.exit(), 500);
    },
    success: ($message) => {
        let date = getDate();
        log(`[${date}][INFO][${getCaller()}] ${$message}`);
        console.log(`[${date}]${chalk.blue('[INFO]')}[${getCaller()}] ${chalk.green($message)}`);
    },
    message: ($message) => {
        let date = getDate();
        log(`[${date}][MESSAGE][${getCaller()}] ${$message}`);
        console.log(`[${date}]${chalk.blue('[MESSAGE]')}[${getCaller()}] ${$message}`);
    }
}
