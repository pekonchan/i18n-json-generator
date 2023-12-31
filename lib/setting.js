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
    let setting = {}
    try {
        setting = require(resolve('i18n-generator.config.js'))
    } catch (e) {
    }
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

    // Unique the lang
    globablSetting.lang = [...new Set(globablSetting.lang)]
    const repeatIndex = globablSetting.lang.findIndex(item => item === globablSetting.localeName)
    repeatIndex !== -1 && globablSetting.lang.splice(repeatIndex, 1)
})();

module.exports = {
    globablSetting,
}