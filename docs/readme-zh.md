# i18n-json-generator
指定`javascript`文件（可多个，可某个目录下所有js文件等），从这些js文件中按照指定的国际化转换函数，抽取函数里需要国际化的词条，生成`json`文件，且按照指定的需要国际化的语言，生成对应语言的词条json模板

如你的代码中已经写了国际化的方法，如
```js
// $t是国际化转换函数，用来把“你好世界”替换成各个语言的
const helloWord = $t('你好世界')
```
使用了该工具，可以将你的代码中所有`$t`方法中提取需要国际化的词条。目前遵循以下规则：
- $t('你好世界') ：会把第一个参数提取出来，作为语言配置文件的key和value
- $t('你好{0}', [变量1, 变量2, ...]) ：会把第一个参数提取出来，作为语言配置文件的key和value
- $t(['hi', '嗨']) ：会把第一个参数数组里的第一个元素提取出来，作为语言配置文件的key，第二个元素作为对应的value

> 上述提取出来作为key的前提条件是必须是个字符串，若第一个参数是个变量或者方法等，是不会提取出来的。

基于上述规则，默认生成的本地词条配置json文件是：
```json
{
  "你好世界": "你好世界",
  "你好{0}": "你好{0}",
  "hi": "嗨"
}
```
若你配置了需要国际化的语言，如英文、德文，同样会复制了一份上述json文件（一个语言一份），但是value值都是空的，需要人工翻译并补充上去。
```json
{
  "你好世界": "",
  "你好{0}": "",
  "hi": ""
}
```
当然该工具还提供了各自自定义的配置，可让你自由配置提取的情况。

## Install
```
npm i i18n-json-generator -D
```
or
```
yarn add i18n-json-generator -D
```

## Usage
创建一个js文件，里面包含以下代码
```js
// start.js
const { i18nJsonConfig } = require('i18n-json-generator');
i18nJsonConfig();
```
然后在`package.json`里添加`npm script`命令，如：
```json
"scripts": {
    "createjson": "node start.js"
  }
```

若你仅仅是想执行该工具的`i18nJsonConfig`方法，而无其他逻辑，如上述例子。则你可以不自己新建一个`js`文件，直接在在`package.json`里添加`npm script`命令，如：
```json
"scripts": {
    "i18n-json": "i18n-json-generator"
  }
```
命令名可以自定义，但是命令脚本得执行`i18n-json-generator`，该脚本命令是工具内置的。

在任何不提供配置项的情况下，默认是在你的项目根目录下的`dist`文件夹里找所有`js`文件，然后从这些文件中提取词条生成json文件，生成目录是在项目根目录下的`lang`目录中（没有则自动新建），

而本地词条json默认名字为`locale.json`，默认也会生成一个英文配jsonn——`en-US.json`

默认是根据`$t`函数来找到要提取的词条。

本工程中的`example`目录为示例demo，相当于用户的项目根目录。大家可参考一下使用情况。

当然上述默认配置，可以用户自定义更改

## Setting
提供两种方式进行修改默认配置
1. 命令行参数
2. 配置文件

#### 命令行参数
在`package.json`里添加`npm script`命令，如：
```
"scripts": {
    "createjson": "node start.js --lang=en,ja --dir=i18n --entry=dist/**/test2.js --hanlder=$lang --localeName=zh-CN"
  }
```
具体参数解释如下：
```
lang  除了本地词条json外，还需要生成哪些国家语言的json文件，以英文逗号隔开
dir 生成的json文件放在哪个目录下
entry 按照什么样的规则来匹配到需要抽取词条的文件，这里是用glob匹配规则写法
handler 国际化转换函数名，即从什么函数中抽取词条
localeName 生成的本地词条json名字
```
#### 配置文件
在项目根目录下创建一个名为`i18n-generator.config.js`的文件。编写内容如下：
```js
module.exports = {
    lang: ['en-US'], // 除了本地词条json外，还需要生成哪些国家语言的json文件，以英文逗号隔开
    output: {
        dir: 'lang' // 生成的json文件放在哪个目录下
    },
    entry: 'dist/**/*.js', // 按照什么样的规则来匹配到需要抽取词条的文件，这里是用glob匹配规则写法
    handler: {
        name: '$t' // 国际化转换函数名，即从什么函数中抽取词条
    },
    localeName: 'zh-CN' // 生成的本地词条json名字
};
```
