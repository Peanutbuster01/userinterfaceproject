'use strict';
import { readFileSync } from "fs";

// Store data in an object to keep the global namespace clean. In an actual implementation this would be interfacing a database...
function Data() {
  this.games = {};
  this.games['test'] = {
    lang: "en",
    questions: [],
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

Data.prototype.gameExists = function (gameId) {
  return typeof this.games[gameId] !== "undefined"
}

Data.prototype.getUILabels = function (lang) {
  //check if lang is valid before trying to load the dictionary file
  if (!["en", "sv"].some(el => el === lang))
    lang = "en";
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

Data.prototype.createGame = function (gameId, settings) {
  if (!this.gameExists(gameId)) {
    let game = {};
    game.participants = [];
    game.currentQuestion = "";
    game.settings = settings;

    game.currentEquation = null;
    game.firstQuestionScheduled = false;

    this.games[gameId] = game;
    console.log("game created", gameId, game);
  }
  return this.games[gameId];
}

Data.prototype.getGame = function (gameId) {
  if (this.gameExists(gameId)) {
    return this.games[gameId];
  }
  return null;
}

Data.prototype.joinGame = function (d) {
  if (this.gameExists(d.gameId)) {
    this.games[d.gameId].participants.push({ playerName: d.name, placedShips: d.ships, avatarIndex: d.avatarIndex })
    return this.games[d.gameId].participants.length - 1;
  }
}


Data.prototype.getParticipants = function (gameId) {
  const game = this.games[gameId];
  console.log("participants requested for", gameId);
  if (this.gameExists(gameId)) {
    return this.games[gameId].participants
  }
  return [];
}


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



