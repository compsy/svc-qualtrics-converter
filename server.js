var express = require('express');
var app = express();
var fs = require("fs");

// for simplicity path is hardcoded now
var PATH_TO_INPUT_FILE = __dirname + "/" + "testSurvey.qsf";

app.get('/show', function (req, res) {
    fs.readFile(PATH_TO_INPUT_FILE, 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
		
		var outputJson = convertToJson(data);		
		res.end(outputJson);	
    });
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Qualtrics converter. Listening at http://%s:%s", host, port)
})

// formats and returns a JSON file containing questions and possible answers
// parameter - qualtrics exported .qsf file content
function convertToJson(fileData){
	// here we need to use JSON parser because
	// .sqf files content is compressed into 1 text line
	
	var jsonData = JSON.parse(fileData);	
	console.log(jsonData.SurveyElements); // only for test purposes. remove this line later
	
	return "Not implemented";
}