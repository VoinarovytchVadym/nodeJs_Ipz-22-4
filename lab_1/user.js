const fs = require('fs');
const data = fs.readFileSync('user.json', { encoding: 'utf8' });
let dataObj = JSON.parse(data);
function add(title, level) {
    if (title && level) {
        const newLanguage = { title, level };
        dataObj.languages.push(newLanguage);
        fs.writeFileSync('user.json', JSON.stringify(dataObj), { encoding: 'utf8', flag: 'w' });
        console.log("Мова додана успішно.");
    } else {
        console.log("Потрібно вказати заголовок та рівень.");
    }
}
function remove(title) {
    const index = dataObj.languages.findIndex(lang => lang.title === title);
    if (index !== -1) {
        dataObj.languages.splice(index, 1);
        fs.writeFileSync('user.json', JSON.stringify(dataObj), { encoding: 'utf8', flag: 'w' });
        console.log(`Мова з назвою "${title}" була успішно видалена.`);
    } else {
        console.log(`Мова з назвою "${title}" не була знайдена.`);
    }
}
function list(){
    console.log(dataObj);
}
function read(title){
    const index = dataObj.languages.findIndex(lang => lang.title === title);
    if (index !== -1) {
        dataObj.languages.splice(index, 1);
        console.log(dataObj.languages[index]);
    }
    else{
        console.log(`Мова з назвою "${title}" не була знайдена.`);
    }
}
function readCommand(args) {
    if (args[0] === "add") {
        const titleArg = args.find(arg => arg.startsWith("--title="));
        const levelArg = args.find(arg => arg.startsWith("--level="));

        if (titleArg && levelArg) {
            const title = titleArg.split("=")[1];
            const level = levelArg.split("=")[1];
            add(title, level);
        } else {
            console.log("Потрібно вказати заголовок та рівень.");
        }
    }
    if(args[0]==="remove"){
        const titleArg = args.find(arg => arg.startsWith("--title="));
        if (titleArg) {
            const title = titleArg.split("=")[1];
            remove(title);
        }else {
            console.log("Потрібно вказати заголовок.");
        }
    }
    if(args[0]==="list"){
        list();
    }
    if(args[0]==="read"){
        const titleArg = args.find(arg => arg.startsWith("--title="));
        if (titleArg) {
            const title = titleArg.split("=")[1];
            read(title);
        }
    }
}
module.exports = {
    readCommand,
    add,
    remove,
    list,
    read
};