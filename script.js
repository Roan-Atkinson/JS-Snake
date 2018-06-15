var borderCells = [];
var gameIsRunning = false;
var isOver = false;
var isShowingMods = false;
var foodPos = false;
var goldenFood = false;
var skips = 0;


setTimeout(function() {
   document.getElementById("intro").classList.add("noAnimation");
}, 2000)



var player = {
   name: "", // whatever the player specifies
   color: "", // color of the player
   direction: "up", // can be right down left or up
   headPos: "", // id of the td where the head is located
   pos: [], // contains all places the player has been, pos[0] will always = headPos
   time: 70, // determines the time between movements normally 70
   score: 0, // The players score, each apple eaten is +1
}




function generatePlayers() {

   gameIsRunning = true;
   isOver = false;
   player.headPos = 3800;
   player.pos = [3800,3871,3942];
   for (var i = 0; i < player.pos.length; i++) {
      document.getElementById(player.pos[i]).style.backgroundColor = player.color;
   }
   document.getElementById("name1").innerHTML = player.name;
   document.getElementById("name1").style.borderBottom = "2px solid " + player.color;
   document.getElementById("rightScore").style.border = "2px solid " + player.color;

}



// prepares game
function gogo() {
   player.name = document.getElementById("nameInput").value;
   player.color = document.getElementById("color1").value;
   player.time = document.getElementById("player1speed").value;;
   if (player.name == "") {
      alert("Please choose a name.");
      return;
   }
   if (player.color == "#ffffff") {
      alert("Consider a different color...");
      return;
   }
   document.getElementById("introBack").style.display = "none";
   document.getElementById("game").style.display = "block";
   document.getElementById("rightScore").style.display = "block";
   generateGame();
   generatePlayers();
   generateFood();

   document.getElementById("countdown").style.display = "block";
   document.getElementById("countdown").innerHTML = "3";
   document.getElementById("countdown").style.color = "red";
   setTimeout(function() {
      document.getElementById("countdown").innerHTML = "2";
      document.getElementById("countdown").style.color = "orange";
      setTimeout(function() {
         document.getElementById("countdown").innerHTML = "1";
         document.getElementById("countdown").style.color = "yellow";
         setTimeout(function() {
            document.getElementById("countdown").innerHTML = "GO";
            document.getElementById("countdown").style.color = "green";
            setTimeout(function() {
               document.getElementById("countdown").style.display = "none";
               movePlayer();
            }, 200)
         }, 1000);
      }, 1000);
   }, 1000);
}



// generates the 71x71 game board with each td having a unique id
function generateGame() {
   var currentTd = 0;
   var table = document.getElementById("table");
   for (i = 0; i < 71; i++) {
      var rows = document.createElement("tr");
      rows.setAttribute("id", "row" + i);
      rows.classList.add("row");
      for (x = 0; x < 71; x++) {
         var tds = document.createElement("td");
         tds.setAttribute("id", currentTd);
         tds.classList.add("td");
         rows.appendChild(tds);
         currentTd++;
      }
      table.appendChild(rows);
   }
   generateBorder();
}



function generateBorder() {

   for (i = 0; i <= 70; i++) {
      borderCells.push(i);
   }
   for (i = 4970; i <= 5040; i++) {
      borderCells.push(i);
   }
   for (i = 71; i <= 4899; i = i + 71) {
      borderCells.push(i);
   }
   for (i = 141; i <= 4969; i = i + 71) {
      borderCells.push(i);
   }

   for (i = 0; i < borderCells.length; i++) {
      document.getElementById(borderCells[i]).style.backgroundColor = "white";
   }
}


function generateFood() {
   goldenFood = false;
   rand = randomIntFromInterval(1,4);
   if (rand == 1) {
      goldenFood = true;
      skips = 2;
   }

   valid = false
   while (!valid) {
      pos = randomIntFromInterval(0,5040);
      if (borderCells.indexOf(pos) == -1 && player.pos.indexOf(pos) == -1) {
         valid = true;
      }
   }
   foodPos = pos;
   document.getElementById(foodPos).style.backgroundColor = '#ff4d4d';
}


