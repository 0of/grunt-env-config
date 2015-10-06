// required from require-example.js
// the configurations of the task defined in require-example.js will be altered under different build mode
if (process.env.BUILD_MODE == 'debug') {
    module.exports = {
        debug: true,
        flags: 'verbose'
    };
} else if (process.env.BUILD_MODE == 'release') {
    module.exports = {
        debug: false,
        uglify: true
    };
}