function sockets(io, socket, data) {

  socket.on('getUILabels', function (lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('createGame', function (d) {
    data.createGame(d.lobbyID, d.settings)
    socket.emit('gameCreated', d.lobbyID);
  });



  socket.on('getGameSettings', function (lobbyID) {
    socket.emit('gameSettings', data.getGame(lobbyID).settings);
  });




  socket.on('addQuestion', function (d) {
    data.addQuestion(d.lobbyID, { q: d.q, a: d.a });
    socket.emit('questionUpdate', data.activateQuestion(d.lobbyID));
  });

  socket.on('joinPoll', function (lobbyID) {
    socket.join(lobbyID);
    socket.emit('questionUpdate', data.activateQuestion(lobbyID))
    socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(lobbyID));
  });

  socket.on('participateInPoll', function (d) {
    data.participateInPoll(d.lobbyID, d.name);
    io.to(d.lobbyID).emit('participantsUpdate', data.getParticipants(d.lobbyID));
  });
  socket.on('startPoll', function (lobbyID) {
    io.to(lobbyID).emit('startPoll');
  })
  socket.on('runQuestion', function (d) {
    let question = data.activateQuestion(d.lobbyID, d.questionNumber);
    io.to(d.lobbyID).emit('questionUpdate', question);
    io.to(d.lobbyID).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.lobbyID));
  });

  socket.on('submitAnswer', function (d) {
    data.submitAnswer(d.lobbyID, d.answer);
    io.to(d.lobbyID).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.lobbyID));
  });

  socket.on('submitPlayerInfo', function (playerInfo) {
    data.joinGame(playerInfo);
    socket.emit('playerJoined')
  });



  // name: this.playerName,
  // ships: this.placedShips,
  //lobbyNum: this.lobbyID,
  //charIndex: this.characterIndex

}

export { sockets };