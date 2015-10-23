var VersionIterable = require('ver-iterator');

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

    grunt.registerMultiTask('verIterator', '', function () {
        var opts = this.options(),
            task = opts.task.bind(this);

        var iter = new VersionIterable(task, {name: opts.name, range: opts.range});
        iter.on('beforeEach', function (ver) { grunt.log.writeln('before running task for version [' + ver + ']...'); })
        iter.on('afterEach', function (ver) { grunt.log.writeln('after running task for version [' + ver + ']...'); grunt.log.writeln(); })
        iter.on('fatal', function (e) { grunt.log.errorln('fatal error occurred:' + e); });
        iter.on('failed', function (e) { grunt.log.errorln('task error occurred:' + e); })

        for (var each of iter) {
            if (each) {
                grunt.log.ok('Running task OK');
            }
        }
    })

    grunt.registerTask('test', ['eslint', 'verIterator:test']);

    grunt.loadNpmTasks('grunt-eslint');

    // sync spawn
    function runGruntfile() {
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
};

