module.exports = function (grunt) {
    grunt.initConfig({
        eslint: {
            target: {
                src: ['index.js', 'test/*.js', 'example/*.js']
            }
        },
        testGruntfile: {
            target: {
                src: ['./test/gruntfile.js']
            }
        },
        verIterator: {
            test: {
                options: {
                    name: 'grunt',
                    range: '>=0.4.0',
                    task: runGruntfile
                },
                src: ['./test/gruntfile.js']
            }
        }
    });

    grunt.registerTask('test', ['eslint', 'verIterator:test']);

    // sync spawn
    function runGruntfile () {
        var path = require('path'),
            child = require('child_process');

        this.filesSrc.forEach(function (gruntfile) {
            grunt.log.writeln('Loading ' + gruntfile + '...');

            var cmd = process.execPath,
                args = process.execArgv.concat(process.argv[1], ['--gruntfile', path.resolve(gruntfile)]);

            var result = child.spawnSync(cmd, args);
            if (result.error) {
                grunt.log.error(result.stdout);
            } else {
                grunt.log.ok(result.stdout);
            }
        })
    }

    require('load-grunt-tasks')(grunt);
};

