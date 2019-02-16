var Helper = require("./helper.js");

var QuestionType = Object.freeze(
    {
        MC : "MC",          // Multi Choice (Radio)
        Matrix : "Matrix",
        Slider : "Slider",
        SBS : "SBS",        // Side by Side
        RO : "RO",          // Rank Order
        TE : "TE",          // Text Entry
        DB : "DB"           // Descriptive Text
    })

var Selector = Object.freeze(
    {
        SAVR : "SAVR",  // Single Answer Vertical
        MAVR : "MAVR",  // Multi Answer Vertical
        DL : "DL",      // Dropdown List
        SL : "SL",      // Single Line
        ML : "ML",      // Multi Line
        ESTB: "ESTB"    // Essay Text Box
    })

module.exports.convert = function convert(qsfContent) {
    var jsonData = JSON.parse(qsfContent);	
    var inputQuestions = Helper.extractQuestionNodes(jsonData);

    Helper.sortQuestionNodes(jsonData, inputQuestions);

    var outputQuestionNodes = [];

    for(var i = 0; i < inputQuestions.length; i ++){
        var outputQuestionNode = performQuestionTypeSpecificProcessing(inputQuestions[i], i+1);
        outputQuestionNodes.push(outputQuestionNode);
    }

    performGeneralProcessing(jsonData, inputQuestions, outputQuestionNodes);

    console.log(outputQuestionNodes); // for test purposes

    return outputQuestionNodes;
}

function processMCQuestion(questionNode, questionNumber) {
    var outputNode = { id:null, oldQuestionId:null, type:null, title:null, options:[] };
            
    outputNode.id = Helper.generateQuestionId(questionNumber);
    outputNode.oldQuestionId = questionNode.Payload.QuestionID;
    outputNode.title = questionNode.Payload.QuestionText;
    if (questionNode.Payload.Selector == Selector.DL) {
        outputNode.type = "dropdown"
    } else {
        outputNode.type = "radio";
    }
    Object.values(questionNode.Payload.Choices).forEach(function(choice) {
        var option = { title: choice.Display }; // here we are creating object because potentially it can have more keys
        outputNode.options.push(option);
    });

    return outputNode
}

function processTEQuestion(questionNode, questionNumber) {
    var outputNode = { id:null, oldQuestionId:null, type:null, title:null };

    outputNode.id = Helper.generateQuestionId(questionNumber);
    outputNode.oldQuestionId = questionNode.Payload.QuestionID;
    outputNode.title = questionNode.Payload.QuestionText;
    if(questionNode.Payload.Selector == Selector.SL) {
        outputNode.type = "textfield";
    } else {
        outputNode.type = "textarea";
    }

    return outputNode;
}

function processSliderQuestion(questionNode, questionNumber) {
    var outputNode = { id:null, oldQuestionId:null, type:null, title:null, labels:[], min:null, max:null };

    outputNode.id = Helper.generateQuestionId(questionNumber);  
    outputNode.oldQuestionId = questionNode.Payload.QuestionID;
    outputNode.title = questionNode.Payload.QuestionText;
    outputNode.type = "range";
    Object.values(questionNode.Payload.Labels).forEach(function(label) {
        outputNode.labels.push(label.Display);
    });
    outputNode.min = questionNode.Payload.Configuration.CSSliderMin;
    outputNode.max = questionNode.Payload.Configuration.CSSliderMax;

    return outputNode;
}

function performQuestionTypeSpecificProcessing(questionNode, questionNumber){
    var questionType = questionNode.Payload.QuestionType;

    switch(questionType){
        case QuestionType.MC:
            return processMCQuestion(questionNode, questionNumber);

        case QuestionType.TE:
            return processTEQuestion(questionNode, questionNumber);

        case QuestionType.Slider:
            return processSliderQuestion(questionNode, questionNumber);
    }

    throw "Question type '" + questionType + "' is not supported";
}

// has to be called after performQuestionTypeSpecificProcessing
function performGeneralProcessing(qsfContent, inputQuestionNodes, outputQuestionNodes){
    Helper.removeUnassignedValues(outputQuestionNodes);

    var displayLogicNodes = Helper.getDisplayLogic(inputQuestionNodes);
    var skipLogicNodesForBlocks = Helper.getSkipLogic(qsfContent);

    Helper.attachDisplayLogic(outputQuestionNodes, displayLogicNodes);
    Helper.attachSkipLogic(outputQuestionNodes, skipLogicNodesForBlocks);
}