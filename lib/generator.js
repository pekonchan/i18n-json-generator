const { mkdir, writeFile } = require('fs/promises');
const { resolve } = require('path')

const generateFile = async (filename, content) => {
    try {
        writeFile(filename, content);
    } catch (e) {
        console.error('writeFile failed: ', e);
    }
};

const generate= async (filename, content, dir = '') => {
    try {
        if (dir) {
            await mkdir(dir, { recursive: true })
        }
        generateFile(resolve(dir, filename), content)
    } catch (e) {
        console.error('writeFile failed: ', e)
    }
};

module.exports = {
    generate,
};