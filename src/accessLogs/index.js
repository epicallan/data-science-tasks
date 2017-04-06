const maybe = require('folktale/data/maybe');
const r = require('ramda');
const readline = require('readline');
const fs = require('fs');


const rd = readline.createInterface({
    input: fs.createReadStream('/path/to/file'),
    output: process.stdout,
    console: false
});

rd.on('line', function(line) {
    console.log(line);
});
