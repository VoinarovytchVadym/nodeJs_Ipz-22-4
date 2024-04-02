const { readCommand, add, remove, list, read } = require('./user');

const args = process.argv.slice(2);
readCommand(args);