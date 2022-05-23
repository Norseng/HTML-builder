const path = require('path');
const {readFile, appendFile} = require('fs');
const fsPromises = require('fs').promises;
const fileCopyPath = path.join(__dirname, 'project-dist');
const filePath = path.join(fileCopyPath, 'style.css');
const stylesPath = path.join(__dirname, 'styles');
const templateHtml = path.join(__dirname, 'template.html');
const templateComponents = path.join(__dirname, 'components');
const pathHtmlCombine = path.join(fileCopyPath, 'index.html');
const assetsPath = path.join(__dirname, 'assets');
const assetsPathCopy = path.join(fileCopyPath, 'assets');

class Builder {
    constructor(fileCopyPath, filePath, stylesPath, assetsPath, assetsPathCopy, templateHtml, templateComponents, pathHtmlCombine) {
        this.fileCopyPath = fileCopyPath;
        this.stylesPath = stylesPath;
        this.filePath = filePath;
        this.assetsPath = assetsPath;
        this.assetsPathCopy = assetsPathCopy;
        this.templateHtml = templateHtml;
        this.templateComponents = templateComponents;
        this.pathHtmlCombine = pathHtmlCombine;
    }
    async deleteFolder() {
        await fsPromises.rm(fileCopyPath, {recursive: true, force: true}, (err) => {
            if (err) throw err;
        })
    }
    async createDir() {
        await fsPromises.mkdir(fileCopyPath, {recursive: true}, (err) => {
            if (err) throw err;
        });
    }
    async combineStyles() {
        const readDir = await fsPromises.readdir(stylesPath, {withFileTypes: true}, (err) => {
            if (err) console.log(err);
        })
        await fsPromises.open(filePath, 'a');
        await fsPromises.truncate(filePath);
        for(let file of readDir) {
            if (file.isFile()) {
                let fileFullPath = path.join(stylesPath, file.name);
                let fileName = path.parse(fileFullPath).ext.slice(1);
                let fileStylePath = path.join(stylesPath, path.parse(fileFullPath).base);
                if(fileName === 'css') {
                    readFile(fileStylePath, 'utf8', (err, data) => {
                        if (err) console.log(err);
                        appendFile(filePath, data, 'utf8', (err) => {
                            if (err) throw err;
                        });
                    });
                }
            }
        }
    }
    async copyFolder(assetsPath, assetsPathCopy) {
        const entries = await fsPromises.readdir(assetsPath, {withFileTypes: true}, (err) => {
            if (err) throw err;
        });
        await fsPromises.mkdir(assetsPathCopy, {recursive: true}, (err) => {
            if (err) throw err;
        });
        for(let entry of entries) {
            const srcPath = path.join(assetsPath, entry.name);
            const destPath = path.join(assetsPathCopy, entry.name);
            if(entry.isDirectory()) {
                await this.copyFolder(srcPath, destPath);
            } else {
                await fsPromises.copyFile(srcPath, destPath);
            }
        }
    }
    async combineComponents() {
        let htmlPath = await fsPromises.readFile(templateHtml, 'utf-8');
        const componentsName = await fsPromises.readdir(templateComponents, {withFileTypes: true});
        for(let item of componentsName) {
            const componentInner = await fsPromises.readFile(path.join(templateComponents, `${item.name}`), 'utf-8');
            const regExp = new RegExp(`{{${(item.name).split('.')[0]}}}`, 'g');
            htmlPath = htmlPath.replace(regExp, componentInner);
        }
        await fsPromises.writeFile(pathHtmlCombine, htmlPath);
      }
    htmlBuilder() {
        this.deleteFolder().then(() => {
            this.createDir();
            this.combineStyles();
            this.copyFolder(assetsPath, assetsPathCopy);
            this.combineComponents();
        });
    }
}

let htmlBuilder = new Builder(fileCopyPath, filePath, stylesPath, assetsPath, assetsPathCopy);
htmlBuilder.htmlBuilder();