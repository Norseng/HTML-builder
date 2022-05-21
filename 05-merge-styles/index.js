const {readdir, readFile, appendFile, truncate, open} = require('fs');
const path = require('path');
const distPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const filePath = path.join(distPath, 'bundle.css');

readdir(stylesPath, {withFileTypes: true}, (err, files) => {
    if (err) console.log(err);
    else {
        open(filePath, 'a', (err) => {
            if (err) console.log(err);
        });
        truncate(filePath, err => {
            if(err) throw err;
        });
        files.forEach(file => {
            if (file.isFile()) {
                let fileFullPath = path.join(stylesPath, file.name);
                let fileName = path.parse(fileFullPath).ext.slice(1);
                let fileStylePath = path.join(stylesPath, path.parse(fileFullPath).base);
                if(fileName === 'css') {
                    readFile(fileStylePath, 'utf8', (err, data) => {
                        if (err) console.log(err);
                        appendFile(filePath, data, 'utf8', (err) => {
                            if (err) throw err;
                            console.log('\n' + path.parse(fileFullPath).base + ' was appended to bundle.css!');
                        });
                    });
                }
            }
        })
    }
})