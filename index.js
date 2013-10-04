var beautify = require("js-beautify");
var colors = require("colors");


var beautJS = beautify.js;
var hook = process.argv[2];

if(hook!="pre-commit"){
	console.error("This is only going to work with commit-msg");
}
else{
