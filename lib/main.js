const { glob } = require('glob');
const { extractByPath } = require('./extract');
const { generate } = require('./generator');
const { access, constants } = require('fs/promises');
const { resolve } = require('path')
const { globablSetting } = require('./setting.js')

// global varaiable
const defaultZhName = 'zh-CN';

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
    let config = {};
    const jsfiles = await glob(globablSetting.entry);
    for (const filePath of jsfiles) {
        const result = await extractByPath(filePath);
        Object.assign(config, result);
        const outPath = globablSetting.output.dir
        generate(resolve(outPath, `${defaultZhName}.json`), JSON.stringify(config), outPath);
        createI18nConfig(config);
    }
};

module.exports = {
    i18nJsonConfig: createConfig
};