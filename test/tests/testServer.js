var server = require("../mocks/serverMock.js")
var assert = require("../asserts.js")

function testGet(pathToQsfFile){    
    var output = server.get(pathToQsfFile);

    assert.AreNotEqual(output, null);
}

module.exports.runTests = function runTests() {
    var pathToQsfFile = __dirname + "/../input/" + "testSurvey.qsf"

    runTest(testGet, pathToQsfFile);
}

function runTest(testFunctionHandler, pathToQsfFile) {
    if(typeof testFunctionHandler !== 'function'){
        throw new Error("runTest error. Invalid test function handler.");
    }

    try {
        testFunctionHandler(pathToQsfFile);
        console.log('Test passed - ' + testFunctionHandler.name);
    } catch (error) {
        console.log('Test failed - ' + testFunctionHandler.name + '\nMessage: '+ error.message);
    }
}