const fs = require('fs');
const file = 'task_2.txt';
fs.appendFile(file, "Hello, World!\n", (err) => {
    if (err) {
        console.error('Помилка під час запису у файл:', err);
        return;
    }
    console.log('Дані успішно записані у файл.');
});