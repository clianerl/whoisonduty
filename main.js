const whoisonduty = require('./api/whoisonduty.js');
let res = whoisonduty({ list:true });
console.log(res);
// { list }