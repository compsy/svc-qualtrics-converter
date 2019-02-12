var QuestionType = Object.freeze(
    {
        MC : "MC",          // Multi Choice (Radio)
        Matrix : "Matrix",
        Slider : "Slider",
        SBS : "SBS",        // Side by Side
        RO : "RO",          // Rank Order
        TE : "TE"           // Text Entry
    })

var Selector = Object.freeze(
    {
        SAVR : "SAVR",  // Single answer vertical
        MAVR : "MAVR",  // Multi answer vertical
        DL : "DL"       //Dropdown list
    })

// input is a question node extracted from qsf file
module.exports.convert = function convert(questionNode, questionNumber){
    switch(questionNode.Payload.QuestionType){
        case QuestionType.MC:
            return processMCQuestion(questionNode, questionNumber);
    }

    return "Unsupported question type";
}

// input is a question node extracted from qsf file
function processMCQuestion(questionNode, questionNumber){
    var outputNode = { id:null, type:null, title:null, options:[] };
            
    outputNode.id = generateQuestionId(questionNumber);
    if(questionNode.Payload.Selector == Selector.DL){
        outputNode.type = "dropdown"
    }else{
        outputNode.type = "radio";
    }
    outputNode.title = questionNode.Payload.QuestionText;
    Object.values(questionNode.Payload.Choices).forEach(function(choice){
        outputNode.options.push(choice.Display);
    });

    return outputNode
}

function generateQuestionId(questionNumber){
    return "v" + questionNumber; 
}