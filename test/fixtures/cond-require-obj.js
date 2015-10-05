if (process.env.cond == 'require-simple') {
    module.exports = require('./simple-obj');
} else {
    // empty
    module.exports = {};
}