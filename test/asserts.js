module.exports = {

    AreEqual: function (actual, expected) {
        if (expected !== actual) {
            throw new Error("Assert.AreEqual failed. Expected value " + expected + " is not equal to " + actual + '.');
        }
    },

    AreNotEqual: function (actual, expected) {
        if (expected === actual) {
            throw new Error("Assert.AreNotEqual failed. Expected value " + expected + " is equal to " + actual + '.');
        }
    },

    IsTrue: function (booleanValue) {
        if (typeof booleanValue !== "boolean") {
            throw new Error("Assert.IsTrue failed. Paramater is not a boolean value.");
        }
        if (booleanValue == false) {
            throw new Error("Assert.IsTrue failed.");
        }
    }

};