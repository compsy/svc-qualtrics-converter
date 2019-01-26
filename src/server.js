var express = require('express');
var app = express();
var fs = require("fs");

// for simplicity path is hardcoded now
var PATH_TO_INPUT_FILE = __dirname + "/" + "survey_standart_question_types.qsf";

app.get('/convert', function (req, res) {
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
    var questionNodes = extractQuestionNodes(jsonData);

	console.log(questionNodes); // only for test purposes. remove this line later

	return "Not implemented";
}

// counts and returns the number of questions in survey
// argument - survey data as a JSON object
function countQuestionNodes(surveyData){
    var counter = 0;

    surveyData.SurveyElements.forEach(node => {
        if(node.Element == "SQ"){ // SQ - Survey Question
            counter++;
        }
    });

    return counter;
}

// extracts and returns the question nodes
// argument - survey data as a JSON object
function extractQuestionNodes(surveyData){
    var questionNodes = [];

    surveyData.SurveyElements.forEach(node => {
        if(node.Element == "SQ"){ // SQ - Survey Question
            questionNodes.push(node);
        }
    });

    return questionNodes;
}