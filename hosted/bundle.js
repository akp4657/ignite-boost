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
  });

  if ($("#timeStamp").val() == '' || $("#playerOne").val() == '' || $("#playerTwo").val() == '' || $("#videoLink").val() == '') {
    handleError("ERROR | All fields are required");
    return false;
  } // Check if the error uses the correct link *just copying the url


  if (!$("#videoLink").val().includes('www.youtube.com')) {
    handleError("ERROR | Please use a valid YouTube link");
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
      videoKey++;
      modValue = -1;
    }

    modValue++;
  }); // Set the new video key to the loop number for the next loop

  videoKey = loopNumber; // For character selection

  $('#videoForm').find('select').each(function () {
    // One of the selections is for the game, we don't need that
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

  sendAjax('POST', $("#videoForm").attr("action"), videoObj, function () {
    loadAllVideosFromServer();
  });
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
    handleError("ERROR | All fields are required");
    return false;
  }

  if ($("#pass").val() === $("#pass2").val()) {
    handleError("ERROR | Passwords cannot match");
    return false;
  }

  if ($("#pass2").val() !== $("#pass3").val()) {
    handleError("ERROR | The new passwords do not match");
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


var handleSearch = function handleSearch(e) {
  e.preventDefault();
  queryString = "".concat($('#searchForm').attr('action'), "?"); // Check each search field to see if anything is in them. If there is data in them, add it to the querystring

  if ($("#player1Search").val()) {
    queryString += "player1=".concat($("#player1Search").val());
  }

  if ($("#player2Search").val()) {
    queryString += "&player2=".concat($("#player2Search").val());
  }

  if ($("#char1Search").find(":selected").text() !== 'Character 1' && $("#char1Search").find(":selected").text() !== 'Anyone') {
    queryString += "&char1=".concat($("#char1Search").find(":selected").text());
  }

  if ($("#char2Search").find(":selected").text() !== 'Character 2' && $("#char2Search").find(":selected").text() !== 'Anyone') {
    queryString += "&char2=".concat($("#char2Search").find(":selected").text());
  }

  if ($("#assist1Search").find(":selected").text() !== 'Assist 1' && $("#assist1Search").find(":selected").text() !== 'Anyone') {
    queryString += "&assist1=".concat($("#assist1Search").find(":selected").text());
  }

  if ($("#assist2Search").find(":selected").text() !== 'Assist 2' && $("#assist2Search").find(":selected").text() !== 'Anyone') {
    queryString += "&assist2=".concat($("#assist2Search").find(":selected").text());
  }

  if ($("#gameSec").val() && $("#gameSec").val() != 'Any') {
    queryString += "&version=".concat($("#gameSec").val());
  }

  sendAjax('GET', queryString, null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(VideoList, {
      videos: data.videos
    }), document.querySelector("#content"));
  });
}; // Search form
//Sets up the search form, will change the select for characters depending on the game selected


var SearchForm = function SearchForm() {
  var charSelection = char1Search;
  var char2Selection = char2Search;
  var assist1Selection = assist1Search;
  var assist2Selection = assist2Search;
  var gameSelection = /*#__PURE__*/React.createElement("select", {
    id: "gameSec",
    className: "form-control"
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true,
    selected: true,
    hidden: true
  }, "Version"), /*#__PURE__*/React.createElement("option", {
    value: "Any"
  }, "Any"), /*#__PURE__*/React.createElement("option", {
    value: "2"
  }, "DFC:I"), /*#__PURE__*/React.createElement("option", {
    value: "1"
  }, "DFC"));
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
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "player1Search",
    type: "text",
    name: "player1",
    placeholder: "Player 1"
  })), /*#__PURE__*/React.createElement("td", null, assist1Selection), /*#__PURE__*/React.createElement("td", null, charSelection), /*#__PURE__*/React.createElement("td", {
    id: "vs"
  }, "vs"), /*#__PURE__*/React.createElement("td", null, char2Selection), /*#__PURE__*/React.createElement("td", null, assist2Selection), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "player2Search",
    type: "text",
    name: "player2",
    placeholder: "Player 2"
  })), /*#__PURE__*/React.createElement("td", null, gameSelection)))));
}; /// FORM TO SUBMIT NEW DATA


