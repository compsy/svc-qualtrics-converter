var questionConverter = require("./questionConverter.js");

// formats and returns a JSON file containing questions and possible answers
// parameter - qualtrics exported .qsf file content
module.exports.convertToJson = function convertToJson(fileData) {
	// here we need to use JSON parser because
	// .sqf files content is compressed into 1 text line
	
    var jsonData = JSON.parse(fileData);	
    var skipLogicNode = getSkipLogic(jsonData);    
    var questionNodes = extractQuestionNodes(jsonData);
    var displayLogic = getDisplayLogic(questionNodes);

    sortQuestionNodes(questionNodes);

    var output = [];

    for (var i = 0; i < questionNodes.length; i++) {
        var outputNode = questionConverter.convert(questionNodes[i], i+1);
        output.push(outputNode);
    }

    console.log(output); // only for test purposes. remove this line later

    return output;
}

// counts and returns the number of questions in survey
// argument - survey data as a JSON object
function countQuestionNodes(surveyData) {
    var counter = 0;

    surveyData.SurveyElements.forEach(function(node) {
        if (node.Element == "SQ") { // SQ - Survey Question
            counter++;
        }
    });

    return counter;
}

// extracts and returns the question nodes
// argument - survey data as a JSON object
function extractQuestionNodes(surveyData) {
    var questionNodes = [];

    surveyData.SurveyElements.forEach(function(node) {
        if (node.Element == "SQ") { // SQ - Survey Question
            questionNodes.push(node);
        }
    });

    return questionNodes;
}

// sorts questions nodes by their initial order
// argument = question nodes as a json object
function sortQuestionNodes(questionNodes) {
    questionNodes.sort(function(a, b) {
        return a.Payload.QuestionID > b.Payload.QuestionID;
    });
}

function getSkipLogic(surveyData) {
    var result = [];

    if (surveyData === null) {
        return null;
    }

    surveyData.SurveyElements.forEach(function(node) {
        if (node.Element == "BL") { // BL - Blocks          
            node.Payload.forEach(function (block) {
                if (block.Type == "Trash") {
                    return; // continue
                }

                block.BlockElements.forEach(function(element) {
                    if (element.hasOwnProperty('SkipLogic')) {
                        result.push(element.SkipLogic);
                    }
                });
            });
        }
    });

    if (result.length <= 0) {
        return null;
    }

    return result;
}

function getDisplayLogic(questionNodes) {
    var result = [];

    questionNodes.forEach(function (questionNode) { 
        if (questionNode.Payload.hasOwnProperty("InPageDisplayLogic")) {
            var customNode = {
                questionToShow: questionNode.Payload.QuestionID,
                InPageDisplayLogic: questionNode.Payload.InPageDisplayLogic
            }

            result.push(customNode);
        }
    });

    if (result.length <= 0) {
        return null;
    }

    return result;
}