module.exports = {
    lang: ['en-US'],
    output: {
        dir: 'lang'
    },
    entry: 'dist/**/*.js',
    handler: {
        name: '$t'
    },
    localeName: 'zh-CN'
};