var VideoForm = function VideoForm(props) {
  var _React$createElement;

  // Rows to dynamically add more matches
  // https://stackoverflow.com/questions/22876978/loop-inside-react-jsx
  var rows = [];
  var charSelection = char1Select;
  var char2Selection = char2Select;
  var assist1Selection = assist1Select;
  var assist2Selection = assist2Select;

  for (var i = 0; i < loopNumber; i++) {
    rows.push( /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      id: "timestamp",
      type: "text",
      name: "timestamp",
      placeholder: "00:00:00"
    })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
      id: "playerOne",
      type: "text",
      name: "playerOne",
      placeholder: "Player 1"
    })), /*#__PURE__*/React.createElement("td", null, assist1Selection), /*#__PURE__*/React.createElement("td", null, charSelection), /*#__PURE__*/React.createElement("td", {
      id: "vs"
    }, "vs"), /*#__PURE__*/React.createElement("td", null, char2Selection), /*#__PURE__*/React.createElement("td", null, assist2Selection), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("input", {
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
  }, "Version"), /*#__PURE__*/React.createElement("option", {
    value: "2"
  }, "DFC:I"), /*#__PURE__*/React.createElement("option", {
    value: "1"
  }, "DFC")), /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    id: "videoFormTable",
    className: "table table-sm table-dark"
  }, rows)), /*#__PURE__*/React.createElement("input", (_React$createElement = {
    className: "makeVideoSubmit"
  }, _defineProperty(_React$createElement, "className", "formSubmit btn mainBtn"), _defineProperty(_React$createElement, "type", "submit"), _defineProperty(_React$createElement, "value", "Add Video"), _React$createElement)), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("button", {
    id: "addMatchButton",
    className: "formSubmit btn secondBtn",
    type: "button"
  }, "Add a Match"), /*#__PURE__*/React.createElement("button", {
    id: "removeMatchButton",
    className: "formSubmit btn thirdBtn",
    type: "button"
  }, "Remove a Match")), /*#__PURE__*/React.createElement("div", {
    id: "adSpace"
  }));
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
    className: "form-control",
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "old password"
  }), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("input", {
    className: "form-control",
    id: "pass3",
    type: "password",
    name: "pass3",
    placeholder: "re-type password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit btn",
    type: "submit",
    value: "Change"
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
    var versionImg;
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
      id: "name"
    }, video.player1), /*#__PURE__*/React.createElement("td", null, assistImg1), /*#__PURE__*/React.createElement("td", null, charImg1), /*#__PURE__*/React.createElement("td", null, "vs"), /*#__PURE__*/React.createElement("td", null, charImg2), /*#__PURE__*/React.createElement("td", null, assistImg2), /*#__PURE__*/React.createElement("td", null, video.player2), /*#__PURE__*/React.createElement("td", {
      id: "name2"
    }, /*#__PURE__*/React.createElement("a", {
      href: video.link,
      className: "icons-sm yt-ic",
      target: "_blank"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fab fa-youtube fa-2x"
    }, " "))), /*#__PURE__*/React.createElement("td", null, versionImg)));
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
    className: "table table-sm table-dark"
  }, pagedVideos)), /*#__PURE__*/React.createElement("button", {
    id: "nextButton",
    className: "formSubmit btn secondBtn",
    type: "button"
  }, "View More"), /*#__PURE__*/React.createElement("button", {
    id: "nextButtonSearch",
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
    document.querySelector("#nextButton").style.display = "block";
    document.querySelector("#nextButtonSearch").style.display = "none";
    videoMax = 300;
    var next = document.querySelector("#nextButton");
    next.addEventListener("click", function (e) {
      console.log(pagedVideos);

      if (pagedVideos[videoMax - 2] === undefined) {
        handleError("ERROR | No more videos!");
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
  loopNumber = 1;
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangeWindow, {
    csrf: csrf
  }), document.querySelector("#content")); // Unmount the search bar

  ReactDOM.unmountComponentAtNode(document.querySelector("#search"));
};

var createAddWindow = function createAddWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(VideoForm, {
    csrf: csrf
  }), document.querySelector("#content"));
  ReactDOM.unmountComponentAtNode(document.querySelector("#search"));
  var removeMatchButton = document.querySelector("#removeMatchButton");
  removeMatchButton.addEventListener("click", function (e) {
    if (loopNumber !== 1) {
      loopNumber--; //If it's clicked, just re-render

      ReactDOM.render( /*#__PURE__*/React.createElement(VideoForm, {
        csrf: csrf
      }), document.querySelector("#content"));
    } else {
      handleError("ERROR | Cannot remove last match");
    }
  }); // Get the button that was made in the videoForm

  var addMatchButton = document.querySelector("#addMatchButton");
  addMatchButton.addEventListener("click", function (e) {
    loopNumber++; //If it's clicked, just re-render

    ReactDOM.render( /*#__PURE__*/React.createElement(VideoForm, {
      csrf: csrf
    }), document.querySelector("#content"));
  });
};

