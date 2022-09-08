"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//At the top of the file
var _csrf; // Values to help not repeat methods


var pageList = false;
var loopNumber = 1;
var videoKey = 0;
var videoIndex = 0;
var videoMax = 300;
var queryString;
var pagedVideos = []; // ADDING A VIDEO

var handleVideo = function handleVideo(e) {
  videoKey = 0;
  var modValue = 0;
  var charModValue = 0;
  e.preventDefault(); // Create a video object to send to the server

  var videoObj = {}; // For each match a user wants to add, push the object

  for (var i = 0; i < loopNumber; i++) {
    var newObject = {};
    videoObj[i] = newObject;
  } // Find the overall link the user inputted


  $('#videoForm').find('input').each(function () {
    if (this.name === 'videoLink') {
      videoObj.videoLink = this.value;
    }
  }); // If any values are empty

  if ($("#timeStamp").val() == '' || $("#playerOne").val() == '' || $("#playerTwo").val() == '' || $("#videoLink").val() == '' || $("#matchDate").val() == '') {
    alert("ERROR | All fields are required");
    return false;
  } // Check if the error uses the correct link *just copying the url


  if (!$("#videoLink").val().includes('www.youtube.com')) {
    alert("ERROR | Please use a valid YouTube link");
    return false;
  } // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Quantifiers
  // https://www.w3schools.com/jsref/jsref_replace.asp


  var regex = /[0-9][0-9]:[0-9][0-9]:[0-9][0-9]/g; /// Putting each input into its own object to send to the server 
  ///

  $('#videoForm').find('td > input').each(function () {
    if (modValue === 0) {
      // Using regex to ensure the timestamp is correct
      if (regex.test(this.value)) {
        var array = this.value.match(regex);
        JSON.stringify(array);
        var newArray = array[0].replace(/:.*?/, "h");
        var newArray2 = newArray.replace(/:.*?/, "m");
        var finalArray = newArray2 + "s";
        videoObj[videoKey].link = "".concat(videoObj.videoLink, "&t=").concat(finalArray);
      } else {
        videoObj[videoKey].link = "".concat(videoObj.videoLink, "&t=").concat(this.value);
      }
    }

    if (modValue === 1) {
      videoObj[videoKey].player1 = this.value;
    }

    if (modValue === 2) {
      // Once the end is reached, add the game from the selection
      // Add characters as well
      // and iterate the videoKey and reset the modification values
      videoObj[videoKey].player2 = this.value;
      videoObj[videoKey].version = $('#videoForm').find('#version').find(":selected").val();
      videoObj[videoKey].matchDate = $('#videoForm').find('#matchDate').val();
      videoKey++;
      modValue = -1;
    }

    modValue++;
  }); // Set the new video key to the loop number for the next loop

  videoKey = loopNumber; // For character selection

  $('#videoForm').find('select').each(function () {
    // One of the selections is for the game version, we don't need that
    // Also, if the key is equal to zero, skip it.
    if (this.id != "version") {
      if (videoKey > 0) {
        if (charModValue === 0) {
          // In order to ensure the object exists, take it from 
          // the loop number and go down what's already been created
          // and add that property to the list
          videoObj[loopNumber - videoKey].assist1 = this.value;
        } else if (charModValue === 1) {
          videoObj[loopNumber - videoKey].char1 = this.value;
        } else if (charModValue === 2) {
          videoObj[loopNumber - videoKey].char2 = this.value;
        } else if (charModValue === 3) {
          videoObj[loopNumber - videoKey].assist2 = this.value;
          charModValue = -1;
          videoKey--;
        }

        charModValue++;
      }
    }
  }); // CSRF is associated with a user, so add a token to the overall object to send to the server

  $('#videoForm').find('input').each(function () {
    if (this.type === 'hidden') {
      videoObj._csrf = this.value;
    }
  }); // Uncomment this to send data
  // Send the object! :diaYay:

  sendAjax('POST', $("#videoForm").attr("action"), videoObj, redirect);
  return false;
}; // Handle deletion of a video


var handleDelete = function handleDelete(e) {
  e.preventDefault();
  var data = {
    uid: e.target.value,
    _csrf: _csrf
  };
  sendAjax('POST', '/delete', data, function () {
    loadVideosFromServer();
  });
  return false;
}; // Handling password change


var handleChange = function handleChange(e) {
  e.preventDefault();

  if ($("#pass").val() == '' || $("#pass2").val() == '') {
    alert("ERROR | All fields are required");
    return false;
  }

  if ($("#pass").val() === $("#pass2").val()) {
    alert("ERROR | Passwords cannot match");
    return false;
  }

  if ($("#pass2").val() !== $("#pass3").val()) {
    alert("ERROR | The new passwords do not match");
    return false;
  }

  sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);
  return false;
}; //Sets the values of the players and game to null, then triggers a change to remove the char selects from the form


var handleReset = function handleReset(e) {
  e.preventDefault();
  $("#player1Search").val("");
  $("#player2Search").val("");
  $("#gameSearch").val("").prop('selected', true).trigger("change");
  return false;
}; // Handles the search. Will check for each value in the inputs for the search form to see if they exist.
// If they exist put them into the query string them send it to the server with the GET command


var handleSearch = function handleSearch(player) {
  //e.preventDefault();
  queryString = "".concat($('#searchForm').attr('action'), "?"); // Check if the player is a string. It'll default to an object if it doesn't exist
  // If it is, search for this specific player in DFC:I matches

  if (typeof player === 'string' || player instanceof String) {
    queryString += "player1=".concat(player);
    queryString += "&version=".concat(2);
  } else {
    // Check each search field to see if anything is in them. If there is data in them, add it to the querystring
    if ($("#player1Search").val()) {
      queryString += "player1=".concat($("#player1Search").val());
    }

    if ($("#player2Search").val()) {
      queryString += "&player2=".concat($("#player2Search").val());
    }

    if ($("#char1Search").find(":selected").text() !== 'Char 1' && $("#char1Search").find(":selected").text() !== 'Anyone') {
      queryString += "&char1=".concat($("#char1Search").find(":selected").text());
    }

    if ($("#char2Search").find(":selected").text() !== 'Char 2' && $("#char2Search").find(":selected").text() !== 'Anyone') {
      queryString += "&char2=".concat($("#char2Search").find(":selected").text());
    }

    if ($("#assist1Search").find(":selected").text() !== 'Ast 1' && $("#assist1Search").find(":selected").text() !== 'Anyone') {
      queryString += "&assist1=".concat($("#assist1Search").find(":selected").text());
    }

    if ($("#assist2Search").find(":selected").text() !== 'Ast 2' && $("#assist2Search").find(":selected").text() !== 'Anyone') {
      queryString += "&assist2=".concat($("#assist2Search").find(":selected").text());
    }

    if ($("#gameSec").val() && $("#gameSec").val() != 'Any') {
      queryString += "&version=".concat($("#gameSec").val());
    }

    if ($("#sortSec").val() && $("#sortSec").val() != 'Sort') {
      queryString += "&sort=".concat($("#sortSec").val());
    }
  }

  sendAjax('GET', queryString, null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(VideoList, {
      videos: data.videos
    }), document.querySelector("#content"));
  });
};

var handleCharacterData = function handleCharacterData() {
  // console.log('handling data')
  var characterQuery = "".concat($('#dataForm').attr('action'), "?");

  if ($("#charDataSearch").val() != 'undefined') {
    characterQuery += "character=".concat($("#charDataSearch").val());
  } //console.log(characterQuery)


  sendAjax('GET', characterQuery, null, function (data) {
    //console.log('sent query')
    ReactDOM.render( /*#__PURE__*/React.createElement(CharacterData, {
      character: data.character
    }), document.querySelector("#content"));
  });
}; // Search form
//Sets up the search form, will change the select for characters depending on the game selected


var SearchForm = function SearchForm() {
  // Obsolete, but uncomment just in case

  /*let charSelection = char1Search;
  let char2Selection = char2Search;
  let assist1Selection = assist1Search;
  let assist2Selection = assist2Search;*/
  var gameSelection = /*#__PURE__*/React.createElement("select", {
    id: "gameSec",
    className: "form-control"
  }, /*#__PURE__*/React.createElement("option", {
    value: "undefined",
    disabled: true,
    selected: true,
    hidden: true
  }, "Vers."), /*#__PURE__*/React.createElement("option", {
    value: "Any"
  }, "Any"), /*#__PURE__*/React.createElement("option", {
    value: "2"
  }, "DFC:I"), /*#__PURE__*/React.createElement("option", {
    value: "1"
  }, "DFC"));
  var sortSelection = /*#__PURE__*/React.createElement("select", {
    id: "sortSec",
    className: "form-control"
  }, /*#__PURE__*/React.createElement("option", {
    value: "undefined",
    disabled: true,
    selected: true,
    hidden: true
  }, "Sort"), /*#__PURE__*/React.createElement("option", {
    value: "Oldest"
  }, "Oldest"), /*#__PURE__*/React.createElement("option", {
    value: "Newest"
  }, "Newest"));
  var char1Select = $("#char1Search").find(":selected").val();
  var char2Select = $("#char2Search").find(":selected").val();
  var assist1Select = $("#assist1Search").find(":selected").val();
  var assist2Select = $("#assist2Search").find(":selected").val();
  var versionSelect = $("#gameSec").find(":selected").val();
  var char1Src = "/assets/img/Characters/".concat(char1Select, ".png");
  var char2Src = "/assets/img/Characters/".concat(char2Select, ".png");
  var assist1Src = "/assets/img/Assists/".concat(assist1Select, ".png");
  var assist2Src = "/assets/img/Assists/".concat(assist2Select, ".png");
  var gameSrc = "/assets/img/Version/".concat(versionSelect, ".png");
  return /*#__PURE__*/React.createElement("form", {
    id: "searchForm",
    onChange: handleSearch,
    onReset: handleReset,
    name: "searchForm",
    action: "/search",
    method: "GET",
    className: "searchForm form-inline"
  }, /*#__PURE__*/React.createElement("table", {
    id: "searchFormTable",
    className: "table table-sm"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("img", {
    id: "char1Img",
    src: char1Src,
    alt: char1Select
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("img", {
    id: "assist1Img",
    src: assist1Src,
    alt: assist1Select
  }))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, char1Search), /*#__PURE__*/React.createElement("td", null, assist1Search), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "player1Search",
    type: "text",
    name: "player1",
    placeholder: "Name"
  }))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("img", {
    id: "char2Img",
    src: char2Src,
    alt: char2Select
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("img", {
    id: "assist2Img",
    src: assist2Src,
    alt: assist2Select
  })), /*#__PURE__*/React.createElement("td", null)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, char2Search), /*#__PURE__*/React.createElement("td", null, assist2Search), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "player2Search",
    type: "text",
    name: "player2",
    placeholder: "Name"
  }))), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, gameSelection), /*#__PURE__*/React.createElement("td", null), /*#__PURE__*/React.createElement("td", null, sortSelection), /*#__PURE__*/React.createElement("td", null)))));
}; /// FORM TO SUBMIT NEW DATA
// Don't think the images thing is going to work out
// Just make the page look very nice is probably the only way to go


