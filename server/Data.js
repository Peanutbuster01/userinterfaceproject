'use strict';
import { readFileSync } from "fs";

// Store data in an object to keep the global namespace clean. In an actual implementation this would be interfacing a database...
function Data() {
  this.polls = {};
  this.polls['test'] = {
    lang: "en",
    questions: [
      {
        q: "How old are you?",
        a: ["0-13", "14-18", "19-25", "26-35", "36-45", "45-"]
      },
      {
        q: "How much do you enjoy coding?",
        a: ["1", "2", "3", "4", "5"]
      }
    ],
    answers: [],
    currentQuestion: 0,
    participants: []
  }
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.pollExists = function (pollId) {
  return typeof this.polls[pollId] !== "undefined"
}

Data.prototype.getUILabels = function (lang) {
  //check if lang is valid before trying to load the dictionary file
  if (!["en", "sv"].some(el => el === lang))
    lang = "en";
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

Data.prototype.createGame = function (pollId, settings) {
  if (!this.pollExists(pollId)) {
    let poll = {};
    poll.participants = [];
    poll.currentQuestion = "";
    poll.settings = settings;

    poll.currentEquation = null;
    poll.firstQuestionScheduled = false;

    this.polls[pollId] = poll;
    console.log("poll created", pollId, poll);
  }
  return this.polls[pollId];
}

Data.prototype.getGame = function (pollId) {
  if (this.pollExists(pollId)) {
    return this.polls[pollId];
  }
  return null;
}

Data.prototype.joinGame = function (d) {
  if (this.pollExists(d.lobbyId)) {
    this.polls[d.lobbyId].participants.push({ playerName: d.name, placedShips: d.ships, avatarIndex: d.avatarIndex })
    return this.polls[d.lobbyId].participants.length - 1;
  }
}


Data.prototype.getParticipants = function (pollId) {
  const poll = this.polls[pollId];
  console.log("participants requested for", pollId);
  if (this.pollExists(pollId)) {
    return this.polls[pollId].participants
  }
  return [];
}

Data.prototype.addQuestion = function (pollId, q) {
  if (this.pollExists(pollId)) {
    this.polls[pollId].questions.push(q);
  }
}

Data.prototype.activateQuestion = function (pollId, qId = null) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    if (qId !== null) {
      poll.currentQuestion = qId;
    }
    return poll.questions[poll.currentQuestion];
  }
  return {}
}

Data.prototype.getSubmittedAnswers = function (pollId) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return answers;
    }
  }
  return {}
}

Data.prototype.submitAnswer = function (pollId, answer) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    let answers = poll.answers[poll.currentQuestion];
    // create answers object if no answers have yet been submitted
    if (typeof answers !== 'object') {
      answers = {};
      answers[answer] = 1;
      poll.answers.push(answers);
    }
    // create answer property if that specific answer has not yet been submitted
    else if (typeof answers[answer] === 'undefined') {
      answers[answer] = 1;
    }
    // if the property already exists, increase the number
    else
      answers[answer] += 1
    console.log("answers looks like ", answers, typeof answers);
  }
};

Data.prototype.randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
  };

Data.prototype.makeAddition = function (level) {
  const a = this.randomInt(level.min, level.max);
  const b = this.randomInt(level.min, level.max);

    return {
    question: `${a} + ${b} = ?`,
    answer: a + b
    };
  };

  Data.prototype.makeSubtraction = function (level) {
    const a = this.randomInt(level.min, level.max);
    const b = this.randomInt(level.min, level.max);

    return {
      question: `${a} - ${b} = ?`,
      answer: a - b
    };
  };

  Data.prototype.makeMultiplication = function (level) {
    const a = this.randomInt(level.min, level.max);
    const b = this.randomInt(level.min, level.max);

      return {
        question: `${a} × ${b} = ?`,
        answer: a * b
      };
    };

  Data.prototype.makeDivision = function (level) {
    const b = this.randomInt(level.min + 1, level.max); // undvik division med 0
    const answer = this.randomInt(level.min, level.max);
    const a = b * answer; // se till att det går jämnt ut

    return {
      question: `${a} ÷ ${b} = ?`,
      answer: answer
    };
  };

  Data.prototype.chosenGameSetting = function (level, operations) {
  let chosenMethods = [];
  let levelRange = { min: 0, max: 0 };

  if (level === "easy") {
    levelRange = { min: 0, max: 10 };
  } else if (level === "medium") {
    levelRange = { min: 0, max: 20 };
  } else if (level === "hard") {
    levelRange = { min: 0, max: 50 };
  } else {
    levelRange = { min: 0, max: 100 }; // nightmare
  }

  if (operations.includes("addition")) {
    chosenMethods.push(this.makeAddition.bind(this));
  }
  if (operations.includes("subtraction")) {
    chosenMethods.push(this.makeSubtraction.bind(this));
  }
  if (operations.includes("multiplication")) {
    chosenMethods.push(this.makeMultiplication.bind(this));
  }
  if (operations.includes("division")) {
    chosenMethods.push(this.makeDivision.bind(this));
  }

  return {
    level: levelRange,
    operations: chosenMethods
  };
};

Data.prototype.generateEquation = function (settings) {
  const chosenGameSetting = this.chosenGameSetting(settings.level, settings.operations);

  const operations = chosenGameSetting.operations;
  const levelRange = chosenGameSetting.level;

  const randomCalculationMethod = operations[Math.floor(Math.random() * operations.length)];
  const equation = randomCalculationMethod(levelRange);

  return equation; 
};



export { Data };



