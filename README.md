# i18n-json-generator

- [中文文档](https://github.com/pekonchan/i18n-json-generator/tree/main/docs/readme-zh.md)

Specify javascript files (can be multiple, can be all js files in a directory, etc.), from these js files according to the specified internationalization conversion function, extract the need for internationalization in the function, generate json files, and according to the specified need to internationalize the language, generate the corresponding language json template

If you have written internationalization methods in your code, such as

```js
// $t is the internationalization conversion function used to replace "HelloWorld" with each language
const helloWord = $t('HelloWorld')
```
Using this tool, you can extract the terms that need to be internationalized from all the '$t' methods in your code. The following rules are currently followed:
- $t('HelloWorld') ：The first parameter is extracted as the key and value of the language configuration file
- $t('HelloWorld{0}', [variable1, variable2, ...]) ：The first parameter is extracted as the key and value of the language configuration file
- $t(['hi', '嗨']) ：The first element of the first parameter array is extracted as the key of the language configuration file, and the second element as the corresponding value

> The prerequisite for extracting the key above is that it must be a string. If the first parameter is a variable or a method, etc., it will not be extracted.

Based on the above rules, the default generated local term configuration json file is:
```json
{
  "HelloWorld": "HelloWorld",
  "HelloWorld{0}": "HelloWorld{0}",
  "hi": "嗨"
}
```
If you configure a language that requires internationalization, such as English or German, you will also copy the above json file (one for each language), but the value values are empty and need to be translated and supplemented.
```json
{
  "HelloWorld": "",
  "HelloWorld{0}": "",
  "hi": ""
}
```
Of course, the tool also provides their own custom configuration, allowing you to freely configure the extraction of the case.

## Install
```
npm i i18n-json-generator -D
```
or
```
yarn add i18n-json-generator -D
```

## Usage
Create a js file that contains the following code
```js
// start.js
const { i18nJsonConfig } = require('i18n-json-generator');
i18nJsonConfig();
```
Then add `npm script` command to `package.json`, such as:
```json
"scripts": {
    "createjson": "node start.js"
  }
```

If you just want to execute the tool's `i18nJsonConfig` method without any other logic, as in the example above. You can not create a new `js` file, directly in the `package.json` to add `npm script` command, such as:
```json
"scripts": {
"i18n-json": "i18n-json-generator"
}
```
The command name can be customized, but the command script executes `i18n-json-generator`, which is built into the tool.

In any case that does not provide configuration items, the default is to find all the 'js' files in the' dist 'folder under the root directory of your project, and then extract the terms from these files to generate json files, the generated directory is in the' lang 'directory under the root directory of the project (if there is no new).

The default name of the local entry json is `locale.json`, which also generates a jsonn -- `en-US.json` by default

The default is to find the term to extract according to the `$t` function.

The `example` directory in this project is the example demo, which is equivalent to the user's project root directory. We can refer to the use of the situation.

Of course, the above default configuration can be customized

## Setting
There are two ways to modify the default configuration
1. CLI
2. config file

#### CLI
Add 'npm script' to package.json, such as:
```
"scripts": {
    "createjson": "node start.js --lang=en,ja --dir=i18n --entry=dist/**/test2.js --handler='$lang' --localeName=zh-CN"
  }
```
The specific parameters are explained as follows:
```
lang : In addition to local json entries, you need to generate json files in which languages, separated by commas (,)
dir : The directory in which the generated json file is stored
entry : What rules are used to match the file that needs to extract the terms, in this case using glob matching rules
handler :  Internationalized conversion function name, i.e., from what function
localeName :  Generated local term json name
```
#### config file
Create a file named `i18n-generator.config.js` in the project root directory. The content is as follows:
```js
module.exports = {
    lang: ['en-US'], // In addition to local json entries, you need to generate json files in which languages
    output: {
        dir: 'lang' // The directory in which the generated json file is stored
    },
    entry: 'dist/**/*.js', // What rules are used to match the file that needs to extract the terms, in this case using glob matching rules
    handler: {
        name: '$t' // Internationalized conversion function name, i.e., from what function
    },
    localeName: 'zh-CN' // Generated local term json name
};
```
