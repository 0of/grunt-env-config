module.exports = function (grunt) {
    grunt.initConfig({
        eslint: {
            target: {
                src: ['index.js', 'test/*.js']
            }
        },
        testGruntfile: {
            target: {
                src: ['./test/gruntfile.js']
            }
        }
    });

    grunt.registerMultiTask('testGruntfile', 'Run test sub-gruntfile', function () {
        var path = require('path');
        grunt.util.async.forEachSeries(this.filesSrc, function (gruntfile, next) {
            grunt.log.write('Loading ' + gruntfile + '...');
            grunt.util.spawn({
                grunt: true,
                args: ['--gruntfile', path.resolve(gruntfile)],
            }, function (error, result) {
                if (error) {
                    grunt.log.error().error(result.stdout).writeln();
                    next(new Error('Error running sub-gruntfile "' + gruntfile + '".'));
                } else {
                    grunt.log.ok().verbose.ok(result.stdout);
                    next();
                }
            });
        }, this.async());
    });

    grunt.registerTask('test', ['eslint', 'testGruntfile']);

    grunt.loadNpmTasks('grunt-eslint');
};