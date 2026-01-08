function sockets(io, socket, data) {

  socket.on('getUILabels', function (lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('createGame', function (d) {
    data.createGame(d.lobbyId, d.settings)
    socket.emit('gameCreated', d.lobbyId);
  });


  socket.on('getGameSettings', function (lobbyId) {
    socket.emit('gameSettings', data.getGame(lobbyId).settings);
  });


  socket.on('submitPlayerInfo', function (playerInfo) {
    console.log("PLAYER JOINING: ")
    console.log(playerInfo);
    socket.join(playerInfo.lobbyId);

    const playerId = data.joinGame(playerInfo);
    socket.emit('playerJoined', playerId);

    const game = data.getGame(playerInfo.lobbyId);

    if (game?.participants?.length === 2) {
      io.to(playerInfo.lobbyId).emit("startGame");

      // Starta första frågan EN gång när båda är inne
      if (!game.firstQuestionScheduled) {
        game.firstQuestionScheduled = true;

        console.log("[server] scheduling first newQuestion for lobby:", playerInfo.lobbyId);

        setTimeout(() => {
          const equation = data.generateEquation(game.settings);
          game.currentEquation = equation;

          console.log("[server] emitting newQuestion to lobby:", playerInfo.lobbyId, equation);
          io.to(playerInfo.lobbyId).emit("newQuestion", equation);
        }, 5000);
      }
    }
  });

  socket.on('getPlayerInfo', function (lobbyId, playerId) {
    const playerInfo = data.getGame(lobbyId).participants[playerId];
    console.log("Now sending" + playerInfo)
    socket.emit("playerInfo", playerId, playerInfo);
  });



  socket.on('tryLobbyId', function (lobbyId) {
    const game = data.getGame(lobbyId);
    console.log("CHECK ID: " + lobbyId);
    console.log(game);
    if (game === null) {
      socket.emit("lobbyIdResponse", "invalid");

    } else if (game.participants.length >= 2) {
      console.log("CHECK ID");
      console.log(game);
      socket.emit("lobbyIdResponse", "full");

    } else {
      console.log("CHECK ID");
      console.log(game);
      socket.emit("lobbyIdResponse", "valid");
    }


  });


  socket.on('addQuestion', function (d) {
    data.addQuestion(d.lobbyId, { q: d.q, a: d.a });
    socket.emit('questionUpdate', data.activateQuestion(d.lobbyId));
  });

  socket.on('joinPoll', function (lobbyId) {
    socket.join(lobbyId);
    socket.emit('questionUpdate', data.activateQuestion(lobbyId))
    socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(lobbyId));
  });

  socket.on('participateInPoll', function (d) {
    data.participateInPoll(d.lobbyId, d.name);
    io.to(d.lobbyId).emit('participantsUpdate', data.getParticipants(d.lobbyId));
  });
  socket.on('startPoll', function (lobbyId) {
    io.to(lobbyId).emit('startPoll');
  })
  socket.on('runQuestion', function (d) {
    let question = data.activateQuestion(d.lobbyId, d.questionNumber);
    io.to(d.lobbyId).emit('questionUpdate', question);
    io.to(d.lobbyId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.lobbyId));
  });

  socket.on('submitAnswer', function (d) {
    data.submitAnswer(d.lobbyId, d.answer);
    io.to(d.lobbyId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.lobbyId));
  });

  socket.on("answer", (lobbyId, playerId, answer) => {
    const game = data.getGame(lobbyId);
    if (!game) return;
    if (game.gameOver) return;

    const correct = (answer === game.currentEquation.answer)

    if (correct) {
      io.to(lobbyId).emit("roundWinner", playerId);
    } else {
      socket.emit("wrongAnswer");
    }
  });

  //socket.on("requestNewQuestion", function (lobbyId) {
  //  const game = data.getGame(lobbyId);
  // if (!game) return;

  // setTimeout(() => {
  //  const equation = data.generateEquation(game.settings);
  //  game.currentEquation = equation;
  //   io.to(lobbyId).emit("newQuestion", equation);
  //  }, 5000);
  //});

  socket.on("joinLobby", function (lobbyId) {
    socket.join(lobbyId);

    const game = data.getGame(lobbyId);
    if (!game) return;

    // Om en fråga redan finns, skicka den direkt till den här klienten
    if (game.currentEquation) {
      socket.emit("newQuestion", game.currentEquation);
    }
  });

  socket.on("shoot", ({ lobbyId, playerId, shootIndex }) => {

    const game = data.getGame(lobbyId);
    if (!game) return;
    if (game.gameOver) return;

    if (!game.shots) game.shots = { 0: {}, 1: {} };
    if (!game.shots[0]) game.shots[0] = {};
    if (!game.shots[1]) game.shots[1] = {};

    if (!game.scores) game.scores = [0, 0];
    if (game.scores[0] == null) game.scores[0] = 0;
    if (game.scores[1] == null) game.scores[1] = 0;

    const opponentId = (playerId === 0) ? 1 : 0;
    const opponent = game.participants[opponentId];

    const opponentShips = opponent?.placedShips || [];
    const hit = opponentShips.includes(shootIndex);


    game.shots[playerId][shootIndex] = hit ? "hit" : "miss";
    if (hit) game.scores[playerId] += 1;
    const winner = (game.scores[playerId] >= 3) ? playerId : null;

    console.log("[server] emitting shotResult:", { lobbyId, playerId, shootIndex, hit, scores: game.scores });

    // Skicka till båda spelare i lobbyn
    io.to(lobbyId).emit("shotResult", {
      shooterId: playerId,
      shootIndex,
      hit,
      shots: game.shots,
      scores: game.scores,
      winner,
    });

    if (winner !== null) {
      game.gameOver = true;

      io.to(lobbyId).emit("gameOver", {
        winnerId: winner,
        scores: game.scores
      });

      return;
    }
    io.to(lobbyId).emit("closePopups");
    io.to(lobbyId).emit("waitingForNextQuestion");

    // Guard: schemalägg bara en ny fråga per skott/round
    if (game.nextQuestionScheduled) return;
    game.nextQuestionScheduled = true;

    setTimeout(() => {

      if (game.gameOver) {
        game.nextQuestionScheduled = false;
        return;
      }

      const equation = data.generateEquation(game.settings);
      game.currentEquation = equation;

      io.to(lobbyId).emit("newQuestion", equation);

      // Släpp guard när frågan skickats
      game.nextQuestionScheduled = false;
    }, 5000);



  });

  socket.on("newRound", function (lobbyId, confirmShot) {
    const game = data.getGame(lobbyId);
    if (!game) return;
    // TODO
  });


}

export { sockets };