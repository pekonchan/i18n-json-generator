const parseArgs = require('minimist')
const { resolve } = require('path')

const argConfig = parseArgs(process.argv.slice(2));
let globablSetting = {
    lang: ['en-US'],
    output: {
        dir: 'lang',
        // nameRule (lang) {
        //     return `${lang}222.json`
        // }
    },
    entry: 'dist/**/*.js',
    handler: {
        name: '$t'
    },
    localeName: 'locale'
};

// init
(function() {
    if (argConfig.config) {
        return
    }
    const setting = require(resolve('i18n-generator.config.js'))
    for (const key in globablSetting) {
        if (!setting[key]) {
            continue
        }
        const value = globablSetting[key]
        if (value && value.constructor === Object) {
            Object.assign(globablSetting[key], setting[key])
        } else {
            globablSetting[key] = setting[key]
        }
    }
    // CLI arguemnts
    if (argConfig.lang) {
        globablSetting.lang = argConfig.lang.split(',');
    }
    if (argConfig.dir) {
        globablSetting.output.dir = argConfig.dir;
    }
    if (argConfig.entry) {
        globablSetting.entry = argConfig.entry;
    }
    if (argConfig.handler) {
        globablSetting.handler.name = argConfig.handler;
    }
    if (argConfig.localeName) {
        globablSetting.localeName = argConfig.localeName;
    }
})();

module.exports = {
    globablSetting,
}