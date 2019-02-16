function findOutputQuestionNode(outputQuestionNodes, questionId) {
    var result = null;

    outputQuestionNodes.forEach(function(outputQuestionNode) {
        if(outputQuestionNode.id == questionId || outputQuestionNode.oldQuestionId == questionId){
            result = outputQuestionNode;
        }
    });

    return result;
}

function getOutputQiestionNodesIdBetween(outputQuestionNodes, outputQuestionIdFrom, outputQuestionIdTo){
    var questionsId = [];
    var isInRange = false;

    outputQuestionNodes.forEach(function (outputQuestionNode) {
        if (outputQuestionNode.id == outputQuestionIdTo) {
            isInRange = false;
        }
        if(isInRange) {
            questionsId.push(outputQuestionNode.id);
        } else if (outputQuestionNode.id == outputQuestionIdFrom){
            isInRange = true;
        }
    });

    return questionsId;
}

// sorts questions nodes by their initial order
// argument = question nodes as a json object
module.exports.sortQuestionNodes = function sortQuestionNodes(questionNodes) {
    questionNodes.sort(function(a, b) {
        return a.Payload.QuestionID > b.Payload.QuestionID;
    });
}

// input:
//      qsfData: qsf file content as a json object
module.exports.getSkipLogic = function getSkipLogic(qsfData) {
    var result = [];

    if (qsfData === null) {
        return null;
    }

    qsfData.SurveyElements.forEach(function(node) {
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

// input:
//      inputQuestionNodes: question nodes extracted from qsf file content
module.exports.getDisplayLogic = function getDisplayLogic(inputQuestionNodes) {
    var result = [];

    inputQuestionNodes.forEach(function (questionNode) { 
        if (questionNode.Payload.hasOwnProperty("DisplayLogic")) {
            var customNode = {
                questionToShow: questionNode.Payload.QuestionID,
                DisplayLogic: questionNode.Payload.DisplayLogic
            }

            result.push(customNode);
        }
        if (questionNode.Payload.hasOwnProperty("InPageDisplayLogic")) {
            var customNode = {
                questionToShow: questionNode.Payload.QuestionID,
                DisplayLogic: questionNode.Payload.InPageDisplayLogic
            }

            result.push(customNode);
        }
    });

    if (result.length <= 0) {
        return null;
    }

    return result;
}

// extracts and returns the question nodes
// input: 
//      qsfData: qsf file content as a json object
module.exports.extractQuestionNodes = function extractQuestionNodes(qsfData) {
    var questionNodes = [];

    qsfData.SurveyElements.forEach(function(node) {
        if (node.Element == "SQ") { // SQ - Survey Question
            questionNodes.push(node);
        }
    });

    return questionNodes;
}

module.exports.generateQuestionId = function generateQuestionId(questionNumber) {
    return "v" + questionNumber; 
}

// after converting questions some of the keys might be null
// this function removes those null keys
module.exports.removeUnassignedValues = function removeUnassignedValues(outputQuestionNodes) {  
    outputQuestionNodes.forEach(function (questionNode) {
        if (questionNode === null) {
            return;
        }
    
        Object.keys(questionNode).forEach(function (key) {
            if (questionNode[key] === null) {
                delete questionNode[key];
            }
        });
    });    
}

module.exports.attachDisplayLogic = function attachDisplayLogic(outputQuestionNodes, displayLogicNodes) {
    if (displayLogicNodes === null) {
        return outputQuestionNodes;
    }

    outputQuestionNodes.forEach(function (outputQuestionNode) {
        displayLogicNodes.forEach(function (displayLogicNode) {
            var displayLogic = displayLogicNode.DisplayLogic[0][0];

            if (outputQuestionNode.oldQuestionId == displayLogic.QuestionID) {         
                var optionId = displayLogic.ChoiceLocator.split('/').pop();
                var questionToShowId = findOutputQuestionNode(outputQuestionNodes, displayLogicNode.questionToShow).id;
                var showsQuestions = outputQuestionNode.options[optionId-1].shows_questions;

                if (showsQuestions === null || typeof showsQuestions === "undefined") {
                    outputQuestionNode.options[optionId-1].shows_questions = "%i["+questionToShowId+"]";
                } else {
                    outputQuestionNode.options[optionId-1].shows_questions = showsQuestions.replace(']',' '+questionToShowId+']');
                }               
            }
        
        });
    });

    return outputQuestionNodes;
}

module.exports.attachSkipLogic = function attachSkipLogic(outputQuestionNodes, skipLogicNodesForBlocks) {
    if (skipLogicNodesForBlocks === null) {
        return outputQuestionNodes;
    }

    outputQuestionNodes.forEach(function (outputQuestionNode) {
        skipLogicNodesForBlocks.forEach(function (skipLogicNodesForBlock) {
            skipLogicNodesForBlock.forEach(function (skipLogicNode) {
                if(outputQuestionNode.oldQuestionId == skipLogicNode.QuestionID){
                    var optionId = skipLogicNode.Locator.split('/').pop();
                    var skipToQuestion = findOutputQuestionNode(outputQuestionNodes, skipLogicNode.SkipToDestination).id;
                    var questionsToHide = getOutputQiestionNodesIdBetween(outputQuestionNodes, outputQuestionNode.id, skipToQuestion);
                    outputQuestionNode.options[optionId-1].hides_questions = "%i["+questionsToHide.toString().replace(',',' ')+"]";
                }
            });
        });
    });

    return outputQuestionNodes;
}