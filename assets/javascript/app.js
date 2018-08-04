// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
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

  //ref.child("Victor").setValue("setting custom key when pushing new data to firebase database");

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

          console.log("BOOO");
          dataRef.ref().update({
            turn: 1,
          });
      

    });
    

    $(".btn-secondary").on("click", function(event) {
      
      
      var gameTurn;
      var move = $(this).val();

      
      dataRef.ref().child("players").child(name).update({
            move: move,          
          });

      ref.once("value", function(snapshot) {
        gameTurn = snapshot.val().turn;
      });


      if (gameTurn === 1)
      gameTurn = 2;

      else if (gameTurn === 2)
      {
        console.log("here");
        var user = {};

        playersRef.on('value', function(snapshot){
          snapshot.forEach(function(child){
              console.log("here");
              var key = child.key;
              var value = JSON.stringify(child.val().move);
              var playerNumber = JSON.stringify(child.val().playerNumber);

              playerNumber = playerNumber.replace(/['"]+/g, '')

              console.log("key+  "+playerNumber+"   value+ "+value);
              user[playerNumber] = value;
          });

          
      });
        console.log(user)
        console.log(user.One+ " yeeeee  "+user.Two);


        if(user['One']===user['Two'])
        console.log("ITS A TIE");

        if(user['One']==='rock' && user['Two'] === 'paper')
        console.log("TWO WINS")

        if(user['One']==='rock' && user['Two'] === 'scissors')
        console.log("ONE WINS");

        if(user['One']==='paper' && user['Two'] === 'rock')
        console.log("ONE WINS");

        if(user['One']==='paper' && user['Two'] === 'scissors')
        console.log("TWO WINS");

        if(user['One']==='scissors' && user['Two'] === 'rock')
        console.log("TWO WINS");

        if(user['One']==='scissors' && user['Two'] === 'paper')
        console.log("ONE WINS");

        
        gameTurn = 1;

      }


      dataRef.ref().update({
        turn: gameTurn,
      });


    });
    


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
    //If a first player exists, second player is player 2
    playersRef.on("value", function(snapshot) {
      

      if(snapshot.exists())
      { 
        player = 'Two';
      }
      else
      {
        player = 'One';
      }


      


      
    });
  
    ref.on("value", function(snapshot) {

      if(childNumber == 2)
      { 
        var gameTurn = snapshot.val().turn;
        console.log("START GAMMEEE BOOOYS" + gameTurn);

        playersRef.child(name).once("value", function(snapshot){

          var playerTurn = 0;
          if(snapshot.val().playerNumber === 'One')
          playerTurn = 1;

          if(snapshot.val().playerNumber === 'Two')
          playerTurn = 2;

          if (gameTurn===playerTurn)
          {
            var div = "#player"+snapshot.val().playerNumber+"ButtonContainer";
            $(div).show();
          }

          else{
            
            var div = "#player"+snapshot.val().playerNumber+"Status";
            console.log(div);
            $(div).text("WAITING...");
          }

          console.log("EAT BUTT BOOOYS "+snapshot.val().playerName);

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

    
  
  });

  playersRef.on("child_removed", function(childSnapshot) {
  
    childNumber--;
    
    var number = childSnapshot.val().playerNumber;
    var div = "#player"+number+"Name";
    console.log(div);
    $(div).text("Waiting...");

  
  });

  
  // Example Time Math
  // -----------------------------------------------------------------------------
  // Assume Employee start date of January 1, 2015
  // Assume current date is March 1, 2016
  
  // We know that this is 15 months.
  // Now we will create code in moment.js to confirm that any attempt we use meets this test case
  