var VideoForm = function VideoForm(props) {
  var _React$createElement;

  // Rows to dynamically add more matches
  // https://stackoverflow.com/questions/22876978/loop-inside-react-jsx
  var rows = [];
  var charSelection;
  var char2Selection;
  var assist1Selection;
  var assist2Selection;
  var char1Sel;
  var char2Sel;
  var assist1Sel;
  var assist2Sel;
  var char1Src;
  var char2Src;
  var assist1Src;
  var assist2Src;

  for (var i = 0; i < loopNumber; i++) {
    var char1ID = "char".concat(i);
    var char2ID = "char0".concat(i);
    var assist1ID = "assist".concat(i);
    var assist2ID = "assist0".concat(i);
    char1Select.props.id = char1ID;
    char2Select.props.id = char2ID;
    assist1Select.props.id = assist1ID;
    assist2Select.props.id = assist2ID;
    charSelection = char1Select;
    char2Selection = char2Select;
    assist1Selection = assist1Select;
    assist2Selection = assist2Select; //console.log(char1ID)

    char1Sel = $("#".concat(char1ID)).find(":selected").val();
    char2Sel = $("#".concat(char2ID)).find(":selected").val();
    assist1Sel = $("#".concat(assist1ID)).find(":selected").val();
    assist2Sel = $("#".concat(assist2ID)).find(":selected").val(); //console.log(char1Sel)

    char1Src = "/assets/img/Characters/".concat(char1Sel, ".png");
    char2Src = "/assets/img/Characters/".concat(char2Sel, ".png");
    assist1Src = "/assets/img/Assists/".concat(assist1Sel, ".png");
    assist2Src = "/assets/img/Assists/".concat(assist2Sel, ".png");
    /*<td><img id="assist1Img" src={assist1Src} alt={assist1Sel}/>{assist1Selection}</td>
    <td><img id="char1Img" src={char1Src} alt={char1Sel}/>{charSelection}</td>
    <td><img id="char2Img" src={char2Src} alt={char2Sel}/>{char2Selection}</td>
    <td><img id="assist2Img" src={assist2Src} alt={assist2Sel}/>{assist2Selection}</td>*/

    rows.push( /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      className: "form-control",
      id: "timestamp",
      type: "text",
      name: "timestamp",
      placeholder: "00:00:00"
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      className: "form-control",
      id: "playerOne",
      type: "text",
      name: "playerOne",
      placeholder: "Player 1"
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("img", {
      id: "assist1Img",
      src: assist1Src,
      alt: assist1Sel
    }), assist1Selection), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("img", {
      id: "char1Img",
      src: char1Src,
      alt: char1Sel
    }), charSelection), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("img", {
      id: "char2Img",
      src: char2Src,
      alt: char2Sel
    }), char2Selection), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("img", {
      id: "assist2Img",
      src: assist2Src,
      alt: assist2Sel
    }), assist2Selection), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      className: "form-control",
      id: "playerTwo",
      type: "text",
      name: "playerTwo",
      placeholder: "Player 2"
    })))));
  }

  return /*#__PURE__*/React.createElement("form", {
    id: "videoForm",
    onSubmit: handleVideo,
    name: "videoForm",
    action: "/main",
    method: "POST",
    className: "videoForm"
  }, /*#__PURE__*/React.createElement("div", {
    id: "static"
  }, /*#__PURE__*/React.createElement("input", {
    id: "videoLink",
    className: "form-control",
    type: "text",
    name: "videoLink",
    placeholder: "YouTube Link (https://www.youtube.com/watch?v=***********)"
  }), /*#__PURE__*/React.createElement("select", {
    className: "form-control",
    id: "version",
    placeholder: "Version"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true,
    selected: true,
    hidden: true
  }, "Vers."), /*#__PURE__*/React.createElement("option", {
    value: "2"
  }, "DFC:I"), /*#__PURE__*/React.createElement("option", {
    value: "1"
  }, "DFC")), /*#__PURE__*/React.createElement("input", {
    id: "matchDate",
    className: "form-control",
    type: "text",
    name: "matchDate",
    placeholder: "YYYY-MM-DD"
  }), /*#__PURE__*/React.createElement("table", {
    id: "videoFormTable",
    className: "table table-sm table-dark"
  }, rows), /*#__PURE__*/React.createElement("input", (_React$createElement = {
    className: "makeVideoSubmit"
  }, _defineProperty(_React$createElement, "className", "formSubmit btn mainBtn"), _defineProperty(_React$createElement, "type", "submit"), _defineProperty(_React$createElement, "value", "Add Video"), _React$createElement)), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    id: "addMatchButton",
    className: "formSubmit btn secondBtn",
    type: "button",
    value: "Add Match"
  }), /*#__PURE__*/React.createElement("input", {
    id: "removeMatchButton",
    className: "formSubmit btn thirdBtn",
    type: "button",
    value: "Remove Match"
  })));
}; /// CHANGE PASSWORD WINDOW


var ChangeWindow = function ChangeWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "changeForm",
    name: "changeForm",
    onSubmit: handleChange,
    action: "/passChange",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "old password"
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    id: "pass3",
    type: "password",
    name: "pass3",
    placeholder: "re-type password"
  }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit btn",
    type: "submit",
    value: "Change"
  }));
};

var CharacterData = function CharacterData(props) {
  var characterNodes = props.character.map(function (character) {
    var moveText;

    if (character.move) {
      moveText = /*#__PURE__*/React.createElement("h1", {
        id: "moveDiv"
      }, character.move);
    }

    return /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      id: "moveRow"
    }, /*#__PURE__*/React.createElement("div", {
      id: "moveDivContainer"
    }, moveText)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      id: "ignition"
    }, character.startup)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      id: "ignition"
    }, character.active)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
      id: "ignition"
    }, character.frameAdv))));
  });
  return /*#__PURE__*/React.createElement("div", {
    id: "charDataContainer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    className: "table table-sm",
    id: "characterDataTable"
  }, characterNodes)));
}; //Sets up the search form


var DataSearchForm = function DataSearchForm() {
  return /*#__PURE__*/React.createElement("form", {
    id: "dataForm",
    onChange: handleCharacterData,
    name: "dataSearchForm",
    action: "/getData",
    method: "GET",
    className: "searchForm form-inline"
  }, /*#__PURE__*/React.createElement("table", {
    id: "dataFormTable",
    className: "table table-sm"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, charDataSearch)))));
};

var CharacterDataImage = function CharacterDataImage() {
  var charSelect = $("#charDataSearch").find(":selected").val();
  var charSrc = "/assets/img/characterSprites/".concat(charSelect, ".png");
  return /*#__PURE__*/React.createElement("div", {
    id: "characterDataDiv"
  }, /*#__PURE__*/React.createElement("img", {
    id: "characterData",
    src: charSrc,
    alt: charSelect
  }));
};

var Load = function Load() {
  return /*#__PURE__*/React.createElement("div", {
    className: "videoList"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "emptyVideo"
  }, "Loading videos from the database..."));
};

var SiteDown = function SiteDown() {
  return /*#__PURE__*/React.createElement("div", {
    className: "videoList"
  }, /*#__PURE__*/React.createElement("h1", null, "Site Down..."), /*#__PURE__*/React.createElement("img", {
    id: "iriyaDownImg",
    src: "/assets/img/iriyaDown.JPG"
  }));
};

var SideVideo = function SideVideo() {
  var link = $("#videoLink").val();
  var videoSource = sourceObj;
  var embedLink = link.replace('watch?v=', 'embed/'); // console.log(embedLink)

  videoSource.props.src = "".concat(embedLink); //console.log(videoSource)

  return /*#__PURE__*/React.createElement("div", {
    id: "videoDiv"
  }, videoSource);
};

var AssistInfo = function AssistInfo() {
  var selected = $("#assistInfoSelect").find(":selected").text();
  var assistSrc = "/assets/img/assistSprites/".concat(selected, ".png");
  var info; // At the bottom of the file, there's an array of HTML objects, each correlating to the 
  // character. Find the one we want and put it here

  assistInfo.forEach(function (a) {
    if (a.props.value === selected) {
      info = a;
      return;
    }

    console.dir(info);
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "infoList"
  }, assistInfoSelect, /*#__PURE__*/React.createElement("img", {
    id: "assistInfoImg",
    src: assistSrc,
    alt: selected
  })), /*#__PURE__*/React.createElement("div", {
    className: "textList",
    id: "textInfo"
  }, /*#__PURE__*/React.createElement("h1", null, info)));
};

var GifBack = function GifBack() {
  return /*#__PURE__*/React.createElement("img", {
    id: "gifs",
    src: "/assets/img/background.gif"
  });
}; /// RENDERING THE LIST
/// Render the list depending on if it's a page list or the full list


