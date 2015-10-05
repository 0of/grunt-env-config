var path = require('path'),
    assert = require('assert');

var enableEnvConfig = require('../index');

module.exports = function (grunt) {

    var simpleObjPath = path.join(__dirname, './fixtures/simple-obj.js'),
        nestingRequirePath = path.join(__dirname, './fixtures/nesting-require-obj.js'),
        conditionalRequirePath = path.join(__dirname, './fixtures/cond-require-obj.js');

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
        },
        nestingTemplateRequire: {
            options: {
                a: '<%= $require.nestingTemplateRequire.nestingRef %>'
            },
            nestingRef: nestingRequirePath,
            ref: simpleObjPath
        },
        conditionalTemplateRequire: {
            options: {
                a: '<%= $require.conditionalTemplateRequire.ref %>'
            },
            ref: conditionalRequirePath
        }
    });

    grunt.registerTask('templateRequire', 'should require successfully', function () {
        var opts = this.options(),
            simpleObj = require(simpleObjPath);

        assert.deepEqual(simpleObj, opts.a);
    });

    grunt.registerTask('nestingTemplateRequire', 'should nesting require successfully', function () {
        var opts = this.options(),
            simpleObj = require(simpleObjPath);

        assert.deepEqual(simpleObj, opts.a.nesting);
    });

    grunt.registerTask('conditionalTemplateRequire', 'should conditionally require successfully', function () {
        var opts,
            simpleObj = require(simpleObjPath);
        
        process.env.cond = 'require-simple';
        try {
            opts = this.options();
        } catch (e) {
            delete process.env.cond;
            throw e;
        }

        assert.deepEqual(simpleObj, opts.a);
        delete process.env.cond;
    });

    grunt.registerTask('envTemplateHelper', 'should access the env variable successfully', envTest);

    grunt.registerTask('throughTemplateHelper', 'should access the env variable successfully', envTest);

    grunt.registerTask('test', ['templateRequire',
                                'envTemplateHelper',
                                'throughTemplateHelper',
                                'nestingTemplateRequire',
                                'conditionalTemplateRequire']);

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

