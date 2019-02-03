var QuestionType = Object.freeze(
    {
        MC : 1, // Multi Choice (Radio)
        Matrix : 2,
        Slider : 3,
        SBS : 4, // Side by Side
        RO : 5, // Rank Order
        TE : 6 // Text Entry
    })

// formats and returns a JSON file containing questions and possible answers
// parameter - qualtrics exported .qsf file content
module.exports.convertToJson = function convertToJson(fileData){
	// here we need to use JSON parser because
	// .sqf files content is compressed into 1 text line
	
	var jsonData = JSON.parse(fileData);	    
    var questionNodes = extractQuestionNodes(jsonData);

    questionNodes.forEach(node => {
        switch(node.QuestionType){
            case QuestionType.MC:
                var outputNode = {
                    id,
                    type,
                    title
                }
                
                break;
        }
    });

    sortQuestionNodes(questionNodes);
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

// sorts questions nodes by their initial order
// argument = question nodes as a json object
function sortQuestionNodes(questionNodes){
    questionNodes.sort(function(a, b){
        //return a.Payload.DataExportTag > b.Payload.DataExportTag;
        return a.Payload.QuestionID > b.Payload.QuestionID;
    });
}