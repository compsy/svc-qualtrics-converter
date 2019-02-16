var fs = require("fs");
var qsfConverter = require("../../src/qsfConverter.js");

module.exports.get = function get(pathToQsfFile) {
    var qsfFileContent = fs.readFileSync(pathToQsfFile, 'utf8');
    var output = qsfConverter.convert(qsfFileContent);
    
    return output;
}