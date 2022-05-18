const fs = require('fs');
const path = require('path');
const {stdin, stdout, exit} = process;
const filePath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(filePath);

stdout.write('Введите текст:\n');
stdin.on('data', data => {
    if (data.toString().trim() === 'exit') exit();
    output.write(data.toString());
});

process.on('exit', () => stdout.write('Хорошего дня!'));
process.on('SIGINT', exit);