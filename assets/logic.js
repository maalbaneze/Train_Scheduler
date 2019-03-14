//$(document).ready(function() { 

// Initialize Firebase
var config = {
    apiKey: "AIzaSyAaERLMck0DQaiBltfCVNLcUWNalcKIioA",
    authDomain: "train-scheduler-hw7-5fa61.firebaseapp.com",
    databaseURL: "https://train-scheduler-hw7-5fa61.firebaseio.com",
    projectId: "train-scheduler-hw7-5fa61",
    storageBucket: "",
    messagingSenderId: "45239022691"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Initial Values
var trainName = "";
var trainDest = "";
var firstTime = 0;
var trainFreq = "";

// Capture Button Click
$("#add-train").on("click", function (event) {
    event.preventDefault();

    // Grabbed values from text boxes
    trainName = $("#train-name").val().trim();
    trainDest = $("#destination").val().trim();
    firstTrainTime = $("#train-time").val().trim();
    trainFreq = $("#frequency").val().trim();

    // Code for handling the push
    database.ref().push({
        trainName: trainName,
        trainDest: trainDest,
        firstTime: firstTime,
        trainFreq: trainFreq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

});

dataRef.ref().on("child_added", function (childSnapshot) {
    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().trainDest);
    console.log(childSnapshot.val().firstTime);
    console.log(childSnapshot.val().trainFreq);

    // full list of items to the well
    $("#train-data").append("<div class='well'><span class='train-name'> " +
        childSnapshot.val().trainName +
        " </span><span class='destination'> " + childSnapshot.val().trainDest +
        " </span><span class='train-time'> " + childSnapshot.val().firstTime +
        " </span><span class='frequency'> " + childSnapshot.val().trainFreq +
        " </span></div>");

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
    // Change the HTML to reflect
    $("#added-tname").text(snapshot.val().trainName);
    $("#added-tdest").text(snapshot.val().trainDest);
    $("#added-tfreq").text(snapshot.val().trainFreq);
    $("#next-train").text(snapshot.val().nextTrain);
    $("#minutes-away").text(snapshot.val().tMinutesTillTrain);
});
// Assume the following situations.

// (TEST 1)
// First Train of the Day is 3:00 AM
// Assume Train comes every 3 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:18 -- 2 minutes away

// (TEST 2)
// First Train of the Day is 3:00 AM
// Assume Train comes every 7 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:21 -- 5 minutes away


// ==========================================================

// Solved Mathematically
// Test case 1:
// 16 - 00 = 16
// 16 % 3 = 1 (Modulus is the remainder)
// 3 - 1 = 2 minutes away
// 2 + 3:16 = 3:18

// Solved Mathematically
// Test case 2:
// 16 - 00 = 16
// 16 % 7 = 2 (Modulus is the remainder)
// 7 - 2 = 5 minutes away
// 5 + 3:16 = 3:21

// Assumptions
//var tFrequency = 3;

// Time is 3:30 AM
//var firstTime = "03:30";

// First Time (pushed back 1 year to make sure it comes before current time)
var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
console.log(firstTimeConverted);

// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % trainFreq;
console.log(tRemainder);

// Minute Until Train
var tMinutesTillTrain = trainFreq - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

//});
