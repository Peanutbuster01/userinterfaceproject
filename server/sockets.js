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

    if (data.getGame(playerInfo.lobbyId)?.participants?.length === 2) {
      io.to(playerInfo.lobbyId).emit('startGame');
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
  
  const equation = data.generateEquation();
  game.currentEquation = equation;

  io.to(lobbyId).emit("newQuestion", equation);
});


  


}

export { sockets };