var server = require("../mocks/serverMock.js")
var assert = require("../asserts.js")

function testGet_ValidSurvey(pathToQsfFile){    
    var output = server.get(pathToQsfFile);

    assert.AreNotEqual(output, null);
    assert.AreEqual(output.length, 8);
}

function testGet_EmptySurvey(pathToQsfFile){    
    var output = server.get(pathToQsfFile);

    var expectedValue = [];
    assert.AreEqual(output.toString(), expectedValue.toString());
}

module.exports.runTests = function runTests() {
    var pathToValidSurvey = __dirname + "/../input/" + "testValidSurvey.qsf" // valid survey containing different types of questions
    var pathToEmptySurvey = __dirname + "/../input/" + "testEmptySurvey.qsf" // empty survey which contains 1 question in trash block

    runTest(testGet_ValidSurvey, pathToValidSurvey);
    runTest(testGet_EmptySurvey, pathToEmptySurvey);
}

function runTest(testFunctionHandler, pathToQsfFile) {
    if (typeof testFunctionHandler !== 'function') {
        throw new Error("runTest error. Invalid test function handler.");
    }

    try {
        testFunctionHandler(pathToQsfFile);
        console.log('Test passed - ' + testFunctionHandler.name + '.');
    } catch (error) {
        console.log('Test failed - ' + testFunctionHandler.name + '.');
        console.log('Message: '+ error.message + '\n');
    }
}