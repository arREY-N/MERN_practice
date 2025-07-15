const _ = require('lodash');

const numbers = [1,2,3,4,5];
const shuffledNumbers = _.shuffle(numbers);

console.log("Original: ", numbers);
console.log("Shuffled: ", shuffledNumbers);

