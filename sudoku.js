// COOKIES

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}


function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


function deleteCookie(name){
  setCookie(name,"",-1);
}


function listCookies() {
  var cookies = document.cookie.split(';');
  var output = '';
  for (var i = 0 ; i <= cookies.length; i++) {
    output += i + ' ' + cookies[i] + "\n";
  }
  return output;
}

// DISABLE/ENABLE BUTTONS

function enableButton() {
  document.getElementById("check").disabled = false;
  document.getElementById("pause").disabled = false;
  document.getElementById("start").disabled = false;
  document.getElementById("show-leaderboard").disabled = false;
};

function disableButton() {
  document.getElementById("check").disabled = true;
  document.getElementById("pause").disabled = true;
  document.getElementById("start").disabled = true;
  document.getElementById("show-leaderboard").disabled = true;
};

// LEADERBOARD

var showLeaderboard = function() {
  var usernames = getCookie("usernames").split(',');
  var scores = getCookie("scores").split(',').map(Number);
  console.log(scores.sort())

  var output = [];
  for (var i = 0; i < scores.length; i++) {
    output.push([scores[i], usernames[i]] + "<br/>");
  };
  console.log(output)

  document.getElementById("leaderboard").innerHTML = output.sort();
}

var addToLeaderboard = function(player, result) {
  if (getCookie("usernames") != "") {
      document.cookie = 'usernames =' + getCookie("usernames") + ', ' + player;
      document.cookie = 'scores =' + getCookie("scores") + ', ' + result;
  } else {
      document.cookie = 'usernames =' + player;
      document.cookie = 'scores =' + result;
  }

  showLeaderboard();
}

// TIMER

var time;
var timer = null;


function timerTick() {
  time = time + 1;
  document.getElementById("timer").value = time;
}


function startTimer() {
  clearInterval(timer);
  time = 0;
  document.getElementById("timer").value = time;
  timer = setInterval(timerTick, 1000)
}


function stopTimer() {
  clearInterval(timer);
}


function resumeTimer() {
  timer = setInterval(timerTick, 1000)
}

// SUDOKU FUNCTIONS

var renderSudoku = function() {
  var template = getRandomTemplate();
  var row = "";
  var rows = "";
  var boldBottom = " class='bold-bottom'"

  for (var i = 0; i < template.length; i++) {

    for (var j = 0; j < template[i].length; j++) {
      row += "<td " + "data-x = " + '"' + j + '"' +
             " data-y = " + '"' + i + '"' + ">"

      if (template[i][j] == 0) {
        row += "<input type='text'/>"
      } else {
        row += "<input type='text' value='" + template[i][j] + "' disabled />"
      }
      row += ""
    }

    rows += "<tr "
    if (i % 3 == 2) {
      rows += boldBottom
    }
    rows += ">"
    rows += row + "</tr>"
    row = ""
  }

  var board = "<colgroup><col><col><col></colgroup>" +
              "<colgroup><col><col><col></colgroup>" +
              "<colgroup><col><col><col></colgroup>" +
              "<tbody>" + rows + "</tbody>";

  document.getElementById('sudoku').innerHTML = board;

  startTimer();

  enableButton()
};


var checkSudoku = function() {
  var rows_element = "";
  for (var row = 0; row < 10; row++) {
    var l = document.querySelectorAll('[data-y="' + row + '"]');
    for (var k = 0; k < l.length; k++) {
      rows_element += l[k].querySelector('input').value;
    }
  }

  var columns_element = "";
  for (var col = 0; col < 10; col++) {
    var c = document.querySelectorAll('[data-x="' + col + '"]');
    for (var q = 0; q < c.length; q++) {
      columns_element += c[q].querySelector('input').value;
    }
  }
  var boxElement = "";
  for (var by = 0; by <3; by++) {
    for (var bx = 0; bx <3; bx++) {
      for (var yy = by * 3; yy < by * 3 + 3; yy++) {
        for (var xx = bx * 3; xx < bx * 3 + 3; xx++) {
          var element = document.querySelectorAll(
            '[data-x="' + xx + '"][data-y="' + yy + '"]'
          );
          for (var bb = 0; bb < element.length; bb++) {
            boxElement += element[bb].querySelector('input').value;
          }
        }
      }
    }
  }

  var splitBox = boxElement.split("");
  var splitRow = rows_element.split("");
  var splitCol = columns_element.split("");

  function chunk(arr, chunkSize) {
    var slicedArrays = [];

    for (var i = 0; i < arr.length; i += chunkSize) {
      slicedArrays.push(arr.slice(i, i + chunkSize));
    }

    return slicedArrays;
  }

  function sorting(arr) {
    var sortedArrays = [];

    for (var i = 0; i < arr.length; i++) {
      sortedArrays.push(arr[i].sort());
    }

    return sortedArrays;
  }

  var chunkRow = chunk(splitRow, 9);
  var sortedRow = sorting(chunkRow);

  var chunkCol = chunk(splitCol, 9);
  var sortedCol = sorting(chunkCol);

  var chunkBox = chunk(splitBox, 9);
  var sortedBox = sorting(chunkBox);


  function compare (x, y) {
    var compareResults = [];

    for (p = 0; p < x.length; p++) {
      if (x[p].toString() == y.toString()) {
        compareResults.push(0);
      } else {
        compareResults.push(1);
      }
    }

    return compareResults;
  }

  var pattern = [ "1", "2", "3", "4", "5", "6", "7", "8", "9" ]

  var checkedRow = compare(sortedRow, pattern);
  var checkedCol = compare(sortedCol, pattern);
  var checkedBox = compare(sortedBox, pattern);

  var indexRow = checkedRow.indexOf(1);
  var indexCol = checkedCol.indexOf(1);
  var indexBox = checkedBox.indexOf(1);

  if ((indexRow == -1) && (indexCol == -1) && (indexBox = -1)) {
    stopTimer();
    var name = prompt("SOLVED! Enter your name:");
    var timerScore = document.getElementById("timer").value;

    addToLeaderboard(name, timerScore);

    clearInputs();

    disableButton();
  } else {
    alert("TRY AGAIN!");
  }
};

// WINDOW ONLOAD FUNCTION

var clearInputs = function() {
  document.getElementById("timer").value = 0;
}

// document.addEventListener('DOMContentLoaded', renderSudoku, false);
window.onload = function () {
  document.getElementById("new-game").onclick = function () { renderSudoku (); };
  document.getElementById("check").onclick = function () { checkSudoku(); };
  document.getElementById("pause").onclick = function() { stopTimer(); };
  document.getElementById("start").onclick = function() { resumeTimer(); };
  document.getElementById("show-leaderboard").onclick = function() { showLeaderboard(); };

  disableButton();

  clearInputs();

  showLeaderboard();
};
