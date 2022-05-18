const path = require('path');
const {readdir, lstat} = require('fs');
const filePath = path.join(__dirname, 'secret-folder');

readdir(filePath, {withFileTypes: true}, (err, files) => {
    console.log("\nSecret folder files:");
    if (err)
        console.log(err);
    else {
        files.forEach(file => {
            if (file.isFile()) {
                let fileFullPath = path.join(filePath, file.name);
                let fileProps = path.parse(fileFullPath);
                lstat(fileFullPath, (err, stats) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(fileProps.name + ' - ' + path.extname(fileFullPath).slice(1) + ' - ' + stats.size + 'b');
                    }
                });
            }
        })
    }
})