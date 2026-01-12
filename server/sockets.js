function sockets(io, socket, data) {

  socket.on('getUILabels', function (lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('createGame', function (d) {
    data.createGame(d.gameId, d.settings)
    socket.emit('gameCreated', d.gameId);
  });

  socket.on('generateGameId', function () {
    let gameId;

    function generateFourDigitId() {
      let id = "";

      for (let i = 0; i < 4; i++) {
        const digit = Math.floor(Math.random() * 10);
        id += digit.toString();
      }

      return id;
    }

    do {
      gameId = generateFourDigitId();
    } while (data.getGame(gameId)); 

    socket.emit("gameGenerated", gameId);
  });


  socket.on('getGameSettings', function (gameId) {
    socket.emit('gameSettings', data.getGame(gameId).settings);
  });


  socket.on('submitPlayerInfo', function (playerInfo) {
    console.log("PLAYER JOINING: ")
    console.log(playerInfo);

    const game = data.getGame(playerInfo.gameId);

    if (game?.participants?.length === 2) {
      socket.emit('gameFull');
      return;
    }

    socket.join(playerInfo.gameId);

    const playerId = data.joinGame(playerInfo);
    socket.emit('playerJoined', playerId);

    if (game?.participants?.length === 2) {
      io.to(playerInfo.gameId).emit("startGame");

      if (!game.firstQuestionScheduled) {
        game.firstQuestionScheduled = true;

        console.log("[server] scheduling first newQuestion for game:", playerInfo.gameId);

        setTimeout(() => {
          const equation = data.generateEquation(game.settings);
          game.currentEquation = equation;

          console.log("[server] emitting newQuestion to game:", playerInfo.gameId, equation);
          io.to(playerInfo.gameId).emit("newQuestion", equation);
        }, 5000);
      }
    }
  });

  socket.on('getPlayerInfo', function (gameId, playerId) {
    const playerInfo = data.getGame(gameId).participants[playerId];
    console.log("Now sending" + playerInfo)
    socket.emit("playerInfo", playerId, playerInfo);
  });



  socket.on('tryGameId', function (gameId) {
    const game = data.getGame(gameId);
    console.log("CHECK ID: " + gameId);
    console.log(game);
    if (game === null) {
      socket.emit("gameIdResponse", "invalid");

    } else if (game.participants.length >= 2) {
      console.log("CHECK ID");
      console.log(game);
      socket.emit("gameIdResponse", "full");

    } else {
      console.log("CHECK ID");
      console.log(game);
      socket.emit("gameIdResponse", "valid");
    }


  });


  socket.on('participateInGame', function (d) {
    data.participateInGame(d.gameId, d.name);
    io.to(d.gameId).emit('participantsUpdate', data.getParticipants(d.gameId));
  });

  socket.on('startGame', function (gameId) {
    io.to(gameId).emit('startGame');
  })


  socket.on("answer", (gameId, playerId, answer) => {
    const game = data.getGame(gameId);
    if (!game) return;
    if (game.gameOver) return;

    const correct = (answer === game.currentEquation.answer)

    if (correct) {
      io.to(gameId).emit("roundWinner", playerId);
    } else {
      socket.emit("wrongAnswer");
    }
  });

  socket.on("joinGame", function (gameId) {
    socket.join(gameId);

    const game = data.getGame(gameId);
    if (!game) return;

    if (game.currentEquation) {
      socket.emit("newQuestion", game.currentEquation);
    }
  });


  socket.on("shoot", ({ gameId, playerId, shootIndex }) => {

    const game = data.getGame(gameId);
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

    io.to(gameId).emit("shotResult", {
      shooterId: playerId,
      shootIndex,
      hit,
      shots: game.shots,
      scores: game.scores,
      winner,
    });

    if (winner !== null) {
      game.gameOver = true;

      io.to(gameId).emit("gameOver", {
        winnerId: winner,
        scores: game.scores
      });

      return;
    }
    
     setTimeout(() => {

    if (game.gameOver) return;

    io.to(gameId).emit("closePopups");
    io.to(gameId).emit("waitingForNextQuestion");

    if (game.nextQuestionScheduled) return;
    game.nextQuestionScheduled = true; 

    setTimeout(() => { 
      if (game.gameOver) { 
        game.nextQuestionScheduled = false; 
        return; 
      }

      const equation = data.generateEquation(game.settings); 
      game.currentEquation = equation; 
      io.to(gameId).emit("newQuestion", equation); 

      game.nextQuestionScheduled = false;
    }, 5000);

  }, 1500); 
});

  socket.on("getShots", function (gameId) {
    const game = data.getGame(gameId);
    socket.emit("shots", game.shots)
  });
}

export { sockets };