document.onkeydown = function() {
   // Used to detect when a player presses a key
   // and checks to see if it is an arrow key
   // and sets player.direction accordingly
   switch (window.event.keyCode) {
      case 13:
         if (gameIsRunning) return;
         gogo();
         break;
      case 37:
         if (!gameIsRunning) return;
         if (player.direction == "right") return;
         player.direction = "left";
         break;
      case 38:
         if (!gameIsRunning) return;
         if (player.direction == "down") return;
         player.direction = "up";
         break;
      case 39:
         if (!gameIsRunning) return;
         if (player.direction == "left") return;
         player.direction = "right";
         break;
      case 40:
         if (!gameIsRunning) return;
         if (player.direction == "up") return;
         player.direction = "down";
         break;
      case 77:
         if (gameIsRunning) return;
			var nameInput = document.getElementById("nameInput");
			if (nameInput == document.activeElement) return;
         showMods();
         break;
   }
};





// Moves the player 1px in their current direction & checks for loss
function movePlayer() {

   if (player.direction == "up") {
      player.headPos = player.headPos - 71;
   } else if (player.direction == "right") {
      player.headPos++
   } else if (player.direction == "down") {
      player.headPos = player.headPos + 71;
   } else if (player.direction == "left") {
      player.headPos = player.headPos - 1;
   }

   // since the following 4 lines are univertal all directions i included them here
   document.getElementById("score1").innerHTML = player.score;
   player.pos.unshift(player.headPos);
   document.getElementById(player.headPos).style.backgroundColor = player.color;

   //
   // CHECK PLAYER LOSS
   //
   // Checks to see if the player has hit themselves
   for (i = 1; i < player.pos.length; i++) {
      if (player.pos[i] == player.headPos) {
         gameOver();
         return;
      }
   }
   // Checks to see if the player went out of the board
   for (i = 0; i < borderCells.length; i++) {
      if (player.headPos == borderCells[i]) {
         gameOver();
         return;
      }
   }

   //
   // CHECK FOOD
   //
   if (player.headPos == foodPos || skips > 0) {
      if (goldenFood) {
         player.score = player.score + 3
      } else {
         player.score++
      }
      if (skips > 0) {
         skips = skips - 1
      } else {
         generateFood();
      }
   } else {
      var id = player.pos.pop();
      document.getElementById(id).style.backgroundColor = "gray";
   }

   if (isOver) return;
   setTimeout(function() {
      movePlayer();
   }, player.time);
}



function gameOver() {
   document.getElementById(player.headPos).style.backgroundColor = "red";
   document.getElementById("score1").innerHTML = player.score;
   document.getElementById("output1").innerHTML = "GAME OVER";
   document.getElementById("output1").style.color = "red";
   document.getElementById("restart").style.display = "block";
   isOver = true;
}


function restart() {
   document.getElementById("restart").style.display = "none";
   document.getElementsByClassName("row").remove();
   document.getElementById("output1").innerHTML = "";
   player.direction = "up";
   player.headPos = "";
   player.pos = [];
   player.score = 0;
   gogo();
}


function showMods() {
   if (isShowingMods == false) {
      document.getElementById("intro").style.display = "none";
      document.getElementById("modScreen").style.display = "block";
      isShowingMods = true;
   } else {
      document.getElementById("intro").style.display = "block";
      document.getElementById("modScreen").style.display = "none";
      isShowingMods = false;
   }
}


// These were created by StackOverflow user Johan Dettmar
Element.prototype.remove = function() {
   this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
   for (var i = this.length - 1; i >= 0; i--) {
      if (this[i] && this[i].parentElement) {
         this[i].parentElement.removeChild(this[i]);
      }
   }
}

// RNG function by Francisc on StackOverflow
function randomIntFromInterval(min, max) {
   return Math.floor(Math.random() * (max - min + 1) + min);
}
