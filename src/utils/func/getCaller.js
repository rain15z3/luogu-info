const path = require('path');

module.exports = () => {
    function getException() {
        try {
            throw Error('');
        } catch (err) {
            return err;
        }
    }

    const err = getException();
    const stack = err.stack;
    const stack_arr = stack.split('\n');

    let callerLogIndex = 0;
    for (let i = 0; i < stack_arr.length; i++) {
        if (stack_arr[i].indexOf('print.js') > 0 && i + 1 < stack_arr.length) {
            callerLogIndex = i + 1;
            break;
        }
    }

    if (callerLogIndex !== 0) {
        const callerStackLine = stack_arr[callerLogIndex];
        return `${callerStackLine.substring(callerStackLine.lastIndexOf(path.sep) + 1, callerStackLine.lastIndexOf(':'))}`;
    } else {
        return '-';
    }
}
