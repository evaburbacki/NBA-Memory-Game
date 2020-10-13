const allImages = [
    "img/giannis.jpg",
    "img/jamesharden.jpg",
    "img/kareemabdul.jpeg",
    "img/kevindurant.jpg",
    "img/kobebryant.jpg",
    "img/lebron.jpg",
    "img/magicjohnson.jpg",
    "img/michaeljordan.jpg",
    "img/shaq.jpg",
    "img/stephcurry.jpg",
    "img/giannis.jpg",
    "img/jamesharden.jpg",
    "img/kareemabdul.jpeg",
    "img/kevindurant.jpg",
    "img/kobebryant.jpg",
    "img/lebron.jpg",
    "img/magicjohnson.jpg",
    "img/michaeljordan.jpg",
    "img/shaq.jpg",
    "img/stephcurry.jpg",
  ];
  const nbaLogoUrl = "url('img/nba-logo.jpg')";
  let clickCounter = 0;
  let clickedCardId;
  let turnCounter = 0;
  let board = [];
  let card1Id;
  let card2Id;
  let card1Url;
  let card2Url;
  let canClick = true; // protection against playing out of turn
  let matchCounter = 0;
  let players = ["player1", "player2"];
  let currentPlayerId;
  let nextPlayerId;
  let playerNames;
  
  const getRandomInt = (min, max) => {
    // this function will randomize which player is starting
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  const shuffle = (array) => {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  };
  
  const flipBackAll = () => {
    const allCards = document.getElementsByClassName("card");
    for (let i = 0; i < allCards.length; i++) {
      allCards[i].style.backgroundImage = nbaLogoUrl;
    }
  };
  
  const initGame = (turnManager) => {
    playerNames = {
      player1: "Player 1",
      player2: "Player 2",
    };
    flipBackAll();
    const playerIndex = getRandomInt(0, 1);
    currentPlayerId = players[playerIndex];
    turnManager.currentPlayerId = currentPlayerId;
    if (playerIndex === 0) {
      turnManager.nextPlayerId = players[1];
    } else {
      turnManager.nextPlayerId = players[0];
    }
    const player1PointsElement = document.getElementById('player1-points');
    const player2PointsElement = document.getElementById('player2-points');
    const state = document.getElementById('state');
    player1PointsElement.innerHTML = 0;
    player2PointsElement.innerHTML = 0;
    console.log(state);
    setTimeout(() => {
      state.innerHTML = `${playerNames[currentPlayerId]} is starting`;
    }, 1000);
    return shuffle(allImages);
  };
  const flipBack = (card1Id, card2Id) => {
    document.getElementById(card1Id).style.backgroundImage = nbaLogoUrl;
    document.getElementById(card2Id).style.backgroundImage = nbaLogoUrl;
  };
  
  document.addEventListener("DOMContentLoaded", (event) => {
    const resetButton = document.getElementById("reset");
    resetButton.style.display = "none";
    const turnManager = {
      previousPlayerId: "",
      nextPlayerId: "",
      currentPlayerId: "",
      points: {
        player1: 0,
        player2: 0,
      },
    };
    board = initGame(turnManager);
    
    const playerHighlight = document.getElementById(turnManager.currentPlayerId);
    playerHighlight.style.color = 'red';
  
    const allCards = document.getElementsByClassName("card");
    document.getElementById("reset").addEventListener("click", (event) => {
      board = initGame(turnManager);
      resetButton.style.display = "none";
    });
    const player1PointsElement = document.getElementById('player1-points');
    const player2PointsElement = document.getElementById('player2-points');
    for (let i = 0; i < allCards.length; i++) {
      allCards[i].addEventListener("click", (event) => {
        if (canClick) {
          state.style.display = 'none';
          const clickedCard = event.target;
          const currentCardId = clickedCard.getAttribute("id");
  
          if (currentCardId !== clickedCardId) {
            clickCounter++;
            clickedCardId = currentCardId;
            turnCounter++;
            if (turnCounter === 2) {
                canClick = false;
            }
          }
          const clickedCardImageUrl = board[clickedCardId];
          if (clickCounter % 2 !== 0) {
            card1Id = currentCardId;
            card1Url = clickedCardImageUrl;
          } else {
            card2Id = currentCardId;
            card2Url = clickedCardImageUrl;
          }
          if (turnCounter === 2) {
            if (card2Url !== card1Url) {
              setTimeout(() => {
                flipBack(card1Id, card2Id);
                canClick = true;
              }, 2000);
            } else {
              matchCounter++;
              canClick = true;
              turnManager.points[turnManager.currentPlayerId]++; // increase the points for the current player
            }
            turnCounter = 0;
            turnManager.previousPlayerId = turnManager.currentPlayerId;
            turnManager.currentPlayerId = turnManager.nextPlayerId;
            turnManager.nextPlayerId = turnManager.previousPlayerId;
            player1PointsElement.innerHTML = turnManager.points.player1;
            player2PointsElement.innerHTML = turnManager.points.player2;
            document.getElementById(turnManager.currentPlayerId).style.color = 'red';
            document.getElementById(turnManager.nextPlayerId).style.color = 'white';
          }
          clickedCard.style.backgroundImage = `url('${clickedCardImageUrl}')`;
          if (matchCounter === 10) {
            resetButton.style.display = "";
            setTimeout(() => {
              let result;
              if (turnManager.points.player1 > turnManager.points.player2) {
                result = `${playerNames.player1} wins`;
              } else if (
                turnManager.points.player1 < turnManager.points.player2
              ) {
                result = `${playerNames.player2} wins`;
              } else {
                result = "Its a tie";
              }
              state.style.display = 'unset';
              state.innerHTML = `Buckets!!!!, ${result}`;
            }, 400);
          }
        }
      });
    }
  });
  