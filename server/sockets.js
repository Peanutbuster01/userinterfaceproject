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
    console.log(playerInfo)
    socket.emit("playerInfo", playerId, playerInfo);
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

  const correct = (answer === game.currentEquation.answer)
  
  if (correct) {
      io.to(lobbyId).emit("roundWinner", playerId);
    } else {
      socket.emit("wrongAnswer");
    }
  });

socket.on("requestNewQuestion", function (lobbyId) {
  const game = data.getGame(lobbyId);
  if (!game) return;

  setTimeout(() => {
    const equation = data.generateEquation(game.settings);
    game.currentEquation = equation;
    io.to(lobbyId).emit("newQuestion", equation);
  }, 5000);
});

socket.on("joinLobby", function (lobbyId) {
  socket.join(lobbyId);

  const game = data.getGame(lobbyId);
  if (!game) return;

  // Om en fråga redan finns, skicka den direkt till den här klienten
  if (game.currentEquation) {
    socket.emit("newQuestion", game.currentEquation);
  }
});


}

export { sockets };