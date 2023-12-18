const glob = require('glob');
const { extractByPath } = require('./extract');
const { generate, readFromPath } = require('./utils');
const {
    promises: {
        access
    },
    constants,
} = require('fs');
const { resolve } = require('path');
const { globablSetting } = require('./setting.js');

const createI18nConfig = (config) => {
    globablSetting.lang.forEach(async lang => {
        const filename = `${lang}.json`
        let i18nConfig = {}
        const outPath = globablSetting.output.dir
        try {
            const wholePath = resolve(outPath, filename);
            await access(wholePath, constants.F_OK);
            // If file exist
            const content = require(wholePath);
            for (const key in config) {
                i18nConfig[key] = content[key] || '';
            }
        }
        // If not exist
        catch (e) {
            for (const key in config) {
                i18nConfig[key] = '';
            }
        }
        generate(filename, JSON.stringify(i18nConfig), outPath);
    });
};

const createConfig = async () => {
    const outPath = globablSetting.output.dir;
    const localeFilePath = resolve(outPath, `${globablSetting.localeName}.json`);
    const content = await readFromPath(localeFilePath);
    let config = content ? JSON.parse(content) : {};
    glob(globablSetting.entry, async (err, jsfiles) => {
        if (err) {
            return;
        }
        for (const filePath of jsfiles) {
            const result = await extractByPath(filePath);
            config = Object.assign({}, result, config);
        }
        generate(localeFilePath, JSON.stringify(config), outPath);
        createI18nConfig(config);
    })
    
};

module.exports = {
    i18nJsonConfig: createConfig
};