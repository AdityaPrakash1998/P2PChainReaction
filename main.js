const myTable = document.getElementById('table1');
var allCells = myTable.getElementsByTagName('td');
//Variable to know the chance of player
var player = 0;

var color = 0;
//Variables to trck score
var redScore = 0;
var greenScore = 0;

//Varialbe to track the ready state of players
var redReady = false;
var greenReady = false;

var peer = new Peer({
  id: "AdityaPrakash"
});


var myId = document.getElementById('myId');
var otherId = document.getElementById('otherId');
var msg = document.getElementById('msg');
var conn, sending;

// function checkBoundaryTop(x) {
//   return x > 0;
// }
//
// function checkBoundaryBottom(x) {
//   return x < 3;
// }
//
// function checkBoundaryLeft(y) {
//   return y > 0;
// }
//
// function checkBoundaryRight(y) {
//   return y < 3;
// }

//Function to color background accordingly
function colorCell(elem) {
  if (player == 1) {
    elem.style.backgroundColor = 'red';
    redReady = true;
  } else {
    elem.style.backgroundColor = 'green';
    greenReady = true;
  }
}

//Funciton to make background white again
function uncolorCell(elem) {
  elem.style.backgroundColor = '#ffb300';
}

//Get traget number to achieve in the cell to multiply
function getTarget(x, y) {
  var target = 0;
  if (x > 0) target++;
  if (x < 3) target++;
  if (y > 0) target++;
  if (y < 3) target++;
  return target - 1;
}


// Toggle player chance
function togglePlayer() {
  if (player == 0) {
    player = 1;
    myTable.className = 'player1';
  } else {
    player = 0;
    myTable.className = 'player0';
  }
}

function cleanthis() {
  redReady = false;
  greenReady = false;
  msg.innerHTML = 'New Game has started';
  for (var i = 0; i < allCells.length; i++) {
    allCells[i].style.background = '#ffb300';
    allCells[i].innerHTML = 0;
  }
}


//Function ran after evry move to calculte current score
function calculateScore() {

  //Iterating over each cell to know it's color
  for (var i = 0; i < allCells.length; i++) {
    if (allCells[i].style.backgroundColor == 'red') redScore++;
    if (allCells[i].style.backgroundColor == 'green') greenScore++;
  }

  // If there is no red cell
  if (redScore == 0 && greenScore > 0) {
    if (confirm("Green Won ! Play Again ?")) {
      cleanthis();
      sending(0, 0, true);
    } else {
      window.alert('Red is a Loser !');
      location.reload();
    }
  }
  // If there is no Green cell
  if (greenScore == 0 && redScore > 0) {
    if (confirm("Red Won ! Play Again ?")) {
      cleanthis();
      sending(0, 0, true);
    } else {
      window.alert('Green is a Loser !');
      location.reload();
    }
  }

  // Reset the scores after every calculation
  redScore = 0;
  greenScore = 0;

}


//Function called when any cell is clicked
function myFunction(elem) {
  // Check to see the opposite player cell is not clicked
  if (otherId.value == '') {
    msg.innerHTML = 'Share code with Player 2 before starting';
  } else {
    if ((player == 0 && elem.style.backgroundColor == 'green') || (player == 1 && elem.style.backgroundColor == 'red')) {} else {
      togglePlayer();
      sending(elem.parentElement.rowIndex, elem.cellIndex, false);
      play(elem);
    }
    //claculating score only after both the player are ready i.e., Both player have atleast clicked once
    if (redReady && greenReady)
      calculateScore();
  }
}


//Main Play function
function play(elem) {

  var x = elem.parentElement.rowIndex;
  var y = elem.cellIndex;

  var value = elem.innerHTML++;
  var target = getTarget(x, y);
  if (value < target) {
    //More clicks are needed
    colorCell(elem);
  } else { //Target clicks done. Time to multiply
    //resetting current cell
    uncolorCell(elem);
    elem.innerHTML = 0;

    if (x > 0) {
      play(myTable.rows[x - 1].cells[y])
    };
    if (x < 3) {
      play(myTable.rows[x + 1].cells[y])
    }
    if (y > 0) {
      play(myTable.rows[x].cells[y - 1]);
    }
    if (y < 3) {
      play(myTable.rows[x].cells[y + 1]);
    }
  }


}



//Peer Connection thing



peer.on('open', function(id) {
  myId.value = id;
});
peer.on('connection', function(conn) {
  msg.innerHTML = 'Opponent is Ready to Play !';
  conn.on('data', function(data) {
    console.log(data);
    if (data.clean == false) {
      togglePlayer();
      play(myTable.rows[data.x].cells[data.y]);
    } else {
      console.log('Need to clean');
      document.getElementById('clean').click();
    }
  });

  conn.on('error', function(err) {
    alert(err);
  });
});

function connect() {

  if (otherId.value == '') otherId.placeholder = 'Enter the other ID'
  else {
    msg.innerHTML += ' You are Ready !';
    conn = peer.connect(otherId.value);
    conn.on('open', function() {
      // Receive messages

      // Send messages
      //conn.send({});
      sending = function(x, y, clean) {
        setTimeout(conn.send({
          x,
          y,
          clean
        }), 1000);
      }

    });
  }
}

function selection() {
  myId.select();
  document.execCommand('copy');
  document.getElementById('copymsg').innerHTML = 'Code is copied. Please Share with Player 2';
}




// var conn = peer.connect('dest-peer-id');
//
// peer.on('connection', function(conn) { ... });s