var VideoList = function VideoList(props) {
  // Do we need to show deletion or not
  var deleteButton;

  if (props.videos.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "videoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyVideo"
    }, "No videos found!"));
  }

  var videoNodes = props.videos.map(function (video) {
    var char1Src;
    var char2Src;
    var assist1Src;
    var assist2Src;
    var versionSrc;
    var charImg1;
    var charImg2;
    var assistImg1;
    var assistImg2;
    var versionImg; //console.dir(video)

    char1Src = "/assets/img/Characters/".concat(video.char1, ".png");
    char2Src = "/assets/img/Characters/".concat(video.char2, ".png");
    assist1Src = "/assets/img/Assists/".concat(video.assist1, ".png");
    assist2Src = "/assets/img/Assists/".concat(video.assist2, ".png");
    versionSrc = "/assets/img/Version/".concat(video.version, ".png");
    charImg1 = /*#__PURE__*/React.createElement("img", {
      id: "char1Img",
      src: char1Src,
      alt: video.char1
    });
    charImg2 = /*#__PURE__*/React.createElement("img", {
      id: "char2Img",
      src: char2Src,
      alt: video.char2
    });
    assistImg1 = /*#__PURE__*/React.createElement("img", {
      id: "assist1Img",
      src: assist1Src,
      alt: video.assist1
    });
    assistImg2 = /*#__PURE__*/React.createElement("img", {
      id: "assist2Img",
      src: assist2Src,
      alt: video.assist2
    });
    versionImg = /*#__PURE__*/React.createElement("img", {
      id: "versionImg",
      height: "50px",
      width: "50px",
      src: versionSrc,
      alt: video.version
    });
    return /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
      id: "tdP1"
    }, video.player1), /*#__PURE__*/React.createElement("td", null, assistImg1), /*#__PURE__*/React.createElement("td", null, charImg1), /*#__PURE__*/React.createElement("td", null, charImg2), /*#__PURE__*/React.createElement("td", null, assistImg2), /*#__PURE__*/React.createElement("td", {
      id: "tdP2"
    }, video.player2), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
      href: video.link,
      className: "icons-sm yt-ic",
      target: "_blank"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fab fa-youtube fa-2x"
    }, " "))), /*#__PURE__*/React.createElement("td", null, versionImg), /*#__PURE__*/React.createElement("td", null, video.matchDate)));
  }); //console.log(videoNodes.length);

  for (videoIndex; videoIndex < videoMax; videoIndex++) {
    pagedVideos[videoIndex] = videoNodes[videoIndex];

    if (videoIndex === videoMax - 1) {
      videoIndex = 0;
      break;
    }
  } //console.log(pagedVideos.length);


  return /*#__PURE__*/React.createElement("div", {
    id: "pageContainer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    id: "videoListTable",
    className: "table table-sm table-dark"
  }, pagedVideos)), /*#__PURE__*/React.createElement("button", {
    id: "nextButton",
    className: "formSubmit btn secondBtn",
    type: "button"
  }, "View More"));
};

var loadVideosFromServer = function loadVideosFromServer() {
  loopNumber = 1;
  pageList = true;
  sendAjax('GET', '/getVideos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(VideoList, {
      videos: data.videos
    }), document.querySelector("#content"));
  });
}; // Display all videos for home page


var loadAllVideosFromServer = function loadAllVideosFromServer() {
  loopNumber = 1;
  pageList = false;
  createSearchForm();
  sendAjax('GET', '/getAllVideos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(VideoList, {
      videos: data.videos
    }), document.querySelector("#content"));
    videoMax = 300;
    var next = document.querySelector("#nextButton");
    next.addEventListener("click", function (e) {
      // console.log(pagedVideos);
      if (pagedVideos[videoMax - 2] === undefined) {
        alert("ERROR | No more videos!");
        return;
      }

      videoMax += 100;
      ReactDOM.render( /*#__PURE__*/React.createElement(VideoList, {
        videos: data.videos
      }), document.querySelector("#content"));
    });
  });
};

var createPassChangeWindow = function createPassChangeWindow(csrf) {
  // Unmount everything
  ReactDOM.unmountComponentAtNode(document.querySelector("#content"));
  ReactDOM.unmountComponentAtNode(document.querySelector("#info"));
  ReactDOM.unmountComponentAtNode(document.querySelector("#search"));
  ReactDOM.unmountComponentAtNode(document.querySelector("#gifSection"));
  loopNumber = 1;
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangeWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
};

var createAddWindow = function createAddWindow(csrf) {
  ReactDOM.unmountComponentAtNode(document.querySelector("#content"));
  ReactDOM.unmountComponentAtNode(document.querySelector("#info"));
  ReactDOM.unmountComponentAtNode(document.querySelector("#search"));
  ReactDOM.unmountComponentAtNode(document.querySelector("#gifSection"));
  ReactDOM.render( /*#__PURE__*/React.createElement(VideoForm, {
    csrf: csrf
  }), document.querySelector("#content"));
  var contentDiv = document.querySelector("#content");
  contentDiv.style.width = "58%"; //If something changes, re-render for picture purposes

  $('#videoFormTable').find('select').each(function () {
    this.onchange = function () {
      ReactDOM.render( /*#__PURE__*/React.createElement(VideoForm, {
        csrf: csrf
      }), document.querySelector("#content"));
    };
  });
  var removeMatchButton = document.querySelector("#removeMatchButton");
  removeMatchButton.addEventListener("click", function (e) {
    if (loopNumber !== 1) {
      loopNumber--; //If it's clicked, just re-render

      ReactDOM.render( /*#__PURE__*/React.createElement(VideoForm, {
        csrf: csrf
      }), document.querySelector("#content"));
      $('#videoFormTable').find('select').each(function () {
        this.onchange = function () {
          ReactDOM.render( /*#__PURE__*/React.createElement(VideoForm, {
            csrf: csrf
          }), document.querySelector("#content"));
        };
      });
    } else {
      alert("ERROR | Cannot remove last match");
    }
  }); // Get the button that was made in the videoForm

  var addMatchButton = document.querySelector("#addMatchButton");
  addMatchButton.addEventListener("click", function (e) {
    loopNumber++; //If it's clicked, just re-render

    ReactDOM.render( /*#__PURE__*/React.createElement(VideoForm, {
      csrf: csrf
    }), document.querySelector("#content"));
    $('#videoFormTable').find('select').each(function () {
      this.onchange = function () {
        ReactDOM.render( /*#__PURE__*/React.createElement(VideoForm, {
          csrf: csrf
        }), document.querySelector("#content"));
      };
    });
  });
  var videoInput = document.querySelector("#videoLink");
  videoInput.addEventListener("focusout", function (e) {
    // console.log('Hello')
    ReactDOM.render( /*#__PURE__*/React.createElement(SideVideo, null), document.querySelector("#search")); //$('vidSrc').hide().show();
  });
  ReactDOM.render( /*#__PURE__*/React.createElement("div", {
    id: "videoDiv"
  }, /*#__PURE__*/React.createElement("div", {
    id: "videoPreview"
  }, "Video Preview")), document.querySelector("#search"));
};

var createSearchForm = function createSearchForm() {
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, null), document.querySelector("#search")); // If something changes, re-render

  $('#searchForm').find('select').on('change', function () {
    ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, null), document.querySelector("#search"));
  });

  if (queryString != undefined) {
    // console.log('query string isnot empty: ' + queryString)
    var next = document.querySelector("#nextButton");
    videoMax = 300;
    next.addEventListener("click", function (e) {
      // console.log(pagedVideos[0])
      if (pagedVideos[videoMax - 1] === undefined) {
        alert("ERROR | No more videos!");
        return;
      }

      videoMax += 100;
      sendAjax('GET', queryString, null, function (data) {
        ReactDOM.render( /*#__PURE__*/React.createElement(VideoList, {
          videos: data.videos
        }), document.querySelector("#content"));
      });
    });
  }
};

var createDataForm = function createDataForm() {
  ReactDOM.unmountComponentAtNode(document.querySelector("#content"));
  ReactDOM.unmountComponentAtNode(document.querySelector("#gifSection"));
  ReactDOM.unmountComponentAtNode(document.querySelector("#info"));
  ReactDOM.unmountComponentAtNode(document.querySelector("#search"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DataSearchForm, null), document.querySelector("#search"));
  $("#dataForm").find('select').on('change', function () {
    ReactDOM.render( /*#__PURE__*/React.createElement(DataSearchForm, null), document.querySelector("#search"));
    ReactDOM.render( /*#__PURE__*/React.createElement(CharacterDataImage, null), document.querySelector('#info'));
  });
};

var createLoad = function createLoad() {
  ReactDOM.render( /*#__PURE__*/React.createElement(Load, null), document.querySelector("#content"));
};

var createSiteDown = function createSiteDown() {
  ReactDOM.render( /*#__PURE__*/React.createElement(SiteDown, null), document.querySelector('#content'));
};

var createGifs = function createGifs() {
  ReactDOM.render( /*#__PURE__*/React.createElement(GifBack, null), document.querySelector("#gifSection"));
};

var createAssistSelect = function createAssistSelect() {
  ReactDOM.render( /*#__PURE__*/React.createElement(AssistInfo, null), document.querySelector("#info"));
  $('#info').find('select').on('change', function () {
    ReactDOM.render( /*#__PURE__*/React.createElement(AssistInfo, null), document.querySelector("#info"));
  });
};

var setup = function setup(csrf) {
  var homeButton = document.querySelector("#home"); //const pageButton = document.querySelector("#myPage");

  var addButton = document.querySelector("#addVideo");
  var passChangeButton = document.querySelector("#passChangeButton");
  var reportButton = document.querySelector('#reportButton');
  var reportSubmit = document.querySelector('#reportSubmit');
  var dataButton = document.querySelector('#dataButton');
  passChangeButton.addEventListener("click", function (e) {
    e.preventDefault();
    createGifs();
    createPassChangeWindow(csrf); //Uncomment on site up

    return false;
  });
  addButton.addEventListener("click", function (e) {
    e.preventDefault();
    createAddWindow(csrf); //Uncomment on site up

    return false;
  });
  reportButton.addEventListener("click", function (e) {
    e.preventDefault();
    alert('Email at ignite-boost.net@gmail.com\n\nDiscord @TheS Spine#0453\n\n@ me in a DFC Discord\n\nPlease be as detailed as possible with your report');
    return false;
  });
  dataButton.addEventListener("click", function (e) {
    e.preventDefault();
    createDataForm();
    return false;
  });
  homeButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSearchForm();
    loadAllVideosFromServer(); //Uncomment on site up

    return false;
  });
  /*pageButton.addEventListener("click", (e) => {
      e.preventDefault();
      createSearchForm();
      loadVideosFromServer();
      return false;
  });*/

  createSearchForm();
  createLoad();
  createAssistSelect(); // Player links

  if (window.location.pathname != '/main') {
    // console.log('true')
    var player = /[^/]*$/.exec(window.location.pathname)[0]; // console.log(player)

    handleSearch(player);
  } else {
    // console.log('false')
    loadAllVideosFromServer(); //Default window Uncomment all on sit up
  } //createSiteDown();

}; //And set it in getToken


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    _csrf = result.csrfToken;
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
}); //#region Character Forms
//Separated the character forms for ease of reference and readability in above code

