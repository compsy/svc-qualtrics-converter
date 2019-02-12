var questionConverter = require("./questionConverter.js");

// formats and returns a JSON file containing questions and possible answers
// parameter - qualtrics exported .qsf file content
module.exports.convertToJson = function convertToJson(fileData){
	// here we need to use JSON parser because
	// .sqf files content is compressed into 1 text line
	
	var jsonData = JSON.parse(fileData);	    
    var questionNodes = extractQuestionNodes(jsonData);

    sortQuestionNodes(questionNodes);

    var output = [];

    for(var i = 0; i < questionNodes.length; i++){
        var outputNode = questionConverter.convert(questionNodes[i], i+1);
        output.push(outputNode);
    }

    console.log(questionNodes); // only for test purposes. remove this line later

    return JSON.stringify(output);
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

// sorts questions nodes by their initial order
// argument = question nodes as a json object
function sortQuestionNodes(questionNodes){
    questionNodes.sort(function(a, b){
        return a.Payload.QuestionID > b.Payload.QuestionID;
    });
}