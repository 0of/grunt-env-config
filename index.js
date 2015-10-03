module.exports = enableEnvConfig;

function enableEnvConfig (grunt) {
    var getRaw = grunt.config.getRaw;

    grunt.config.getRaw = function getRawWrapper (prop) {
        if (prop) {
            prop = grunt.config.getPropString(prop);
            var matched = prop.match(/^\$require\.([a-z0-9_$]+(?:\.[a-z0-9_$]+)*)$/i);
            if (matched) {
                var path = grunt.config.get(matched[1]);
                return require(path);
            }
        }

        return getRaw.call(this, prop);
    };

    grunt.template.env = function (env) {
        if (typeof env !== 'string' && !(env instanceof String)) throw new TypeError('template.env expects string formated property');

        var obj = process.env;
        env.replace(/([^\\])\./g, '$1\u000E').split('\u000E').forEach(function (prop) {
            obj = obj[prop];
        });

        return obj;
    };

    grunt.template.through = function (obj) {
        if (typeof obj === 'object') {
            return JSON.stringify(obj);
        }

        return obj;
    };
}
