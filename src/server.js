var express = require('express');
var app = express();
var fs = require("fs");
var surveyWorker = require("./surveyWorker.js");

// for simplicity path is hardcoded now
var PATH_TO_INPUT_FILE = __dirname + "/" + "survey_standart_question_types.qsf";

app.get('', function (req, res) {
    fs.readFile(PATH_TO_INPUT_FILE, 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
		
		var outputJson = surveyWorker.convertToJson(data);		
		res.end(outputJson);	
    });
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Qualtrics converter. Listening at http://%s:%s", host, port)
})