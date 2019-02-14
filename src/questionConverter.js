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

module.exports.convert = function convert(questionNode, questionNumber) {
    var outputNode = null;

    switch(questionNode.Payload.QuestionType){
        case QuestionType.MC:
            outputNode = processMCQuestion(questionNode, questionNumber);
            break;

        case QuestionType.TE:
            outputNode = processTEQuestion(questionNode, questionNumber);
            break;

        case QuestionType.Slider:
            outputNode = processSliderQuestion(questionNode, questionNumber);
            break;
    }

    if (outputNode != null) {
        removeUnassignedValues(outputNode);
        return outputNode;
    }

    return "Unsupported question type";
}

function processMCQuestion(questionNode, questionNumber) {
    var outputNode = { id:null, type:null, title:null, options:[] };
            
    outputNode.id = generateQuestionId(questionNumber);
    outputNode.title = questionNode.Payload.QuestionText;
    if (questionNode.Payload.Selector == Selector.DL) {
        outputNode.type = "dropdown"
    } else {
        outputNode.type = "radio";
    }
    Object.values(questionNode.Payload.Choices).forEach(function(choice) {
        outputNode.options.push(choice.Display);
    });

    return outputNode
}

function processTEQuestion(questionNode, questionNumber) {
    var outputNode = { id:null, type:null, title:null };

    outputNode.id = generateQuestionId(questionNumber);
    outputNode.title = questionNode.Payload.QuestionText;
    if(questionNode.Payload.Selector == Selector.SL) {
        outputNode.type = "textfield";
    } else {
        outputNode.type = "textarea";
    }

    return outputNode;
}

function processSliderQuestion(questionNode, questionNumber) {
    var outputNode = { id:null, type:null, title:null, labels:[], min:null, max:null };

    outputNode.id = generateQuestionId(questionNumber);  
    outputNode.title = questionNode.Payload.QuestionText;
    outputNode.type = "range";
    Object.values(questionNode.Payload.Labels).forEach(function(label) {
        outputNode.labels.push(label.Display);
    });
    outputNode.min = questionNode.Payload.Configuration.CSSliderMin;
    outputNode.max = questionNode.Payload.Configuration.CSSliderMax;

    return outputNode;
}




function generateQuestionId(questionNumber) {
    return "v" + questionNumber; 
}

function removeUnassignedValues(outputNode) {

    if (outputNode === null) {
        return outputNode;
    }

    Object.keys(outputNode).forEach(function (key) {
        if (outputNode[key] === null) {
            delete outputNode[key];
        }
    });

    return outputNode;
}