var createSearchForm = function createSearchForm() {
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, null), document.querySelector("#search")); // If the game changes, re-render

  $('#searchForm').find('select').on('change', function () {
    ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, null), document.querySelector("#search"));
    document.querySelector("#nextButton").style.display = "none";

    if (queryString != '') {
      var next = document.querySelector("#nextButtonSearch");
      next.style.display = "block";
      videoMax = 300;
      next.addEventListener("click", function (e) {
        if (pagedVideos[videoMax - 2] === undefined) {
          handleError("ERROR | No more videos!");
          return;
        }

        videoMax += 100;
        sendAjax('GET', queryString, null, function (data) {
          ReactDOM.render( /*#__PURE__*/React.createElement(VideoList, {
            videos: data.videos
          }), document.querySelector("#content"));
        });
      });
    } else {
      var _next = document.querySelector("#nextButtonSearch");

      _next.style.display = "none";
    }
  });
};

var createLoad = function createLoad() {
  ReactDOM.render( /*#__PURE__*/React.createElement(Load, null), document.querySelector("#content"));
};

var createSiteDown = function createSiteDown() {
  ReactDOM.render( /*#__PURE__*/React.createElement(SiteDown, null), document.querySelector('#content'));
};

var setup = function setup(csrf) {
  var homeButton = document.querySelector("#home"); //const pageButton = document.querySelector("#myPage");

  var addButton = document.querySelector("#addVideo");
  var passChangeButton = document.querySelector("#passChangeButton");
  passChangeButton.addEventListener("click", function (e) {
    e.preventDefault();
    createPassChangeWindow(csrf); //Uncomment on site up

    return false;
  });
  addButton.addEventListener("click", function (e) {
    e.preventDefault();
    createAddWindow(csrf); //Uncomment on site up

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
  loadAllVideosFromServer(); //createSiteDown();
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
  id: "char1"
}, /*#__PURE__*/React.createElement("option", {
  value: "Akira",
  selected: true
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
  id: "assist1"
}, /*#__PURE__*/React.createElement("option", {
  value: "Accelerator",
  selected: true
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
  id: "char2"
}, /*#__PURE__*/React.createElement("option", {
  value: "Akira",
  selected: true
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
  id: "assist2"
}, /*#__PURE__*/React.createElement("option", {
  value: "Accelerator",
  selected: true
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
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Character 1"), /*#__PURE__*/React.createElement("option", {
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
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Assist 1"), /*#__PURE__*/React.createElement("option", {
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
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Character 2"), /*#__PURE__*/React.createElement("option", {
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
  value: "",
  disabled: true,
  selected: true,
  hidden: true
}, "Assist 2"), /*#__PURE__*/React.createElement("option", {
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
}, "Zero")); //#endregion
"use strict";

// https://stackoverflow.com/questions/32704027/how-to-call-bootstrap-alert-with-jquery
var handleError = function handleError(message) {
  $(".alert").text(message);
  $(".alert").show();
  $(".alert").addClass('in');
  $(".alert").delay(2000).fadeOut('slow');
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
      handleError(messageObj.error);
    }
  });
};
