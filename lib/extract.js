
const baseParse = require('@babel/parser');
const traverse = require('@babel/traverse');
const { readFile } = require('fs').promises;
const { globablSetting } = require('./setting.js');

const extract = (code) => {
    let config = {};
    const ast = baseParse.parse(code, {
        sourceType: 'unambiguous',
        allowReturnOutsideFunction: true,
    });
    const visitor = {
        CallExpression (path) {
            const pathNodeCallee = path.node.callee;
            const handlerName = globablSetting.handler.name;
            if (pathNodeCallee.type === 'Identifier') {
                if (pathNodeCallee.name !== handlerName) {
                    return;
                }
            } else if (pathNodeCallee.type === 'MemberExpression') {
                if (pathNodeCallee.property.name !== handlerName) {
                    return;
                }
            } else {
                return;
            }
            
            const callArguments = path.node.arguments;
            const callArguments0 = callArguments[0];
            if (!callArguments0) {
                return;
            }
            if (callArguments0.type === 'StringLiteral') {
                config[callArguments0.value] = callArguments0.value;
            } else if (callArguments0.type === 'ArrayExpression') {
                const elements = callArguments0.elements;
                const elements0 = elements[0];
                if (!elements0 || elements0.type !== 'StringLiteral') {
                    return;
                }
                config[elements0.value] = elements0.value;
                if (elements[1] && elements[1].type === 'StringLiteral') {
                    config[elements0.value] = elements[1].value;
                }
            }
        },
    };
    traverse.default(ast, visitor);
    return config;
};

const extractByPath = async (path) => {
    try {
        const code = await readFile(path, { encoding: 'utf8' });
        return extract(code);
    } catch (e) {
        console.error('readFile falled: ', e);
        return {};
    }
};

module.exports = {
    extract,
    extractByPath,
};