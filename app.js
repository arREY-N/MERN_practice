const { error } = require('console');
const utils = require('./utils');

console.log("Hello world!")
console.log(utils.greetUser("Alice"));
console.log(utils.greetUser("Bob"));

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'message.txt');

fs.readFile(filePath, 'utf8', (err, data) =>{
    if(err){
        console.error("Error reading file: ", err);
        return;
    }
    console.log("File content: \n", data);
});

if(process.argv.length > 2){
    console.log("Command Line Arguments: ", process.argv.slice(2));
} else {
    console.log("No command line arguments provided.");
}

console.log("This line runs before file reading might finish due to async nature.");
