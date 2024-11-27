// Unexpected Reward
Qualtrics.SurveyEngine.addOnload(function () {
  this.hideNextButton();

  // Initial setup
  var data = [];
  var noResponse = 0;
  var trialNumber = 1;
  var totalTrials = 120;
  var reversalStreak = 0;
  var correctStreak = 0;
  var correctLimit = Math.floor(Math.random() * 5) + 5; // Random criterion between 5 and 9
  var isReversed = false;
  var lastStimulus = null; // Track the last stimulus shown
  var sameStimulusAfterReversal = false; // Flag for showing the same stimulus after reversal
  var startReversal = false; // Flag for the start of reversal
  var startTime;
  var responseTime;

  // Randomise starting stimuli
  var stimuli = {
    A: "reward", // Stimulus A initially rewards
    B: "punishment", // Stimulus B initially punishes
  };
  if (Math.random() < 0.5) {
    stimuli = {
      A: "punishment", // Stimulus A initially punishes
      B: "reward", // Stimulus B initially rewards
    };
  }

  var isAReward = true;

  // Function to show instructions before starting
  function showStartInstruction() {
    var startDiv = document.createElement("div");
    startDiv.id = "startInstruction";
    startDiv.innerHTML = "Click <b>HERE</b> to start"; // Add your instruction
    startDiv.style.fontSize = "32px";
    startDiv.style.textAlign = "center";
    startDiv.style.marginTop = "200px";
    startDiv.style.cursor = "pointer"; // Change cursor to indicate clickable
    document.body.prepend(startDiv);

    // Wait for user to click before starting the task
    startDiv.onclick = function () {
      startDiv.remove(); // Remove the instruction
      showFixationCross(); // Start the first trial
    };
  }

  // Function to show fixation cross
  function showFixationCross() {
    var fixationCross = document.createElement("div");
    fixationCross.id = "fixationCross";
    fixationCross.innerHTML = "+";
    fixationCross.style.fontSize = "32px";
    fixationCross.style.textAlign = "center";
    fixationCross.style.marginTop = "200px";
    document.body.prepend(fixationCross);

    setTimeout(function () {
      fixationCross.remove();
      displayStimulus(); // Show stimulus after 1000 ms
    }, 1000);
  }

  // Function to display stimulus and capture response
  function displayStimulus() {
    var displayedStimulus;
    startTime = Date.now();

    // Check if we need to show the same stimulus after a reversal
    if (startReversal) {
      displayedStimulus = isAReward ? "A" : "B"; // Use the current reward stimulus
      sameStimulusAfterReversal = true; // Set flag to show the same stimulus for the next trial
      startReversal = false;
      reversalStreak = 1; // Starts reversal streak
    } else if (sameStimulusAfterReversal) {
      displayedStimulus = lastStimulus; // Use the last stimulus shown

      console.log("Showing the same stimulus");
    } else {
      // Shuffle stimuli
      var stimulusOrder = Math.random() < 0.5 ? ["A", "B"] : ["B", "A"];
      displayedStimulus = stimulusOrder[0]; // Choose the first stimulus for this trial
    }

    // Get the actual outcome
    var actualOutcome = stimuli[displayedStimulus];

    // Create the container for stimuli
    var stimulusContainer = document.createElement("div");
    stimulusContainer.id = "stimulusContainer";
    stimulusContainer.style.display = "flex";
    stimulusContainer.style.flexDirection = "column"; // For vertical alignment
    stimulusContainer.style.alignItems = "center"; // Center alignment
    stimulusContainer.style.marginTop = "200px";

    // Create stimulus A
    var stimulusA = document.createElement("div");
    stimulusA.innerHTML =
      "<img src='https://nus.au1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_liS2mCAu6ovYGGJ' style='width: 100px; height: 100px;'>";
    stimulusA.style.border =
      displayedStimulus === "A" ? "5px solid black" : "none"; // Highlight if selected

    // Create fixation cross
    var fixationCross = document.createElement("div");
    fixationCross.innerHTML = "+";
    fixationCross.style.fontSize = "32px";

    // Create stimulus B
    var stimulusB = document.createElement("div");
    stimulusB.innerHTML =
      "<img src='https://nus.au1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_qbvwqRIC7JeRiVX' style='width: 100px; height: 100px;'>";
    stimulusB.style.border =
      displayedStimulus === "B" ? "5px solid black" : "none"; // Highlight if selected

    // Randomise the position of stimulus A and stimulus B
    if (Math.random() < 0.5) {
      stimulusContainer.appendChild(stimulusA);
      stimulusContainer.appendChild(fixationCross);
      stimulusContainer.appendChild(stimulusB);
    } else {
      stimulusContainer.appendChild(stimulusB);
      stimulusContainer.appendChild(fixationCross);
      stimulusContainer.appendChild(stimulusA);
    }

    // Append the container to the body
    document.body.prepend(stimulusContainer);

    // Capture keyboard input
    var responseCaptured = false;
    var responseTimeout = setTimeout(function () {
      if (!responseCaptured) {
        logResponse("none", displayedStimulus, actualOutcome); // No response captured
        stimulusContainer.remove();
      }
    }, 1500); // Allow 1500 ms to respond

    // Listen for key presses
    document.onkeydown = function (event) {
      if (responseCaptured) return;
      var key = event.key.toLowerCase();

      if (key === "p" || key === "r") {
        responseTime = Date.now() - startTime;
        responseCaptured = true;
        clearTimeout(responseTimeout); // Stop timeout
        var predictedOutcome = key === "p" ? "punishment" : "reward"; // Prediction based on key press
        logResponse(predictedOutcome, displayedStimulus, actualOutcome); // Log the response
        stimulusContainer.remove();
      }
    };
  }

  // Log the response and provide feedback
  function logResponse(predictedOutcome, stimulus, actualOutcome) {
    var isCorrect = predictedOutcome === actualOutcome ? 1 : 0;

    var feedbackDiv = document.createElement("div");
    feedbackDiv.id = "feedback";
    feedbackDiv.style.fontSize = "32px";
    feedbackDiv.style.textAlign = "center";
    feedbackDiv.style.marginTop = "200px";

    // Feedback depending on the response
    if (predictedOutcome === "none") {
      feedbackDiv.innerHTML = "No Response"; // No response
      feedbackDiv.style.color = "red";
      noResponse = 1;
      // Qualtrics.SurveyEngine.setEmbeddedData("NoResponse", 1);
    } else if (actualOutcome === "reward") {
      feedbackDiv.innerHTML =
        "<img src='https://nus.au1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_bMpiEUVsi4mNi6b' alt='Reward' style='width: 100px; height: 100px;'>";
    } else {
      feedbackDiv.innerHTML =
        "<img src='https://nus.au1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_V4exMgkjGPOqGEl' style='width: 100px; height: 100px;'>";
    }

    document.body.prepend(feedbackDiv);

    // If user prediction is accurate, increase the correct streak, else restart counter
    if (predictedOutcome === actualOutcome) correctStreak++;
    else correctStreak = 0;

    // Logging
    console.log(
      "current streak:",
      correctStreak,
      " correct limit:",
      correctLimit
    );
    console.log("stimulus", stimulus);
    console.log(
      "user prediction:",
      predictedOutcome,
      " actual outcome:",
      actualOutcome,
      "is user correct:",
      predictedOutcome === actualOutcome
    );

    // Check for reversal condition
    // Start of reversal
    var reversalOccurred;
    if (correctStreak === correctLimit) {
      // Unepxected Reward
      // Reverse the reward and punishment
      isReversed = !isReversed;
      stimuli.A = isReversed ? "punishment" : "reward"; // Update stimulus A
      stimuli.B = isReversed ? "reward" : "punishment"; // Update stimulus B
      isAReward = !isAReward;
      startReversal = true;
      correctLimit = Math.floor(Math.random() * 5) + 5; // Reset learning criterion
      correctStreak = 0; // Reset streak after reversal
      reversalOccurred = 1;

      console.log("ReversalOccurred");
      console.log("is A reward:", isAReward);
    } else if (sameStimulusAfterReversal) {
      lastStimulus = stimulus; // Remember the current stimulus to repeat
      if (predictedOutcome === actualOutcome) sameStimulusAfterReversal = false; // If user has learnt, reset the flag for future trials so the next stimulus will be random
    } else {
      reversalOccurred = 0;
    }

    data.push({
      trialNumber: trialNumber,
      displayStimulus: stimulus,
      noResponse: noResponse,
      participantPrediction: predictedOutcome,
      actualOutcome: actualOutcome,
      isCorrect: isCorrect,
      reversalOccurred: reversalOccurred,
      correctStreak: correctStreak,
      responseTime: responseTime,
    });
    console.log("data", data);

    if (trialNumber === totalTrials)
      Qualtrics.SurveyEngine.setEmbeddedData("Data", JSON.stringify(data));

    // Move to the next trial after feedback
    setTimeout(() => {
      feedbackDiv.remove();
      trialNumber++;

      // Continue to the next trial or end the block
      if (trialNumber <= totalTrials) {
        showFixationCross(); // Start next trial
      } else {
        alert("Block complete!");
        var nextButton = document.querySelector(".NextButton");
        if (nextButton) {
          // Make the button visible
          nextButton.style.display = "block";

          var question = document.querySelector(".QuestionText");
          question.innerHTML = "Please proceed by clicking Next";
        }
      }
    }, 500); // Show feedback for 500 ms
  }

  // Show the start instruction and wait for the participant to click
  showStartInstruction();
});

Qualtrics.SurveyEngine.addOnReady(function () {
  /*Place your JavaScript here to run when the page is fully displayed*/
});

Qualtrics.SurveyEngine.addOnUnload(function () {
  /*Place your JavaScript here to run when the page is unloaded*/
});
