# grunt-env-config
[![Build status](https://ci.appveyor.com/api/projects/status/nd8r1uvjhbtj7746?svg=true)](https://ci.appveyor.com/project/0of/grunt-env-config)

require template and env template helpers for env based grunt config

# Enabling Env Config
```javascript
  require('grunt-env-config')(grunt);
```

# Template Usage Guidelines
## $require
When expanding the require template string, it'll automatically load the specific module. In order to load the module, you should append dot accessor that reference to valid config object to the ```$require```
```javascript
// when fetching the value of `a`, it'll load the module './index.js' 
// and the `a` holds the value exported from './index.js' 
grunt.initConfig({
  templateRequire: {
    options: {
      a: '<%= $require.templateRequire.ref %>'
    },
    ref: './index.js'
  }
}
```

## grunt.template.env(prop)
### Arguments
- **<u>prop</u>**: { _String_ } dot format property accessor
```javascript
// `a` will hold the value of `process.env.NODE_ENV`
grunt.initConfig({
  templateEnvHelper: {
    options: {
      a: '<%= grunt.template.env("NODE_ENV") %>'
    }
  }
}
```

## grunt.template.through(value)
### Arguments
- **<u>value</u>**: { _Any_ } it is allowed to pass any pre-defined object, and there is no restriction should only use with env variable. 

**_If value is kind of object, you'll get JSONified value. Otherwise any value should return as what [lodash template](https://lodash.com/docs/#template) processed_**
```javascript
// `a` will hold the value of `process.env.NODE_ENV`
grunt.initConfig({
  throughTemplateHelper: {
    options: {
      a: '<%= grunt.template.through(process.env.NODE_ENV) %>'
    }
  }
}
```

# License
  MIT License
