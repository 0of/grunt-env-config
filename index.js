module.exports = enableEnvConfig;

function enableEnvConfig (grunt) {
    var getRaw = grunt.config.getRaw;

    grunt.config.getRaw = function getRawWrapper (prop) {
        if (prop) {
            prop = grunt.config.getPropString(prop);

            var required = propRequire(prop, /^\$require\.([a-z0-9_$]+(?:\.[a-z0-9_$]+)*)$/i);
            if (required) {
                return required;
            } else {
                var obj = grunt.config.data
                    , eachProp = undefined
                    , props = splitByDot(prop);

                while ((eachProp = props.shift()) !== undefined && eachProp.length) {
                    obj = obj[eachProp];
                    // when not match the `$require` pattern, behave as `grunt.config.getRaw`
                    if (typeof obj === 'string' || obj instanceof String) {
                        required = propRequire(obj, /^<%=\s*\$require\.([a-z0-9_$]+(?:\.[a-z0-9_$]+)*)\s*%>$/i);
                        // recursively template requiring is not supported
                        obj = required ? required : obj;
                    }

                    if (typeof obj !== 'object') {
                        break;
                    }
                }

                return obj;
            }
        }

        return getRaw.apply(this, arguments);
    };

    grunt.template.env = function (env) {
        if (typeof env !== 'string' && !(env instanceof String)) throw new TypeError('template.env expects string formated property');

        var obj = process.env;
        splitByDot(env).forEach(function (prop) {
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

    function propRequire (prop, regExpr) {
        var matched = prop.match(regExpr);
        if (matched) {
            var path = grunt.config.get(matched[1]);
            grunt.log.writeln('$require:' + path);
            return require(path);
        }
    }

    function splitByDot (str) {
        return str.replace(/([^\\])\./g, '$1\u000E').split('\u000E');
    }
}
