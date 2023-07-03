const {
    mkdir,
    writeFile,
    readFile,
    access,
    constants,
} = require('fs/promises');
const { resolve } = require('path');

const readFromPath = async (path) => {
    try {
        await access(path, constants.F_OK);
        const content = await readFile(path, { encoding: 'utf8' });
        return content;
    } catch (e) {
        return '';
    }
};

const generateFile = async (filename, content) => {
    try {
        writeFile(filename, content);
    } catch (e) {
        console.error('writeFile failed: ', e);
    }
};

const generate = async (filename, content, dir = '') => {
    try {
        if (dir) {
            await mkdir(dir, { recursive: true });
        }
        generateFile(resolve(dir, filename), content);
    } catch (e) {
        console.error('writeFile failed: ', e);
    }
};

module.exports = {
    generate,
    readFromPath,
};