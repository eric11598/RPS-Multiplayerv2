
var config = {
  apiKey: "AIzaSyAuU7UCLFi2PAoQdVSDLuQjWKfb6VDx89I",
  authDomain: "rpsmultiplayer-98fad.firebaseapp.com",
  databaseURL: "https://rpsmultiplayer-98fad.firebaseio.com",
  projectId: "rpsmultiplayer-98fad",
  storageBucket: "rpsmultiplayer-98fad.appspot.com",
  messagingSenderId: "791884709862"
};

firebase.initializeApp(config);
  
var database = firebase.database();
var dataRef = firebase.database();
var ref = database.ref();
var playersRef = ref.child("players");

var player;
var name;
var childNumber = 0;

  

$("#add-user").on("click", function(event) {
  event.preventDefault();
  name = $("#name-input").val().trim();

 
  dataRef.ref().child("players").update({
    [name]: {
            playerNumber: player,
            playerName: name,
            losses: 0,
            wins: 0,
            move: '',
            status: 'connected',
          }});
    
  $("#inputContainer").hide();

  dataRef.ref().update({
    turn: 1, 
    });
      

});
    

$(".btn-secondary").on("click", function(event) {

  var div = "#player"+this.id+"ButtonContainer";

  var gameTurn;
  var move = $(this).val();

    dataRef.ref().child("players").child(name).update({
    move: move,          
  });

  ref.once("value", function(snapshot) {
    gameTurn = snapshot.val().turn;
  });


  //If 2 inputs are recorded, start the game

  if (gameTurn === 1)
    gameTurn = 2;

  else if (gameTurn === 2) {
    
    var playerOne = {};
    var playerTwo = {};

        //OPTIMIZE WITH FOR LOOPS 

    playersRef.on('value', function(snapshot) {
      snapshot.forEach(function(child) {
        console.log("here");
        var key = child.key;


        var moveValue = JSON.stringify(child.val().move);
        var numberValue = JSON.stringify(child.val().playerNumber);
        var nameValue = JSON.stringify(child.val().playerName);
        var winsValue = JSON.stringify(child.val().wins);
        var lossesValue = JSON.stringify(child.val().losses);

        numberValue = numberValue.replace(/['"]+/g, '')
        moveValue = moveValue.replace(/['"]+/g, '')
        nameValue = nameValue = nameValue.replace(/['"]+/g, '')

        if(numberValue === 'One')
        {
          playerOne['move'] = moveValue;
          playerOne['wins'] = Number(winsValue);
          playerOne['losses'] = Number(lossesValue);
          playerOne['name'] = nameValue;
          playerOne['number'] = numberValue;
        }

        if(numberValue === 'Two')
        {
          playerTwo['move'] = moveValue;
          playerTwo['wins'] = Number(winsValue);
          playerTwo['losses'] = Number(lossesValue);
          playerTwo['name'] = nameValue;
          playerTwo['number'] = numberValue;
        }          
      });   
    });
  
      // ROCK PAPER SCISSORS LOGIC

      var winner;

      if(playerOne.move === playerTwo.move)
        winner = 0;

        
      if(playerOne.move==='rock' && playerTwo.move === 'paper')
        winner = 2;

      if(playerOne.move==='rock' && playerTwo.move === 'scissors')
        winner = 1;

      if(playerOne.move==='paper' && playerTwo.move === 'rock')
        winner = 1;

      if(playerOne.move==='paper' && playerTwo.move === 'scissors')
        winner = 2;

      if(playerOne.move==='scissors' && playerTwo.move === 'rock')
        winner = 2;

      if(playerOne.move==='scissors' && playerTwo.move === 'paper')
        winner = 1;
        

      if(winner === 0)
      {
        $("#gameOverStatus").text("Player 1 - "+playerOne.move+" // Player 2 - "+playerTwo.move+" // Its a tie!")
      }

      if(winner === 1)
      {
        $("#gameOverStatus").text("Player 1 - "+playerOne.move+" // Player 2 - "+playerTwo.move+" // Player 1 wins!")

        var wins = Number(playerOne.wins);
        wins++;
        playerOne.wins = wins;

        var losses = Number(playerTwo.losses);
        losses++;
        playerTwo.losses = losses;
      }

      if(winner === 2)
      {
        $("#gameOverStatus").text("Player 1 - "+playerOne.move+" // Player 2 - "+playerTwo.move+" // Player 2 wins!")

        var wins = Number(playerTwo.wins);
        wins++;
        playerTwo.wins = wins;

        var losses = Number(playerOne.losses)
        losses++;
        playerOne.losses = losses;
      }


        gameTurn = 1;

        dataRef.ref().child("players").update({
          [playerOne.name]: {
              playerNumber: playerOne.number,
              playerName: playerOne.name,
              move: '',
              wins: playerOne.wins,
              losses: playerOne.losses,
              status: 'connected',
            },

          [playerTwo.name]: {
              playerNumber: playerTwo.number,
              playerName: playerTwo.name,
              move: '',
              wins: playerTwo.wins,
              losses: playerTwo.losses,
              status: 'connected',

          
          }});

      }

      dataRef.ref().update({
        turn: gameTurn,
      });

  
  console.log(div);
  $(div).hide();   

});

playersRef.on('value', function(snapshot){
  snapshot.forEach(function(child){

    var numberValue = JSON.stringify(child.val().playerNumber);
    var winsValue = JSON.stringify(child.val().wins);
    var lossesValue = JSON.stringify(child.val().losses);

    numberValue = numberValue.replace(/['"]+/g, '')

    var winsDiv = "#player"+numberValue+"Wins";
    var lossesDiv = "#player"+numberValue+"Losses";
  
    $(winsDiv).text(winsValue);
    $(lossesDiv).text(lossesValue);

  });
});

//Removes player and turn reference on disconnect/refresh from Firebase

$( window ).unload(function() {
  
  var playerReference = "players/"+name;
  var playerRef = firebase.database().ref(playerReference)
  var turnRef = firebase.database().ref("turn");
  
  playerRef.onDisconnect().remove();
  turnRef.onDisconnect().remove();


});
    


playersRef.once('value', function(snapshot) {
      if (snapshot.hasChild('one')) {
        console.log("check once");
        $("#playerOneName").text(snapshot.val().players.name.playerName);
      }
    });

    
//If player 1 drops out and player 2 exists, next player is player 1

ref.child("players").orderByChild("playerNumber").equalTo("Two").once("value", function(snapshot){
  if (snapshot.exists()){
        player = "One";
        console.log("exists!");
      }
  });

   
//If no players, first player to enter is player 1, second is player 2
//If a player exists, determine which player it is

playersRef.on('value', function(snapshot){

  var playerCount = 0;
  var foundPlayer = '';

  player = 'Two';


  snapshot.forEach(function(child){

    foundPlayer = JSON.stringify(child.val().playerNumber);

    if (foundPlayer === 'Two')
      player = 'One';

    

    playerCount++;

  });

  if (playerCount === 0)
    player = 'One';

});

  
ref.on("value", function(snapshot) {

      if(childNumber == 2)
      { 
        var gameTurn = snapshot.val().turn;

        
        playersRef.child(name).once("value", function(snapshot){

          var playerTurn = 0;
          if(snapshot.val().playerNumber === 'One')
          {
            playerTurn = 1;
          }

          if(snapshot.val().playerNumber === 'Two')
          {    
            playerTurn = 2;
          }

          if (gameTurn===playerTurn)
          {
            var div = "#player"+snapshot.val().playerNumber+"ButtonContainer";
            $("#gameStatus").text("Game Start! Waiting for both players to move!")
            $(div).show();
          }

        }); 
      }

    });
  






  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  
  
playersRef.on("child_added", function(childSnapshot) {
    
  childNumber++;
    
  var number = childSnapshot.val().playerNumber;
  var div = "#player"+number+"Name";
  $(div).text(childSnapshot.val().playerName);

  var key = childSnapshot.key; // "ada"

  var winsDiv = "#player"+number+"Wins";
  var lossesDiv = "#player"+number+"Losses";
  
  $(winsDiv).text("0");
  $(lossesDiv).text("0");

  if (childNumber == 1)
  $("#gameStatus").text("Player "+number+" has connected - waiting for other player!")

  if (childNumber == 2)
  $("#gameStatus").text("Game Start! Waiting for both players to move!")

});

playersRef.on("child_removed", function(childSnapshot) {
  
  childNumber--;
    
  var number = childSnapshot.val().playerNumber;
  var div = "#player"+number+"Name";
   
  $(div).text("Waiting...");

  var winsDiv = "#player"+number+"Wins";
  var lossesDiv = "#player"+number+"Losses";
  
  $(winsDiv).text("0");
  $(lossesDiv).text("0");
  $("#gameStatus").text("Player "+number+" has disconnected - waiting for player!")

});

  