var char1Select = /*#__PURE__*/React.createElement("select", {
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "Akira"
}, "Akira"), /*#__PURE__*/React.createElement("option", {
  value: "Ako"
}, "Ako"), /*#__PURE__*/React.createElement("option", {
  value: "Asuna"
}, "Asuna"), /*#__PURE__*/React.createElement("option", {
  value: "Emi"
}, "Emi"), /*#__PURE__*/React.createElement("option", {
  value: "Kirino"
}, "Kirino"), /*#__PURE__*/React.createElement("option", {
  value: "Kirito"
}, "Kirito"), /*#__PURE__*/React.createElement("option", {
  value: "Kuroko"
}, "Kuroko"), /*#__PURE__*/React.createElement("option", {
  value: "Kuroyukihime"
}, "Kuroyukihime"), /*#__PURE__*/React.createElement("option", {
  value: "Mikoto"
}, "Mikoto"), /*#__PURE__*/React.createElement("option", {
  value: "Miyuki"
}, "Miyuki"), /*#__PURE__*/React.createElement("option", {
  value: "Quenser"
}, "Quenser"), /*#__PURE__*/React.createElement("option", {
  value: "Rentaro"
}, "Rentaro"), /*#__PURE__*/React.createElement("option", {
  value: "Selvaria"
}, "Selvaria"), /*#__PURE__*/React.createElement("option", {
  value: "Shana"
}, "Shana"), /*#__PURE__*/React.createElement("option", {
  value: "Shizuo"
}, "Shizuo"), /*#__PURE__*/React.createElement("option", {
  value: "Taiga"
}, "Taiga"), /*#__PURE__*/React.createElement("option", {
  value: "Tatsuya"
}, "Tatsuya"), /*#__PURE__*/React.createElement("option", {
  value: "Tomoka"
}, "Tomoka"), /*#__PURE__*/React.createElement("option", {
  value: "Yukina"
}, "Yukina"), /*#__PURE__*/React.createElement("option", {
  value: "Yuuki"
}, "Yuuki"));
var assist1Select = /*#__PURE__*/React.createElement("select", {
  id: "assist1",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "Accelerator"
}, "Accelerator"), /*#__PURE__*/React.createElement("option", {
  value: "Alicia"
}, "Alicia"), /*#__PURE__*/React.createElement("option", {
  value: "Boogiepop"
}, "Boogiepop"), /*#__PURE__*/React.createElement("option", {
  value: "Celty"
}, "Celty"), /*#__PURE__*/React.createElement("option", {
  value: "Dokuro"
}, "Dokuro"), /*#__PURE__*/React.createElement("option", {
  value: "Enju"
}, "Enju"), /*#__PURE__*/React.createElement("option", {
  value: "Erio"
}, "Erio"), /*#__PURE__*/React.createElement("option", {
  value: "Froleytia"
}, "Froleytia"), /*#__PURE__*/React.createElement("option", {
  value: "Haruyuki"
}, "Haruyuki"), /*#__PURE__*/React.createElement("option", {
  value: "Holo"
}, "Holo"), /*#__PURE__*/React.createElement("option", {
  value: "Innocent Charm"
}, "Innocent Charm"), /*#__PURE__*/React.createElement("option", {
  value: "Iriya"
}, "Iriya"), /*#__PURE__*/React.createElement("option", {
  value: "Izaya"
}, "Izaya"), /*#__PURE__*/React.createElement("option", {
  value: "Kino"
}, "Kino"), /*#__PURE__*/React.createElement("option", {
  value: "Kojou"
}, "Kojou"), /*#__PURE__*/React.createElement("option", {
  value: "Kouko"
}, "Kouko"), /*#__PURE__*/React.createElement("option", {
  value: "Kuroneko"
}, "Kuroneko"), /*#__PURE__*/React.createElement("option", {
  value: "Leafa"
}, "Leafa"), /*#__PURE__*/React.createElement("option", {
  value: "LLENN"
}, "LLENN"), /*#__PURE__*/React.createElement("option", {
  value: "Mashiro"
}, "Mashiro"), /*#__PURE__*/React.createElement("option", {
  value: "Miyuki"
}, "Miyuki"), /*#__PURE__*/React.createElement("option", {
  value: "Pai"
}, "Pai"), /*#__PURE__*/React.createElement("option", {
  value: "Rusian"
}, "Rusian"), /*#__PURE__*/React.createElement("option", {
  value: "Ryuuji"
}, "Ryuuji"), /*#__PURE__*/React.createElement("option", {
  value: "Sadao"
}, "Sadao"), /*#__PURE__*/React.createElement("option", {
  value: "Tatsuya"
}, "Tatsuya"), /*#__PURE__*/React.createElement("option", {
  value: "Touma"
}, "Touma"), /*#__PURE__*/React.createElement("option", {
  value: "Tomo"
}, "Tomo"), /*#__PURE__*/React.createElement("option", {
  value: "Uiharu"
}, "Uiharu"), /*#__PURE__*/React.createElement("option", {
  value: "Wilhelmina"
}, "Wilhelmina"), /*#__PURE__*/React.createElement("option", {
  value: "Zero"
}, "Zero"));
var char2Select = /*#__PURE__*/React.createElement("select", {
  id: "char2",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "Akira"
}, "Akira"), /*#__PURE__*/React.createElement("option", {
  value: "Ako"
}, "Ako"), /*#__PURE__*/React.createElement("option", {
  value: "Asuna"
}, "Asuna"), /*#__PURE__*/React.createElement("option", {
  value: "Emi"
}, "Emi"), /*#__PURE__*/React.createElement("option", {
  value: "Kirino"
}, "Kirino"), /*#__PURE__*/React.createElement("option", {
  value: "Kirito"
}, "Kirito"), /*#__PURE__*/React.createElement("option", {
  value: "Kuroko"
}, "Kuroko"), /*#__PURE__*/React.createElement("option", {
  value: "Kuroyukihime"
}, "Kuroyukihime"), /*#__PURE__*/React.createElement("option", {
  value: "Mikoto"
}, "Mikoto"), /*#__PURE__*/React.createElement("option", {
  value: "Miyuki"
}, "Miyuki"), /*#__PURE__*/React.createElement("option", {
  value: "Quenser"
}, "Quenser"), /*#__PURE__*/React.createElement("option", {
  value: "Rentaro"
}, "Rentaro"), /*#__PURE__*/React.createElement("option", {
  value: "Selvaria"
}, "Selvaria"), /*#__PURE__*/React.createElement("option", {
  value: "Shana"
}, "Shana"), /*#__PURE__*/React.createElement("option", {
  value: "Shizuo"
}, "Shizuo"), /*#__PURE__*/React.createElement("option", {
  value: "Taiga"
}, "Taiga"), /*#__PURE__*/React.createElement("option", {
  value: "Tatsuya"
}, "Tatsuya"), /*#__PURE__*/React.createElement("option", {
  value: "Tomoka"
}, "Tomoka"), /*#__PURE__*/React.createElement("option", {
  value: "Yukina"
}, "Yukina"), /*#__PURE__*/React.createElement("option", {
  value: "Yuuki"
}, "Yuuki"));
var assist2Select = /*#__PURE__*/React.createElement("select", {
  id: "assist2",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "Accelerator"
}, "Accelerator"), /*#__PURE__*/React.createElement("option", {
  value: "Alicia"
}, "Alicia"), /*#__PURE__*/React.createElement("option", {
  value: "Boogiepop"
}, "Boogiepop"), /*#__PURE__*/React.createElement("option", {
  value: "Celty"
}, "Celty"), /*#__PURE__*/React.createElement("option", {
  value: "Dokuro"
}, "Dokuro"), /*#__PURE__*/React.createElement("option", {
  value: "Enju"
}, "Enju"), /*#__PURE__*/React.createElement("option", {
  value: "Erio"
}, "Erio"), /*#__PURE__*/React.createElement("option", {
  value: "Froleytia"
}, "Froleytia"), /*#__PURE__*/React.createElement("option", {
  value: "Haruyuki"
}, "Haruyuki"), /*#__PURE__*/React.createElement("option", {
  value: "Holo"
}, "Holo"), /*#__PURE__*/React.createElement("option", {
  value: "Innocent Charm"
}, "Innocent Charm"), /*#__PURE__*/React.createElement("option", {
  value: "Iriya"
}, "Iriya"), /*#__PURE__*/React.createElement("option", {
  value: "Izaya"
}, "Izaya"), /*#__PURE__*/React.createElement("option", {
  value: "Kino"
}, "Kino"), /*#__PURE__*/React.createElement("option", {
  value: "Kojou"
}, "Kojou"), /*#__PURE__*/React.createElement("option", {
  value: "Kouko"
}, "Kouko"), /*#__PURE__*/React.createElement("option", {
  value: "Kuroneko"
}, "Kuroneko"), /*#__PURE__*/React.createElement("option", {
  value: "Leafa"
}, "Leafa"), /*#__PURE__*/React.createElement("option", {
  value: "LLENN"
}, "LLENN"), /*#__PURE__*/React.createElement("option", {
  value: "Mashiro"
}, "Mashiro"), /*#__PURE__*/React.createElement("option", {
  value: "Miyuki"
}, "Miyuki"), /*#__PURE__*/React.createElement("option", {
  value: "Pai"
}, "Pai"), /*#__PURE__*/React.createElement("option", {
  value: "Rusian"
}, "Rusian"), /*#__PURE__*/React.createElement("option", {
  value: "Ryuuji"
}, "Ryuuji"), /*#__PURE__*/React.createElement("option", {
  value: "Sadao"
}, "Sadao"), /*#__PURE__*/React.createElement("option", {
  value: "Tatsuya"
}, "Tatsuya"), /*#__PURE__*/React.createElement("option", {
  value: "Touma"
}, "Touma"), /*#__PURE__*/React.createElement("option", {
  value: "Tomo"
}, "Tomo"), /*#__PURE__*/React.createElement("option", {
  value: "Uiharu"
}, "Uiharu"), /*#__PURE__*/React.createElement("option", {
  value: "Wilhelmina"
}, "Wilhelmina"), /*#__PURE__*/React.createElement("option", {
  value: "Zero"
}, "Zero"));
var char1Search = /*#__PURE__*/React.createElement("select", {
  id: "char1Search",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "undefined",
  disabled: true,
  selected: true,
  hidden: true
}, "Char 1"), /*#__PURE__*/React.createElement("option", {
  value: "Anyone"
}, "Anyone"), /*#__PURE__*/React.createElement("option", {
  value: "Akira"
}, "Akira"), /*#__PURE__*/React.createElement("option", {
  value: "Ako"
}, "Ako"), /*#__PURE__*/React.createElement("option", {
  value: "Asuna"
}, "Asuna"), /*#__PURE__*/React.createElement("option", {
  value: "Emi"
}, "Emi"), /*#__PURE__*/React.createElement("option", {
  value: "Kirino"
}, "Kirino"), /*#__PURE__*/React.createElement("option", {
  value: "Kirito"
}, "Kirito"), /*#__PURE__*/React.createElement("option", {
  value: "Kuroko"
}, "Kuroko"), /*#__PURE__*/React.createElement("option", {
  value: "Kuroyukihime"
}, "Kuroyukihime"), /*#__PURE__*/React.createElement("option", {
  value: "Mikoto"
}, "Mikoto"), /*#__PURE__*/React.createElement("option", {
  value: "Miyuki"
}, "Miyuki"), /*#__PURE__*/React.createElement("option", {
  value: "Quenser"
}, "Quenser"), /*#__PURE__*/React.createElement("option", {
  value: "Rentaro"
}, "Rentaro"), /*#__PURE__*/React.createElement("option", {
  value: "Selvaria"
}, "Selvaria"), /*#__PURE__*/React.createElement("option", {
  value: "Shana"
}, "Shana"), /*#__PURE__*/React.createElement("option", {
  value: "Shizuo"
}, "Shizuo"), /*#__PURE__*/React.createElement("option", {
  value: "Taiga"
}, "Taiga"), /*#__PURE__*/React.createElement("option", {
  value: "Tatsuya"
}, "Tatsuya"), /*#__PURE__*/React.createElement("option", {
  value: "Tomoka"
}, "Tomoka"), /*#__PURE__*/React.createElement("option", {
  value: "Yukina"
}, "Yukina"), /*#__PURE__*/React.createElement("option", {
  value: "Yuuki"
}, "Yuuki"));
var assist1Search = /*#__PURE__*/React.createElement("select", {
  id: "assist1Search",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "undefined",
  disabled: true,
  selected: true,
  hidden: true
}, "Ast 1"), /*#__PURE__*/React.createElement("option", {
  value: "Anyone"
}, "Anyone"), /*#__PURE__*/React.createElement("option", {
  value: "Accelerator"
}, "Accelerator"), /*#__PURE__*/React.createElement("option", {
  value: "Alicia"
}, "Alicia"), /*#__PURE__*/React.createElement("option", {
  value: "Boogiepop"
}, "Boogiepop"), /*#__PURE__*/React.createElement("option", {
  value: "Celty"
}, "Celty"), /*#__PURE__*/React.createElement("option", {
  value: "Dokuro"
}, "Dokuro"), /*#__PURE__*/React.createElement("option", {
  value: "Enju"
}, "Enju"), /*#__PURE__*/React.createElement("option", {
  value: "Erio"
}, "Erio"), /*#__PURE__*/React.createElement("option", {
  value: "Froleytia"
}, "Froleytia"), /*#__PURE__*/React.createElement("option", {
  value: "Haruyuki"
}, "Haruyuki"), /*#__PURE__*/React.createElement("option", {
  value: "Holo"
}, "Holo"), /*#__PURE__*/React.createElement("option", {
  value: "Innocent Charm"
}, "Innocent Charm"), /*#__PURE__*/React.createElement("option", {
  value: "Iriya"
}, "Iriya"), /*#__PURE__*/React.createElement("option", {
  value: "Izaya"
}, "Izaya"), /*#__PURE__*/React.createElement("option", {
  value: "Kino"
}, "Kino"), /*#__PURE__*/React.createElement("option", {
  value: "Kojou"
}, "Kojou"), /*#__PURE__*/React.createElement("option", {
  value: "Kouko"
}, "Kouko"), /*#__PURE__*/React.createElement("option", {
  value: "Kuroneko"
}, "Kuroneko"), /*#__PURE__*/React.createElement("option", {
  value: "Leafa"
}, "Leafa"), /*#__PURE__*/React.createElement("option", {
  value: "LLENN"
}, "LLENN"), /*#__PURE__*/React.createElement("option", {
  value: "Mashiro"
}, "Mashiro"), /*#__PURE__*/React.createElement("option", {
  value: "Miyuki"
}, "Miyuki"), /*#__PURE__*/React.createElement("option", {
  value: "Pai"
}, "Pai"), /*#__PURE__*/React.createElement("option", {
  value: "Rusian"
}, "Rusian"), /*#__PURE__*/React.createElement("option", {
  value: "Ryuuji"
}, "Ryuuji"), /*#__PURE__*/React.createElement("option", {
  value: "Sadao"
}, "Sadao"), /*#__PURE__*/React.createElement("option", {
  value: "Tatsuya"
}, "Tatsuya"), /*#__PURE__*/React.createElement("option", {
  value: "Touma"
}, "Touma"), /*#__PURE__*/React.createElement("option", {
  value: "Tomo"
}, "Tomo"), /*#__PURE__*/React.createElement("option", {
  value: "Uiharu"
}, "Uiharu"), /*#__PURE__*/React.createElement("option", {
  value: "Wilhelmina"
}, "Wilhelmina"), /*#__PURE__*/React.createElement("option", {
  value: "Zero"
}, "Zero"));
var char2Search = /*#__PURE__*/React.createElement("select", {
  id: "char2Search",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "undefined",
  disabled: true,
  selected: true,
  hidden: true
}, "Char 2"), /*#__PURE__*/React.createElement("option", {
  value: "Anyone"
}, "Anyone"), /*#__PURE__*/React.createElement("option", {
  value: "Akira"
}, "Akira"), /*#__PURE__*/React.createElement("option", {
  value: "Ako"
}, "Ako"), /*#__PURE__*/React.createElement("option", {
  value: "Asuna"
}, "Asuna"), /*#__PURE__*/React.createElement("option", {
  value: "Emi"
}, "Emi"), /*#__PURE__*/React.createElement("option", {
  value: "Kirino"
}, "Kirino"), /*#__PURE__*/React.createElement("option", {
  value: "Kirito"
}, "Kirito"), /*#__PURE__*/React.createElement("option", {
  value: "Kuroko"
}, "Kuroko"), /*#__PURE__*/React.createElement("option", {
  value: "Kuroyukihime"
}, "Kuroyukihime"), /*#__PURE__*/React.createElement("option", {
  value: "Mikoto"
}, "Mikoto"), /*#__PURE__*/React.createElement("option", {
  value: "Miyuki"
}, "Miyuki"), /*#__PURE__*/React.createElement("option", {
  value: "Quenser"
}, "Quenser"), /*#__PURE__*/React.createElement("option", {
  value: "Rentaro"
}, "Rentaro"), /*#__PURE__*/React.createElement("option", {
  value: "Selvaria"
}, "Selvaria"), /*#__PURE__*/React.createElement("option", {
  value: "Shana"
}, "Shana"), /*#__PURE__*/React.createElement("option", {
  value: "Shizuo"
}, "Shizuo"), /*#__PURE__*/React.createElement("option", {
  value: "Taiga"
}, "Taiga"), /*#__PURE__*/React.createElement("option", {
  value: "Tatsuya"
}, "Tatsuya"), /*#__PURE__*/React.createElement("option", {
  value: "Tomoka"
}, "Tomoka"), /*#__PURE__*/React.createElement("option", {
  value: "Yukina"
}, "Yukina"), /*#__PURE__*/React.createElement("option", {
  value: "Yuuki"
}, "Yuuki"));
var assist2Search = /*#__PURE__*/React.createElement("select", {
  id: "assist2Search",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "undefined",
  disabled: true,
  selected: true,
  hidden: true
}, "Ast 2"), /*#__PURE__*/React.createElement("option", {
  value: "Anyone"
}, "Anyone"), /*#__PURE__*/React.createElement("option", {
  value: "Accelerator"
}, "Accelerator"), /*#__PURE__*/React.createElement("option", {
  value: "Alicia"
}, "Alicia"), /*#__PURE__*/React.createElement("option", {
  value: "Boogiepop"
}, "Boogiepop"), /*#__PURE__*/React.createElement("option", {
  value: "Celty"
}, "Celty"), /*#__PURE__*/React.createElement("option", {
  value: "Dokuro"
}, "Dokuro"), /*#__PURE__*/React.createElement("option", {
  value: "Enju"
}, "Enju"), /*#__PURE__*/React.createElement("option", {
  value: "Erio"
}, "Erio"), /*#__PURE__*/React.createElement("option", {
  value: "Froleytia"
}, "Froleytia"), /*#__PURE__*/React.createElement("option", {
  value: "Haruyuki"
}, "Haruyuki"), /*#__PURE__*/React.createElement("option", {
  value: "Holo"
}, "Holo"), /*#__PURE__*/React.createElement("option", {
  value: "Innocent Charm"
}, "Innocent Charm"), /*#__PURE__*/React.createElement("option", {
  value: "Iriya"
}, "Iriya"), /*#__PURE__*/React.createElement("option", {
  value: "Izaya"
}, "Izaya"), /*#__PURE__*/React.createElement("option", {
  value: "Kino"
}, "Kino"), /*#__PURE__*/React.createElement("option", {
  value: "Kojou"
}, "Kojou"), /*#__PURE__*/React.createElement("option", {
  value: "Kouko"
}, "Kouko"), /*#__PURE__*/React.createElement("option", {
  value: "Kuroneko"
}, "Kuroneko"), /*#__PURE__*/React.createElement("option", {
  value: "Leafa"
}, "Leafa"), /*#__PURE__*/React.createElement("option", {
  value: "LLENN"
}, "LLENN"), /*#__PURE__*/React.createElement("option", {
  value: "Mashiro"
}, "Mashiro"), /*#__PURE__*/React.createElement("option", {
  value: "Miyuki"
}, "Miyuki"), /*#__PURE__*/React.createElement("option", {
  value: "Pai"
}, "Pai"), /*#__PURE__*/React.createElement("option", {
  value: "Rusian"
}, "Rusian"), /*#__PURE__*/React.createElement("option", {
  value: "Ryuuji"
}, "Ryuuji"), /*#__PURE__*/React.createElement("option", {
  value: "Sadao"
}, "Sadao"), /*#__PURE__*/React.createElement("option", {
  value: "Tatsuya"
}, "Tatsuya"), /*#__PURE__*/React.createElement("option", {
  value: "Touma"
}, "Touma"), /*#__PURE__*/React.createElement("option", {
  value: "Tomo"
}, "Tomo"), /*#__PURE__*/React.createElement("option", {
  value: "Uiharu"
}, "Uiharu"), /*#__PURE__*/React.createElement("option", {
  value: "Wilhelmina"
}, "Wilhelmina"), /*#__PURE__*/React.createElement("option", {
  value: "Zero"
}, "Zero"));
var assistInfoSelect = /*#__PURE__*/React.createElement("select", {
  id: "assistInfoSelect",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Ast Info"), /*#__PURE__*/React.createElement("option", {
  value: "Accelerator"
}, "Accelerator"), /*#__PURE__*/React.createElement("option", {
  value: "Alicia"
}, "Alicia"), /*#__PURE__*/React.createElement("option", {
  value: "Boogiepop"
}, "Boogiepop"), /*#__PURE__*/React.createElement("option", {
  value: "Celty"
}, "Celty"), /*#__PURE__*/React.createElement("option", {
  value: "Dokuro"
}, "Dokuro"), /*#__PURE__*/React.createElement("option", {
  value: "Enju"
}, "Enju"), /*#__PURE__*/React.createElement("option", {
  value: "Erio"
}, "Erio"), /*#__PURE__*/React.createElement("option", {
  value: "Froleytia"
}, "Froleytia"), /*#__PURE__*/React.createElement("option", {
  value: "Haruyuki"
}, "Haruyuki"), /*#__PURE__*/React.createElement("option", {
  value: "Holo"
}, "Holo"), /*#__PURE__*/React.createElement("option", {
  value: "Innocent Charm"
}, "Innocent Charm"), /*#__PURE__*/React.createElement("option", {
  value: "Iriya"
}, "Iriya"), /*#__PURE__*/React.createElement("option", {
  value: "Izaya"
}, "Izaya"), /*#__PURE__*/React.createElement("option", {
  value: "Kino"
}, "Kino"), /*#__PURE__*/React.createElement("option", {
  value: "Kojou"
}, "Kojou"), /*#__PURE__*/React.createElement("option", {
  value: "Kouko"
}, "Kouko"), /*#__PURE__*/React.createElement("option", {
  value: "Kuroneko"
}, "Kuroneko"), /*#__PURE__*/React.createElement("option", {
  value: "Leafa"
}, "Leafa"), /*#__PURE__*/React.createElement("option", {
  value: "LLENN"
}, "LLENN"), /*#__PURE__*/React.createElement("option", {
  value: "Mashiro"
}, "Mashiro"), /*#__PURE__*/React.createElement("option", {
  value: "Miyuki"
}, "Miyuki"), /*#__PURE__*/React.createElement("option", {
  value: "Pai"
}, "Pai"), /*#__PURE__*/React.createElement("option", {
  value: "Rusian"
}, "Rusian"), /*#__PURE__*/React.createElement("option", {
  value: "Ryuuji"
}, "Ryuuji"), /*#__PURE__*/React.createElement("option", {
  value: "Sadao"
}, "Sadao"), /*#__PURE__*/React.createElement("option", {
  value: "Tatsuya"
}, "Tatsuya"), /*#__PURE__*/React.createElement("option", {
  value: "Touma"
}, "Touma"), /*#__PURE__*/React.createElement("option", {
  value: "Tomo"
}, "Tomo"), /*#__PURE__*/React.createElement("option", {
  value: "Uiharu"
}, "Uiharu"), /*#__PURE__*/React.createElement("option", {
  value: "Wilhelmina"
}, "Wilhelmina"), /*#__PURE__*/React.createElement("option", {
  value: "Zero"
}, "Zero"));
var charDataSearch = /*#__PURE__*/React.createElement("select", {
  id: "charDataSearch",
  className: "form-control"
}, /*#__PURE__*/React.createElement("option", {
  value: "undefined",
  disabled: true,
  selected: true,
  hidden: true
}, "Char"), /*#__PURE__*/React.createElement("option", {
  value: "Akira"
}, "Akira"), /*#__PURE__*/React.createElement("option", {
  value: "Ako"
}, "Ako"), /*#__PURE__*/React.createElement("option", {
  value: "Asuna"
}, "Asuna"), /*#__PURE__*/React.createElement("option", {
  value: "Emi"
}, "Emi"), /*#__PURE__*/React.createElement("option", {
  value: "Kirino"
}, "Kirino"), /*#__PURE__*/React.createElement("option", {
  value: "Kirito"
}, "Kirito"), /*#__PURE__*/React.createElement("option", {
  value: "Kuroko"
}, "Kuroko"), /*#__PURE__*/React.createElement("option", {
  value: "Kuroyukihime"
}, "Kuroyukihime"), /*#__PURE__*/React.createElement("option", {
  value: "Mikoto"
}, "Mikoto"), /*#__PURE__*/React.createElement("option", {
  value: "Miyuki"
}, "Miyuki"), /*#__PURE__*/React.createElement("option", {
  value: "Quenser"
}, "Quenser"), /*#__PURE__*/React.createElement("option", {
  value: "Rentaro"
}, "Rentaro"), /*#__PURE__*/React.createElement("option", {
  value: "Selvaria"
}, "Selvaria"), /*#__PURE__*/React.createElement("option", {
  value: "Shana"
}, "Shana"), /*#__PURE__*/React.createElement("option", {
  value: "Shizuo"
}, "Shizuo"), /*#__PURE__*/React.createElement("option", {
  value: "Taiga"
}, "Taiga"), /*#__PURE__*/React.createElement("option", {
  value: "Tatsuya"
}, "Tatsuya"), /*#__PURE__*/React.createElement("option", {
  value: "Tomoka"
}, "Tomoka"), /*#__PURE__*/React.createElement("option", {
  value: "Yukina"
}, "Yukina"), /*#__PURE__*/React.createElement("option", {
  value: "Yuuki"
}, "Yuuki"));
var sourceObj = /*#__PURE__*/React.createElement("iframe", {
  height: "550",
  width: "1100",
  id: "vidSrc"
});
var assistInfo = [/*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Accelerator"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Last Order wanders onto the stage for several seconds and if she is attacked, Accelerator will appear and attack the opponent, blowing them away on hit "), /*#__PURE__*/React.createElement("li", null, "The startup on the counter is slow enough that fast attacks like Kino 5S can interrupt it if the opponent is looking for it"), /*#__PURE__*/React.createElement("li", null, "If the opponent is hit while Last Order is out, the counter will be negated"), /*#__PURE__*/React.createElement("li", null, "The counter-attack is not instant and can be blocked if triggered from a jump in or a low recovery move"), /*#__PURE__*/React.createElement("li", null, "The counter-attack is full screen and has a ton of blockstun, letting you approach the opponent if blocked"), /*#__PURE__*/React.createElement("li", null, "Has a special interaction with the Touma support, where Accelerator's counter will not activate if triggered by Touma's 6S"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Accelerator stomps the ground and sends a ground wave across the stage that bounces the opponent up and down"), /*#__PURE__*/React.createElement("li", null, "There is enough time to dash up while the opponent is being bounced to continue the combo. What you can do depends on how close you are initially"), /*#__PURE__*/React.createElement("li", null, "Does not hit against airborne opponents")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Alicia"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Alicia throws a grenade that explodes when it touches the ground, launching the opponent"), /*#__PURE__*/React.createElement("li", null, "The grenade itself does not have a hitbox, only the explosion"), /*#__PURE__*/React.createElement("li", null, "The grenade has enough delay for you to run up and perform a quick mixup, if close enough"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Alicia poses in front of the player and after a short delay, she transforms into Valkyria mode and teleports towards the opponent and attacks with a multi hitting move that launches the opponent "), /*#__PURE__*/React.createElement("li", null, "As soon as Alicia's hair fully turns blue, she cannot be interrupted, even if the opponent hits you")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Boogiepop"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Boogiepop appears in front of the player and uses a ranged attack"), /*#__PURE__*/React.createElement("li", null, "Launches on hit"), /*#__PURE__*/React.createElement("li", null, "Only hits a specific area, can whiff if too close or too far away"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Boogiepop appears in front of the player for a long amount of time as a flute plays. Afterwards they turn around, the screen goes dark, then they attack the entire screen. "), /*#__PURE__*/React.createElement("li", null, "Launches on hit"), /*#__PURE__*/React.createElement("li", null, "Hits full screen and is air unblockable"), /*#__PURE__*/React.createElement("li", null, "Deals 500 damage and 1500 white damage when blocked"), /*#__PURE__*/React.createElement("li", null, "During the startup you gain 65% of a bar of meter")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Celty"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Celty will ride across the screen on a motorcycle and slash at the opponent as she passes by. "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Celty will fall from the air on her motorcycle and ride back the direction she came from as she lands. Launches high on hit for easy combo confirms.")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Dokuro"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Dokuro falls from the top of the screen with her mace "), /*#__PURE__*/React.createElement("li", null, "Hits about 2 characters spaces in front the player and covers the entire vertical space because of its quick speed"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "5[S]"), /*#__PURE__*/React.createElement("p", null, "Dokuro throws her mace and knocks your own character into the air and wall bounces into another hard knockdown"), /*#__PURE__*/React.createElement("li", null, "Only available when you are knocked down at the cost of 3 meter"), /*#__PURE__*/React.createElement("li", null, "This hit inflicts around 1500 white damage to yourself"), /*#__PURE__*/React.createElement("li", null, "Afterwards she spins her mace around that hits multiple times "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Dokuro throws her mace extremely fast across the screen at an upward angle"), /*#__PURE__*/React.createElement("li", null, "Launches on hit"), /*#__PURE__*/React.createElement("li", null, "Because of the angle, this move will whiff against crouching opponents from full screen"), /*#__PURE__*/React.createElement("li", null, "Will generally cause hard knockdown on hit, even with substantial combo proration before it")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Enju"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Enju appears from the top corner of the screen behind the player and divekicks the opponent, targeting the location the opponent was at during the startup. Launches the opponent on hit."), /*#__PURE__*/React.createElement("li", null, "If Enju lands a clean hit on the opponent, the screen will zoom in and award bonus damage, and Enju will attack a second time, knocking the opponent down to ground level."), /*#__PURE__*/React.createElement("li", null, "If Enju lands an off-center hit on the opponent, the screen will not zoom in."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "5[S]"), /*#__PURE__*/React.createElement("p", null, "Enju appears and applies a mark on the opponent that lasts for about 10 seconds and does one of the following:"), /*#__PURE__*/React.createElement("li", null, "If the opponent calls his assist while the mark is active, Enju kicks the assist away and negates it"), /*#__PURE__*/React.createElement("li", null, "If the opponent is hit Enju will attack just like 5S, however there is no follow up attack"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Enju appears directly in front of the player and launches the opponent"), /*#__PURE__*/React.createElement("li", null, "If Enju lands this move while the opponent is still on their feet (?), the screen will zoom in and award full damage. Otherwise, the move will do substantially reduced damage.")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Erio"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Erio runs from behind you to 2/3s of the screen away and covers herself in a futon, hopping towards the opponent. As she hops around, any opponent attack hitbox that touches her will be nullified and treated as a whiffed move that can't be canceled out of, allowing you to \"whiff punish\" moves that would have hit you normally. Any player attack hitbox that touches her will not change, but will force Erio to hop slightly in that direction. "), /*#__PURE__*/React.createElement("li", null, "Erio will continue to hop around until either:", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "The player hits Erio 3 times in total"), /*#__PURE__*/React.createElement("li", null, "The opponent hits Erio at least 1 time and Erio has hopped 3 times in total"), /*#__PURE__*/React.createElement("li", null, "Erio has hopped 20 times"))), /*#__PURE__*/React.createElement("li", null, "Erio does start this move 2/3s of the screen away, and takes a long time to become active, so this move is mainly for offensive oki pressure. It is very unsuitable if you are being cornered by the opponent, unlike many other counter assists."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Erio runs in from behind your character and slides across the floor to the other side of the screen. She will then run in from that other side, after which you can hit her again to repeat the sliding attack. Erio can slide 3 times in total per assist call. "), /*#__PURE__*/React.createElement("li", null, "Once Erio starts her first slide, she cannot be interrupted by the opponent for that slide and all subsequent run-slides."), /*#__PURE__*/React.createElement("li", null, "If the player does not hit Erio while running in the second time, she will continue off screen, ending her assist call without a third run-by.")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Froleytia"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Froleytia appears behind the player and supports them with cover fire aimed at the ground around and in front of the player "), /*#__PURE__*/React.createElement("li", null, "The animation of the diagonal cover fire has no hitbox, the attack is only the ground effect"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Froleytia appears in front of the player and after a brief moment she supports him with with a barrage of missiles"), /*#__PURE__*/React.createElement("li", null, "The missiles will track the opponent wherever they are on screen, with seemingly no height limit"), /*#__PURE__*/React.createElement("li", null, "Froleytia is vulnerable for the entire move, including while her missiles are firing. Given that fact and how she stands out in the open, this assist is not very suited as neutral tool, and should be used for combos and wakeup setups instead.")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Haruyuki"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Haruyuki applies a marker on the opponent, and after a short delay he divekicks the opponent and flies away."), /*#__PURE__*/React.createElement("li", null, "The second hit launches the opponent for an easy combo confirm."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "5[S]"), /*#__PURE__*/React.createElement("p", null, "Haruyuki applies a marker on the opponent, and once the opponent is hit Haruyuki will automatically attack like in his 5S. If the opponent is not hit within 10 seconds, Haruyuki will cancel his attack."), /*#__PURE__*/React.createElement("li", null, "Does not have the ability to negate the opponent's assist like Enju."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Haruyuki appears in front of the player, and fires a charged arrow horizontally across the screen. Wallbounces on hit, giving ample time to run up and extend a combo or land a Power Blast. ")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Holo"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Holo slashes the opponent with her large claw, launching the opponent on hit"), /*#__PURE__*/React.createElement("li", null, "The opponent can tech out of the air on the way down, so going straight to an air combo might be needed depending on the starter"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Holo hops forward and summons a small field of wheat for 2.5 seconds"), /*#__PURE__*/React.createElement("li", null, "Holo's initial hop can hit the opponent, which can lead into a hard knockdown into OTG, or be extended into a longer combo. It is recommended to choose an option that let's your character remain in the field, otherwise you should use 5S for damage."), /*#__PURE__*/React.createElement("li", null, "Once Holo creates the field of wheat, she can no longer be hit"), /*#__PURE__*/React.createElement("li", null, "When the field of wheat is summoned for the first time in a round, the player will receive the following buffs:", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Status Up Level 1 (6% attack up and 6% defense up) for 10 seconds, as soon as you enter the field"), /*#__PURE__*/React.createElement("li", null, "Regeneration of up to 15% health and 15% white health for a total of 30%, depending on how long you were on the field"), /*#__PURE__*/React.createElement("li", null, "Regeneration of up to 80% of one bar of meter, depending on how long you were on the field"))), /*#__PURE__*/React.createElement("li", null, "On subsequent summonings in the same round, the health and meter regeneration are drastically reduced."), /*#__PURE__*/React.createElement("li", null, "As long as your horizontal position is over the field, it will count for \"being on the field\", even if you are jumping."), /*#__PURE__*/React.createElement("li", null, "Blocking attacks within the field will deny your health and meter regeneration.")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Innocent Charm"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Hina comes out a small distance in front of the player and sparkles fly around her while slowly pulling the opponent towards her. While the sparkles are visible, Hina can block one hit from any hitbox, releasing bubbles as a counter. These bubbles put the opponent in hitstop, are only one hit, and can be blocked. The counter can be safe-jumped. "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Hina flies further than 5S distance and has bubbles come out immediately while also pulling the opponent toward her. These bubbles are only one hit and can be blocked. If not blocked, it puts the opponent in hitstop. ")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Iriya"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Iriya appears in front of the player and eats a bowl of food"), /*#__PURE__*/React.createElement("li", null, "Once the bowl of food is eaten a food icon will appear and up to 3 icons can be stored", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "The player can hit the bowl to knock it towards the opponent. Hitting it with an A normal will arc it toward the opponent's position. Hitting it with a B or C normal will send it up off the screen, and will drop directly over the opponent's position after a second passes."))), /*#__PURE__*/React.createElement("li", null, "Once 2 food icons are collected, the player receives Status Up Lv. 1 for 10 seconds"), /*#__PURE__*/React.createElement("li", null, "Once 3 food icons are collected, the player receives Status Up Lv. 3 for 10 seconds, and a row of air-unblockable explosions go off. The number of food icons will reset to 0."), /*#__PURE__*/React.createElement("li", null, "Iriya can be hit by the opponent to deny the food buffs if done early enough in her animation. If too slow, the opponent can at least deny the plate projectile."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Iriya appears behind the opponent and hits them with her scooter, launching the opponent horizontally on hit. "), /*#__PURE__*/React.createElement("li", null, "Useful as a full-screen poke, or as a combo extension")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Izaya"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Izaya appears in front of the player holding his hands up, and if he is hit he teleports behind the opponent and slashes him multiple times, launching them vertically on hit"), /*#__PURE__*/React.createElement("li", null, "The counter is not instant and can be blocked if triggered from a jump in or a low recovery move"), /*#__PURE__*/React.createElement("li", null, "If the move is Support Cancelled, he automatically does the follow up attack instead"), /*#__PURE__*/React.createElement("li", null, "2nd startup value is when he is Support Cancelled"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Izaya trips the opponent with his foot then stomps on 3 times before kicking 1 more time."), /*#__PURE__*/React.createElement("li", null, "Has fairly quick startup and the hitbox is deceptively large"), /*#__PURE__*/React.createElement("li", null, "Normally the opponent is in OTG state, but Trump Cards and Climax Arts will connect, but only before the 4th kick.")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Kino"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Shoots horizontally. Fast start-up, bullet moves fast, fast recovery. Low damage."), /*#__PURE__*/React.createElement("li", null, "Startup is based off when used at the closest possible distance"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Charges a little and then shoots diagonally upwards. Slow start-up and launches upwards on hit, normally leading to a hard knockdown. ")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Kojou"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Summons Regulus Aurum which attacks the opponent with a homing lightning strike, which scatters across the ground "), /*#__PURE__*/React.createElement("li", null, "Has fairly long startup, but lasts for a long while"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Summons Al-Nasl-Minium which attacks the enemy with crimson light "), /*#__PURE__*/React.createElement("li", null, "Has quicker startup compared to 5S and floats the opponent on hit")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Kouko"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Throws a bouquet of flowers upwards then blows a kiss afterwards that leaves a status effect that drains the opponents meter and gives you meter "), /*#__PURE__*/React.createElement("li", null, "You will continue to get meter even if the opponent has none"), /*#__PURE__*/React.createElement("li", null, "Only hits against opponents that are either in hitstun or are airborne"), /*#__PURE__*/React.createElement("li", null, "On hit the kiss will always connect and on block or whiff the kiss mark will slowly track the opponent and is unblockable"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "5[S]"), /*#__PURE__*/React.createElement("p", null, "Appears behind the opponent and walks towards them, attacks exactly like 5S "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Appears behind the player at the edge of the screen and walks towards the opponent. When she reaches the opponent, she hits them multiple times with a bouquet, blows a kiss, then walks away in the same direction she came from "), /*#__PURE__*/React.createElement("li", null, "The status effect is the same as 5S"), /*#__PURE__*/React.createElement("li", null, "Startup is variable and does not activate until she reaches the opponent, or in the case of an airborne opponent she will attack the opponent's last grounded position")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Kuroneko"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Kuroneko summons rose petals and scatters them towards the opponent, 13 hits in total. "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "If Kamineko activates, this will have faster startup and will send 22 petals across a longer period of time. "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Kuroneko places a magic circle on your character. Once any attack touches your character, on block or hit, the magic circle will activate and attack anything within the range of the circle, including the player. The activation can be blocked by both players. "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "If Kamineko activates, the magic circle activation will not harm your character. ")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Leafa"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Leafa will set out a large gust of wind across the screen that tracks the opponent. On hit will knock up. "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Leafa will fly to the middle of the screen and do a quick dash homed at the opponent ")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "LLENN"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "LLENN appears in a proximity sensitive case then jumps out and shoots the opponent "), /*#__PURE__*/React.createElement("li", null, "LLENN will jump out of the case when either the opponent comes into proximity or a set amount of time passes"), /*#__PURE__*/React.createElement("li", null, "Unlike a regular projectile, the range on LLENN's attack is fairly short"), /*#__PURE__*/React.createElement("li", null, "It is possible for the player to hit the case to move it forward, and LLENN will immediately attack afterwards", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "The case gains a hitbox when it is hit"), /*#__PURE__*/React.createElement("li", null, "The distance the case moves is dependent on the attack, A attacks will move it slightly while B and C attacks will move it further"))), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "5[S]"), /*#__PURE__*/React.createElement("p", null, "Same attack as 5S, however the case will hop forward every couple of seconds "), /*#__PURE__*/React.createElement("li", null, "LLENN can move a total of four times before she jumps out and attacks"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "LLENN appears from behind the player and runs directly in front of the opponent and shoots him "), /*#__PURE__*/React.createElement("li", null, "The attack has the same properties as 5S")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Mashiro"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Mashiro summons baumkuchen that roll across the screen "), /*#__PURE__*/React.createElement("li", null, "Can hit up to 5 times and the last hit launches and causes hard knockdown"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Mashiro summons four cats that run across the screen "), /*#__PURE__*/React.createElement("li", null, "The first cat will run in the direction the player is facing while the second cat will run in the opposite direction and after reaching the edge of the screen, will turn around and travel across the screen again"), /*#__PURE__*/React.createElement("li", null, "Once a cat attacks the opponent it will no longer have a hitbox"), /*#__PURE__*/React.createElement("li", null, "All cats cause hard knockdown"), /*#__PURE__*/React.createElement("li", null, "The cats that travel both directions have one hitbox per direction"), /*#__PURE__*/React.createElement("li", null, "The travel pattern of the third and fourth cats are the same as the first two")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Miyuki"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Miyuki attacks with Floral Rock "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Miyuki attacks with Freezing Zone "), /*#__PURE__*/React.createElement("li", null, "LLENN can move a total of four times before she jumps out and attacks"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "j.6S"), /*#__PURE__*/React.createElement("p", null, "Miyuki attacks with Gungnir "), /*#__PURE__*/React.createElement("li", null, "Can only be used during Trump state, Double Support Ignition, or from a Support Cancel while in the air")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Pai"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Pai rushes at the opponent with a flurry of attacks"), /*#__PURE__*/React.createElement("li", null, "There are four hits total and the fourth hit blows the opponent away, or wallbounces in the corner"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Pai lunges at the opponent and attacks with an upward kick ")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Rusian"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Russian appears in front of the player and slams his shield at the opponent after a short delay"), /*#__PURE__*/React.createElement("li", null, "Guard point from 10-40F"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Rusian is chased by a grouup of goblins across the screen from behind the player, running towards the opponent. If Rusian reaches the end of the screen, he runs back to the player chased by a group of bigger orcs(?) at a much faster pace"), /*#__PURE__*/React.createElement("li", null, "If the opponent hits Rusian enough on the first chase, he will be picked up by the goblins and the second half doesn't occur"), /*#__PURE__*/React.createElement("li", null, "The first chase will hit once and cause a small bounce on hit and block"), /*#__PURE__*/React.createElement("li", null, "The second chase will cause a very high knockup on hit and block")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Ryuuji"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Ryuuji appears behind the player and throws a lunchbox that floats in the air and travels once in each direction across the screen. Ryuuji throws 3 types of lunchboxes in a preset order: White Lunchbox, Blue Lunchbox, and Triple Lunchbox. Not picking up lunchboxes alters the effect of the next lunchbox that is picked up. The effects of each lunchbox:"), /*#__PURE__*/React.createElement("li", null, "White Lunchbox - Gives the player one bar of meter"), /*#__PURE__*/React.createElement("li", null, "Blue Lunchbox - Gives 2% white health (10% when White Lunchbox is skipped)"), /*#__PURE__*/React.createElement("li", null, "Triple Lunchbox - Gives 4% white health (15% when both White and Blue Lunchboxes are skipped)", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "If the White Lunchbox is skipped and the next two are taken afterwards, it gives 20% white health"), /*#__PURE__*/React.createElement("li", null, "Opponents can also pick up the lunchboxes."))), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Appears behind the player and travels across screen, then turns around and attacks the opponent "), /*#__PURE__*/React.createElement("li", null, "If Ryuuji is hit with a projectile before turning around he will instead attack immediately"), /*#__PURE__*/React.createElement("li", null, "Startup is variable and he does not attack until he reaches the other end of the screen")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Sadao"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Sadao lunges forward and punches the opponent "), /*#__PURE__*/React.createElement("li", null, "In order to use Sadao's Devil attacks, he must hit the opponent once, or be blocked twice. The next time he is called he will use the Devil version attack. A cut-in of Sadao will appear and his voice will change when his next attack is the Devil version. "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "5S (Devil Form)"), /*#__PURE__*/React.createElement("p", null, "Sadao appears directly above the opponent and fires a barrage of lasers at him "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Same attack as 5S except it travels about twice as far "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S (Devil Form)"), /*#__PURE__*/React.createElement("p", null, "Sadao appears in front of the player and swings his sword that releases lasers from the ground "), /*#__PURE__*/React.createElement("li", null, "Travels across the screen then returns toward the player")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Tatsuya"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Tatsuya appears in front of the player and holds out two CADs. If the opponent attacks Tatsuya he becomes immobilized for a few seconds"), /*#__PURE__*/React.createElement("li", null, "During this time the opponent can only block, throw tech (cannot initiate a throw), or Escape Blast"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Tatsuya uses his Sliver Horns to hold the opponent in place "), /*#__PURE__*/React.createElement("li", null, "The attack does no damage"), /*#__PURE__*/React.createElement("p", null, "(Only in Ignition) On successful hit (even on block), empowers the next Climax Art. ")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Touma"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Touma will appear in front of your character, holding his right hand out in a counter stance. If an attack hits his hand, it will negate the rest of the attack's follow-ups (like multi-hit attacks) and emit an short-range unblockable explosion. "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "Because the counter explosion is unblockable, it cannot be safe-jumped like many other counters in this game. Touma does appear rather ahead of your character, leaving space for the opponent to attack you directly without triggering the counter. "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Touma will lunge out and punch the opponent. If it hits the opponent's face cleanly, it will blow them away horizontally. Otherwise, it will only do half damage and ground-bounce them. All in all, not a great move for combos or poking, compared to other assists. "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, "Has a special interaction with Accelerator's 5S counter, where using the punch against the counter will not activate the counterattack. ")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Tomo"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Fire arrow horizontally "), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "5[S]"), /*#__PURE__*/React.createElement("p", null, "Fire charged up arrow horizontally. Launches on hit"), /*#__PURE__*/React.createElement("li", null, "Longer startup compared to 5S"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Fire arrow upward at an angle "), /*#__PURE__*/React.createElement("li", null, "Can hit standing opponent, but only if close up"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6[S]"), /*#__PURE__*/React.createElement("p", null, "Fire charged arrow upward at an angle. Launches on hit "), /*#__PURE__*/React.createElement("li", null, "Can hit standing opponent, but only if close up"), /*#__PURE__*/React.createElement("li", null, "Longer startup compared to 6S"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "41236S"), /*#__PURE__*/React.createElement("p", null, "Fire super charged arrow upward at an angle for 2 meter"), /*#__PURE__*/React.createElement("li", null, "Enhance damage by pressing S during super flash at the cost of 1 meter. Can enhance up to 3 times (for a total of 5 meter spent)"), /*#__PURE__*/React.createElement("li", null, "Can hit standing opponent, but only if close up")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Uiharu"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Uiharu uses her laptop to coordinate an attack against the opponent "), /*#__PURE__*/React.createElement("li", null, "A reticle appears over the opponent then attacks shortly afterwards"), /*#__PURE__*/React.createElement("li", null, "After the initial attack, Uiharu assists the player with 3 additional sequential attacks"), /*#__PURE__*/React.createElement("li", null, "If a Climax Arts is used, it will cancel out the remaining attacks"), /*#__PURE__*/React.createElement("li", null, "The activation requirements for the follow up attacks are selected at random and include the following:", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Denoted by the clock symbol, activates automatically after about 5 seconds"), /*#__PURE__*/React.createElement("li", null, "Denoted by the V looking symbol, activates when the opponent is knocked down (does not activate against air teching)"), /*#__PURE__*/React.createElement("li", null, "Denoted by the explosion symbol, activates when the player attacks the opponent 2~3 times (regardless of hit or block)"))), /*#__PURE__*/React.createElement("li", null, "Aside the timed attack, you have about 20 seconds to activate the follow up attack before Uiharu disappears"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Uiharu appears in front of the player standing around absentmindedly "), /*#__PURE__*/React.createElement("li", null, "This move increases the overall length of both Power Blast, Trump Card state, potential, and also recovers about 4% of the player's health.", /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "The first use during any of these increases length by approximately four seconds. The second use increases length by approximately two seconds. Every use after that increases by approximately one second. "), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "For example, let's say Kuroko is in potential and uses Uiharu 6S. This increases the length of her potential by four seonds. Let's say she uses 6S again before the potential runs out. The length will then increase by another two seconds, for a total increase of 6 seconds. Let's say potential runs out, and then Kuroko activates potential again. Because this is a separate instance of potential, if the player uses 6S now it will once again extend potential by four second.")), /*#__PURE__*/React.createElement("li", null, "The amount of time Uiharu is on screen appears to be proportional to the increase. However, no testing has been done to see if it is linear. Also, no testing has been done to see if Uiharu getting hit out of 6S affect subsequent uses.")))), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Wilhelmina"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Wilhelmina appears above the player and attacks the opponent with bandages"), /*#__PURE__*/React.createElement("li", null, "Tracks the opponent, however there is a limit on the range and will not reach more than 3/4th of the screen"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "After a short delay, Wilhelmina expands her bandages across the screen and cocoons the opponent "), /*#__PURE__*/React.createElement("li", null, "Just like 5S this attack tracks the opponent, but it will also reach full screen")), /*#__PURE__*/React.createElement("div", {
  id: "aInfo",
  value: "Zero"
}, /*#__PURE__*/React.createElement("h2", null, "5S"), /*#__PURE__*/React.createElement("p", null, "Parry attack, then blowback opponent into wallbounce "), /*#__PURE__*/React.createElement("li", null, "Allows for easy followup combos"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "6S"), /*#__PURE__*/React.createElement("p", null, "Summon vines that travel horizontally fullscreen. Launches opponent on hit "), /*#__PURE__*/React.createElement("li", null, "Doesn't seem to really hit airborn opponents"), /*#__PURE__*/React.createElement("li", null, "Very small amount of active frames; not good Oki"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h2", null, "S"), /*#__PURE__*/React.createElement("p", null, "Knock attacking opponent away from you. Dead angle attack "), /*#__PURE__*/React.createElement("li", null, "Can only be used during blockstun at the cost of 2 meter"))]; //#endregion
"use strict";

// https://stackoverflow.com/questions/32704027/how-to-call-bootstrap-alert-with-jquery
var handleError = function handleError(message) {
  $("#dangerAlert").text(message);
  $("#dangerAlert").show();
  $("#dangerAlert").addClass('in');
  $("#dangerAlert").delay(2000).fadeOut('slow');
  return false;
};

var handleSuccess = function handleSuccess(message) {
  $("#successAlert").text(message);
  $("#successAlert").show();
  $("#successAlert").addClass('in');
  $("#successAlert").delay(2000).fadeOut('slow');
  return false;
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      alert(messageObj.error);
    }
  });
};
