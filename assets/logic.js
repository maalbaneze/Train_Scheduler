$(document).ready(function () {

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
    var nextTrain = "";
    var tMinutesTillTrain = 0;

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

    // ==========================================================

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

    database.ref().on("child_added", function (childSnapshot) {
        // Log everything that's coming out of snapshot
        console.log(childSnapshot.val().trainName);
        console.log(childSnapshot.val().trainDest);
        console.log(childSnapshot.val().firstTime);
        console.log(childSnapshot.val().trainFreq);
        console.log(childSnapshot.val().nextTrain);
        console.log(childSnapshot.val().tMinutesTillTrain);

        // full list of items to the well
        $("#train-data").append("<div class='well'><span class='train-name'> " +
            childSnapshot.val().trainName +
            " </span><span class='destination'> " + childSnapshot.val().trainDest +
            " </span><span class='train-time'> " + childSnapshot.val().firstTime +
            " </span><span class='frequency'> " + childSnapshot.val().trainFreq +
            " </span><span class='next-train'> " + childSnapshot.val().nextTrain +
            " </span><span class='minutes-away'> " + childSnapshot.val().tMinutesTillTrain +
            " </span></div>");

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
        // Change the HTML to reflect
        $("#added-tname").text(snapshot.val().trainName);
        $("#added-tdest").text(snapshot.val().trainDest);
        $("#added-tfreq").text(snapshot.val().trainFreq);
        $("#next-train").text(snapshot.val().nextTrain);
        $("#minutes-away").text(snapshot.val().tMinutesTillTrain);
    });


    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(tMinutesTillTrain),
        $("<td>").text(nextTrain)
    );

    // Append the new row to the table
    $("#train-data > tbody").append(newRow);


    //reset functionality
    $(".clear-all").on("click", function (event) {
        location.reload();
    });

    //auto refresh per 1 minute passed
    //updates the train data upon refresh
    setInterval("window.location.reload()", 60000);

});
