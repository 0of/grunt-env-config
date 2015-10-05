var path = require('path'),
    assert = require('assert');

var enableEnvConfig = require('../index');

module.exports = function (grunt) {

    var simpleObjPath = path.join(__dirname, './fixtures/simple-obj.js');

    grunt.initConfig({
        templateRequire: {
            options: {
                a: '<%= $require.templateRequire.ref %>'
            },
            ref: simpleObjPath
        },
        envTemplateHelper: {
            options: {
                a: '<%= grunt.template.env("a") %>'
            }
        },
        throughTemplateHelper: {
            options: {
                a: '<%= grunt.template.through(process.env.a) %>'
            }
        }
    });

    grunt.registerTask('templateRequire', 'should require successfully', function () {
        var opts = this.options(),
            simpleObj = require(simpleObjPath);

        assert.deepEqual(simpleObj, opts.a);
    });

    grunt.registerTask('envTemplateHelper', 'should access the env variable successfully', envTest);

    grunt.registerTask('throughTemplateHelper', 'should access the env variable successfully', envTest);

    grunt.registerTask('test', ['templateRequire', 'envTemplateHelper', 'throughTemplateHelper']);

    grunt.registerTask('default', 'test');

    function envTest () {
        var simpleObj = JSON.stringify(require(simpleObjPath));
        var opts;

        process.env.a = simpleObj;
        try {
            opts = this.options();
        } catch (e) {
            delete process.env.a;
            throw e;
        }

        assert.equal(simpleObj, opts.a);
        delete process.env.a;
    }

    enableEnvConfig(grunt);
};

