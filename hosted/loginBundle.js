"use strict";

var videoIndex = 0;
var videoMax = 300;
var queryString;
var pagedVideos; // Sending request to handle login

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("ERROR | Username or Password is empty");
    return false;
  }

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
}; // Sending request to handle signing up


var handleSignup = function handleSignup(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("ERROR | All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("ERROR | Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
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
}; // Render our login window


var LoginWindow = function LoginWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    className: "mainForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST"
  }, /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit btn",
    type: "submit",
    value: "Sign In"
  }));
}; // Render our signup window


var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit btn",
    type: "submit",
    value: "Sign Up"
  }));
}; //#region Home Video Code


var VideoList = function VideoList(props) {
  pagedVideos = [];

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
    return /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, video.player1), /*#__PURE__*/React.createElement("td", null, assistImg1), /*#__PURE__*/React.createElement("td", null, charImg1), /*#__PURE__*/React.createElement("td", null, "vs"), /*#__PURE__*/React.createElement("td", null, charImg2), /*#__PURE__*/React.createElement("td", null, assistImg2), /*#__PURE__*/React.createElement("td", null, video.player2), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
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
  }

  return /*#__PURE__*/React.createElement("div", {
    id: "pageContainer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    className: "table table-sm"
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

var Load = function Load() {
  return /*#__PURE__*/React.createElement("div", {
    className: "videoList"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "emptyVideo"
  }, "Loading videos from the database..."));
}; ///
/// Functions to render our data on the page depending on what we need ///
///


var loadAllVideosFromServer = function loadAllVideosFromServer() {
  sendAjax('GET', '/getAllVideos', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(VideoList, {
      videos: data.videos
    }), document.querySelector("#content"));
    document.querySelector("#nextButton").style.display = "block";
    document.querySelector("#nextButtonSearch").style.display = "none";
    videoMax = 300;
    var next = document.querySelector("#nextButton");
    next.addEventListener("click", function (e) {
      videoMax += 100;
      console.log(pagedVideos[videoMax - 2]);

      if (pagedVideos[videoMax - 2] === undefined) {
        handleError("ERROR | No more videos!");
        videoMax -= 100;
        return;
      }

      ReactDOM.render( /*#__PURE__*/React.createElement(VideoList, {
        videos: data.videos
      }), document.querySelector("#content"));
    });
  });
}; //#endregion


var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
  ReactDOM.unmountComponentAtNode(document.querySelector("#search"));
};

var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
  ReactDOM.unmountComponentAtNode(document.querySelector("#search"));
};

var createSearchForm = function createSearchForm() {
  ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, null), document.querySelector("#search")); // If theh game changes, re-render

  $('#searchForm').find('select').on('change', function () {
    ReactDOM.render( /*#__PURE__*/React.createElement(SearchForm, null), document.querySelector("#search"));
    document.querySelector("#nextButton").style.display = "none";

    if (queryString != '') {
      var next = document.querySelector("#nextButtonSearch");
      next.style.display = "block";
      videoMax = 300;
      next.addEventListener("click", function (e) {
        videoMax += 100;

        if (pagedVideos[videoMax - 2] === undefined) {
          handleError("ERROR | No more videos!");
          videoMax -= 100;
          return;
        }

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

var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");
  var homeButton = document.querySelector("#home");
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  homeButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSearchForm();
    loadAllVideosFromServer();
    return false;
  });
  createSearchForm();
  createLoad();
  loadAllVideosFromServer(); //Default window
  //Default loads all Videos on the server 
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
}); //#region Character Forms
//Separated the character forms for ease of reference and readability in above code

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
