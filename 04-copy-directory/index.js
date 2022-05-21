const path = require('path');
const fsPromises = require('fs').promises;
const filePath = path.join(__dirname, 'files');
const fileCopyPath = path.join(__dirname, 'files-copy');

const copyDir = async (newFolder, currentFolder) => {
  await fsPromises.rm(newFolder, {
    recursive: true,
    force: true,
  });

  await fsPromises.mkdir(newFolder, {recursive: true}, (err) => {
    if (err) throw err;
  });

  const files = await fsPromises.readdir(currentFolder, {withFileTypes: true});
  files.forEach(async file => {
    if(file.isFile()) {
      let currentFile = path.join(currentFolder, file.name);
      let newFile = path.join(newFolder, file.name);
      await fsPromises.copyFile(currentFile, newFile);
    }
  });
};

copyDir(fileCopyPath, filePath);