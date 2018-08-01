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

  var player = 'one';

  //ref.child("Victor").setValue("setting custom key when pushing new data to firebase database");

  $("#add-user").on("click", function(event) {
    event.preventDefault();
    var name = $("#name-input").val().trim();

    dataRef.ref().child("players").update({
        [player]: {
            name: name,
            losses: 0,
            wins: 0,
            move: '',
            status: 'connected',
          }});
    



    });
    
    var connectedRef = database.ref(".info/connected");
    connectedRef.on("value", function (snapshot) {

      console.log("connected!");
      
      if(playersRef.two)
      {
        console.log("YEET");
      }


    });

  
    playerReference = "players/"+player;
    var playerRef = firebase.database().ref(playerReference)
    playerRef.onDisconnect().remove();

    

   
    ref.on("value", function(snapshot) {

      



      //$("#playerOneName").text(snapshot.val().players.one.name);
      //$("#playerTwoName").text(snapshot.val().players.one.name);
    });
  
  
  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  
  /*
  playersRef.on("child_added", function(childSnapshot) {
  
    console.log("BRAAAAAA");
    player = 'two';
  
  });*/
  
  // Example Time Math
  // -----------------------------------------------------------------------------
  // Assume Employee start date of January 1, 2015
  // Assume current date is March 1, 2016
  
  // We know that this is 15 months.
  // Now we will create code in moment.js to confirm that any attempt we use meets this test case
  