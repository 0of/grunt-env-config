// gruntfile.js
module.exports = function (grunt) {
    grunt.initConfig({
        // grunt-env
        // config the env variables
        env: {
            dev: {
                BUILD_MODE: 'debug'
            },
            prod: {
                BUILD_MODE: 'release'
            }
        },
        // your task config
        // the fake task is used to illustrate the usages of the `$require` template
        task: {
            // require from 'task.ref' => './external-config.js'
            options: '<%= $require.task.ref %>',
            ref: './external-config.js'
        }
    });

    // enable env config
    // you must call this before use the templates
    require('grunt-env-config')(grunt);
    require('load-grunt-tasks')(grunt);
};