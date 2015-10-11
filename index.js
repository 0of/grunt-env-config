module.exports = enableEnvConfig;

/**
 * enable env config
 *
 * @param {Object}[grunt] grunt object
 * @param {Object} [opts]
 * @param {Boolean} [options.cache] replace $require template string by required result
 * @public
 */
function enableEnvConfig (grunt, opts) {
    var options = opts || {};
    var cacheConfig = options.cache;

    var getRaw = grunt.config.getRaw;

    grunt.config.getRaw = function getRawWrapper (prop) {
        if (prop) {
            prop = grunt.config.getPropString(prop);

            var required = propRequire(prop, /^\$require\.([a-z0-9_$]+(?:\.[a-z0-9_$]+)*)$/i);
            if (required) {
                return required;
            } else {
                return preprocessForEach(prop.replace(/([^\\])\./g, '$1\u000E').split('\u000E'), function preprocessEach (obj) {
                    // when not match the `$require` pattern, behave as `grunt.config.getRaw`
                    if (typeof obj === 'string' || obj instanceof String) {
                        var required = propRequire(obj, /^<%=\s*\$require\.([a-z0-9_$]+(?:\.[a-z0-9_$]+)*)\s*%>$/i);
                        // recursively template requiring is not supported
                        obj = required ? required : obj;
                    }

                    return obj;
                });
            }
        }

        return getRaw.apply(this, arguments);
    };

    function preprocessForEach (props, fn) {
        var parent = grunt.config.data
          , obj
          , eachProp;

        while ((eachProp = props.shift()) !== undefined && eachProp.length) {
            obj = parent[eachProp];
            if (eachProp in parent) {
                obj = fn.call(this, obj, parent);
                if (cacheConfig) {
                    parent[eachProp] = obj;
                }

                parent = obj;
            }

            if (typeof obj !== 'object') {
                break;
            }
        }

        return obj;
    }

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

    function propRequire (prop, regExpr) {
        var matched = prop.match(regExpr);
        if (matched) {
            var path = grunt.config.get(matched[1]);
            grunt.log.writeln('$require:' + path);
            return require(path);
        }
    }
}
