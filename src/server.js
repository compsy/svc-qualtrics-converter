var express = require('express');
var app = express();
var fs = require("fs");
var qsfConverter = require("./qsfConverter.js");

// for simplicity path is hardcoded now
var PATH_TO_INPUT_FILE = __dirname + "/../input/" + "survey.qsf";

app.get('', function (req, res) {
  fs.readFile(PATH_TO_INPUT_FILE, 'utf8', function (err, data) {
    if (err) {
      throw err;
    }
    var output = qsfConverter.convert(data);
    res.json(output);
  });
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Qualtrics converter. Listening at http://%s:%s", host, port)
})
