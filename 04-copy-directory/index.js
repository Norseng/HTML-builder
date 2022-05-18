const path = require('path');
const {copyFile, mkdir, readdir} = require('fs');
const filePath = path.join(__dirname, 'files');
const fileCopyPath = path.join(__dirname, 'files-copy');

const copyDir = () => {
    mkdir(fileCopyPath, {recursive: true}, (err) => {
        if (err) throw err;
    });
    readdir(filePath, {withFileTypes: true}, (err, files) => {
        if (err)
            console.log(err);
        else {
            files.forEach(file => {
                if (file.isFile()) {
                    let fileFullPath = path.join(filePath, file.name);
                    let fileName = path.parse(fileFullPath).base;                
                    let oldfilePath = path.join(filePath, fileName);
                    let NewfilePath = path.join(fileCopyPath, fileName);
                    copyFile(oldfilePath, NewfilePath, (err) => {
                        if (err) throw err;
                        console.log(fileName + ' was copied to files-copy');
                    });
                }
            })
        }
    })
}

copyDir();