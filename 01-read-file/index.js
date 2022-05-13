const fs = require('fs');
const path = require('path');
const {stdout} = process;
const filePath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(filePath, 'utf-8');
let data = '';

readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => stdout.write(data));
readableStream.on('error', error => stdout.write(error.message));