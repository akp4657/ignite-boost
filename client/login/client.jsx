let videoIndex = 0;
let videoMax = 350;
let queryString;
let pagedVideos;

// Sending request to handle login
const handleLogin = (e) => {
    e.preventDefault();


    if($("#user").val() == '' || $("#pass").val() == '') {
        handleError("ERROR | Username or Password is empty");
        return false;
    }

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
    return false;
};

// Sending request to handle signing up
const handleSignup = (e) => {
    e.preventDefault();
    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() =='') {
        handleError("ERROR | All fields are required");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()) {
        handleError("ERROR | Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

//Sets the values of the players and game to null, then triggers a change to remove the char selects from the form
const handleReset = (e) => {
    e.preventDefault();

    $("#player1Search").val("");
    $("#player2Search").val("");
    $("#gameSearch").val("").prop('selected', true).trigger("change");

    return false;
} 

// Handles the search. Will check for each value in the inputs for the search form to see if they exist.
// If they exist put them into the query string them send it to the server with the GET command
const handleSearch = (player) => {
    //e.preventDefault();
    queryString = `${$('#searchForm').attr('action')}?`;

    // Check if the player is a string. It'll default to an object if it doesn't exist
    // If it is, search for this specific player in DFC:I matches
    if(typeof player === 'string' || player instanceof String) {
        queryString += `player1=${player}`
        queryString += `&version=${2}`
    } else {
        // Check each search field to see if anything is in them. If there is data in them, add it to the querystring
        if($("#player1Search").val()){
            queryString += `player1=${$("#player1Search").val()}`
        }
        if($("#player2Search").val()){
            queryString += `&player2=${$("#player2Search").val()}`
        }
        if($("#char1Search").find(":selected").text() !== 'Character 1' &&
        $("#char1Search").find(":selected").text() !== 'Anyone'){
            queryString += `&char1=${$("#char1Search").find(":selected").text()}`
        }   
        if($("#char2Search").find(":selected").text() !== 'Character 2' &&
        $("#char2Search").find(":selected").text() !== 'Anyone'){
            queryString += `&char2=${$("#char2Search").find(":selected").text()}`
        }
        if($("#assist1Search").find(":selected").text() !== 'Assist 1' &&
        $("#assist1Search").find(":selected").text() !== 'Anyone'){
            queryString += `&assist1=${$("#assist1Search").find(":selected").text()}`
        }   
        if($("#assist2Search").find(":selected").text() !== 'Assist 2' &&
        $("#assist2Search").find(":selected").text() !== 'Anyone'){
            queryString += `&assist2=${$("#assist2Search").find(":selected").text()}`
        }
        if($("#gameSec").val() && $("#gameSec").val() != 'Any'){
            queryString += `&version=${$("#gameSec").val()}`
        }
    } 

    sendAjax('GET', queryString , null, (data) =>{
        ReactDOM.render(
            <VideoList videos={data.videos} />, document.querySelector("#content")
        );
    });
};

const handleCharacterData = () => {
   // console.log('handling data')

    let characterQuery = `${$('#dataForm').attr('action')}?`;
    
    if($("#charDataSearch").val() != 'undefined') {
        characterQuery += `character=${$("#charDataSearch").val()}`
    }

   // console.log(characterQuery)

    sendAjax('GET', characterQuery, null, (data) =>{
       // console.log('sent query')
        ReactDOM.render(
            <CharacterData character={data.character} />, document.querySelector("#content")
        );
    })
}

// Search form
//Sets up the search form
const SearchForm = () => {

    // Obsolete, but uncomment just in case
    /*let charSelection = char1Search;
    let char2Selection = char2Search;
    let assist1Selection = assist1Search;
    let assist2Selection = assist2Search;*/
    const gameSelection = <select id = "gameSec" className = 'form-control'>
    <option value="undefined" disabled selected hidden>Vers.</option><option value="Any">Any</option>
    <option value="2">DFC:I</option><option value="1">DFC</option>
    </select>;

    let char1Select = $("#char1Search").find(":selected").val()
    let char2Select = $("#char2Search").find(":selected").val()
    let assist1Select = $("#assist1Search").find(":selected").val()
    let assist2Select = $("#assist2Search").find(":selected").val()
    let versionSelect = $("#gameSec").find(":selected").val()

    let char1Src = `/assets/img/Characters/${char1Select}.png`
    let char2Src = `/assets/img/Characters/${char2Select}.png`
    let assist1Src = `/assets/img/Assists/${assist1Select}.png`
    let assist2Src = `/assets/img/Assists/${assist2Select}.png`
    let gameSrc = `/assets/img/Version/${versionSelect}.png`

    return(
        <form
            id="searchForm"
            onChange={handleSearch}
            onReset={handleReset}
            name="searchForm"
            action="/search"
            method="GET"
            className="searchForm form-inline"
        >
            <div id="searchFormDiv">
            <table id="searchFormTable" className="table table-sm">
                    <tbody>
                        <tr>
                            <td><img id="char1Img" src={char1Src} alt={char1Select}/></td>
                            <td><img id="assist1Img" src={assist1Src} alt={assist1Select}/></td>
                        </tr>
                        <tr>
                            <td>{char1Search}</td>
                            <td>{assist1Search}</td>
                            <td><input className="form-control" id="player1Search" type="text" name="player1" placeholder="Player 1"/></td>
                        </tr>
                        <tr>
                            <td><img id="char2Img" src={char2Src} alt={char2Select}/></td>
                            <td><img id="assist2Img" src={assist2Src} alt={assist2Select}/></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>{char2Search}</td>
                            <td>{assist2Search}</td>
                            <td><input className="form-control" id="player2Search" type="text" name="player2" placeholder="Player 2"/></td>
                        </tr>
                    </tbody>
                </table>
                <div id="divTable">
                    <table id = "gameSelectTable" className = "table table-sm">
                        <tr>
                            <td><img id="versionImgSearch" src={gameSrc} alt={versionSelect}/></td>
                        </tr>
                        <tr>
                        <td>
                            {gameSelection}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </form>
    )
};

const PlayerSearchForm = () => {

    return(
        <form
            id="searchForm"
            onChange={handleSearch}
            onReset={handleReset}
            name="searchForm"
            action="/search"
            method="GET"
            className="searchForm form-inline"
        >
          <table id="searchFormTable" className="table table-sm">
                <tbody>
                    <tr>
                        <td><input className="form-control" id="player1Search" type="text" name="player1" placeholder="Player 1"/></td>
                    </tr>
                    <tr>
                        vs
                    </tr>
                    <tr>
                        <td><input className="form-control" id="player2Search" type="text" name="player2" placeholder="Player 2"/></td>
                    </tr>
                </tbody>
            </table>
        </form>
    )
};

// Render our login window
const LoginWindow = (props) => {
    return ( 
    <form   id="loginForm"
            className="mainForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
        >
        <input id="user" type="text" name="username" placeholder="username"/>
        <br></br>
        <br></br>
        <input id="pass" type="password" name="pass" placeholder="password"/>
        <br></br>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit btn" type="submit" value="Sign In"/>

    </form>
    );
};

// Render our signup window
const SignupWindow = (props) => {
    return ( 
    <form id="signupForm" name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
        <input id="user" type="text" name="username" placeholder="username"/>
        <br></br>
        <br></br>
        <input id="pass" type="password" name="pass" placeholder="password"/>
        <br></br>
        <br></br>
        <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
        <br></br>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit btn" type="submit" value="Sign Up"/>

    </form>
    );
};

//#region Home Video Code
const VideoList = function(props) {
    pagedVideos = [];

    if(props.videos.length === 0) {
        return (
            <div className="videoList">
                <h3 className="emptyVideo">No videos found!</h3>
            </div>
        );
    }

    const videoNodes = props.videos.map(function(video) {
        let char1Src;
        let char2Src;
        let assist1Src;
        let assist2Src;
        let versionSrc;

        let charImg1;
        let charImg2;
        let assistImg1;
        let assistImg2;
        let versionImg;

        char1Src = `/assets/img/Characters/${video.char1}.png`;
        char2Src = `/assets/img/Characters/${video.char2}.png`;
        assist1Src = `/assets/img/Assists/${video.assist1}.png`;
        assist2Src = `/assets/img/Assists/${video.assist2}.png`;
        versionSrc = `/assets/img/Version/${video.version}.png`;

        charImg1 = <img id="char1Img" src={char1Src} alt={video.char1} />
        charImg2 = <img id="char2Img" src={char2Src} alt={video.char2} />
        assistImg1 = <img id="assist1Img" src={assist1Src} alt={video.assist1} />
        assistImg2 = <img id="assist2Img" src={assist2Src} alt={video.assist2} />
        versionImg = <img id="versionImg" height= "50px" width="50px"src={versionSrc} alt={video.version} />

        
        return (
                <tbody>
                    <tr>
                        <td id='tdP1'>{video.player1}</td>
                        <td>{assistImg1}</td>
                        <td>{charImg1}</td>
                        <td>{charImg2}</td>
                        <td>{assistImg2}</td>
                        <td id='tdP2'>{video.player2}</td>
                        <td>
                            <a href={video.link} className="icons-sm yt-ic" target="_blank"><i className="fab fa-youtube fa-2x"> </i></a>
                        </td>
                        <td>{versionImg}</td>
                        <td>{video.matchDate}</td>
                    </tr>
                </tbody>

            
        );
    });
    //console.log(videoNodes.length);
    for(videoIndex; videoIndex < videoMax; videoIndex++) {
        pagedVideos[videoIndex] = videoNodes[videoIndex]; 

        if(videoIndex === videoMax-1) {
            videoIndex = 0;
            break;
        }
    }
    return (
        <div id="pageContainer">
            <div className="table-responsive">
                <table id="videoListTable" className="table table-sm table-dark">
                    {pagedVideos}
                </table>
            </div>
            <button id="nextButton" className="formSubmit btn secondBtn"type="button">View More</button>
        </div>
    );
};

    //#region Home Video Code
const CharacterData = function(props) {

    const characterNodes = props.character.map(function(character) {
        let moveText;

        if(character.move) {
            moveText = <h1 id="moveDiv">{character.move}</h1>
        }
        return (
                <tbody>
                    <tr>
                        <td id="moveRow"><div id="moveDivContainer">{moveText}</div></td>
                        <td><div id="ignition">{character.startup}</div></td>
                        <td><div id="ignition">{character.active}</div></td>
                        <td><div id="ignition">{character.frameAdv}</div></td>
                    </tr>
                </tbody>
        );
    });

    return (
        <div id="charDataContainer">
            <div className="table-responsive">
                <table className="table table-sm" id ='characterDataTable'>
                    {characterNodes}
                </table>
            </div>
        </div>
    );
};

//Sets up the search form
const DataSearchForm = () => {
    return(
        <form
            id="dataForm"
            onChange={handleCharacterData}
            name="dataSearchForm"
            action="/getData"
            method="GET"
            className="searchForm form-inline"
        >
          <table id="dataFormTable" className="table table-sm">
                <tbody>
                    <tr>
                        <td>{charDataSearch}</td>
                    </tr>
                </tbody>
            </table>
        </form>
    )
};

const CharacterDataImage = () => {
    let charSelect = $("#charDataSearch").find(":selected").val()

    let charSrc = `/assets/img/characterSprites/${charSelect}.png`

    return (
        <div id ="characterDataDiv">
            <img id="characterData" src={charSrc} alt={charSelect} />
        </div>
    )
}


const Load = () => {
    return (<div className="videoList">
                <h3 className="emptyVideo">Loading videos from the database...</h3>
             </div>)
};

const SiteDown = () => {
    return (
        <div className ='videoList'>
            <h1>Site Down...</h1>
            <img id='iriyaDownImg' src = '/assets/img/iriyaDown.JPG'></img>
        </div>
    )
};

const AssistInfo = () => {
    let selected = $("#assistInfoSelect").find(":selected").text();
    let assistSrc = `/assets/img/assistSprites/${selected}.png`;
    let info;

    // At the bottom of the file, there's an array of HTML objects, each correlating to the 
    // character. Find the one we want and put it here
    assistInfo.forEach(a => {
        if(a.props.value === selected) {
            info = a;
            return;
        }

        console.dir(info)
    })

    return (
        <div>
            <div className = 'infoList'>
                {assistInfoSelect}
                <img id="assistInfoImg" src={assistSrc} alt={selected} />
            </div>
            <div className = 'textList' id='textInfo'>
                <h1>{info}</h1>
            </div>
        </div>
    )
};

const GifBack = () => {
    return (
        <img id="gifs" src="/assets/img/background.gif"/>
    )
};


///
/// Functions to render our data on the page depending on what we need ///
///
const loadAllVideosFromServer = () => {
    sendAjax('GET', '/getAllVideos', null, (data) => {
        ReactDOM.render(
            <VideoList videos={data.videos} />, document.querySelector("#content")
        );
        videoMax = 300; 
        const next = document.querySelector("#nextButton");
        /*const reportButton = document.querySelector("#reportButton")
        reportButton.addEventListener("click", (e) => {
            handleReport(e)
        })*/
        next.addEventListener("click", (e) => {
            //console.log(pagedVideos[videoMax-2]);
                if(pagedVideos[videoMax-1] === undefined) {
                    handleError("ERROR | No more videos!");
                    return;
                }
            videoMax += 100;
            ReactDOM.render(
                <VideoList videos={data.videos} />, document.querySelector("#content")
        );
        });
    });
};
//#endregion

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );

    ReactDOM.unmountComponentAtNode(document.querySelector("#search"));
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );

    ReactDOM.unmountComponentAtNode(document.querySelector("#search"));
};

const createSearchForm = () => {
    ReactDOM.render(
        <SearchForm />, document.querySelector("#search")  
    );

    // If something changes, re-render
    $('#searchForm').find('select').on('change', function() {
        ReactDOM.render(
            <SearchForm />,
            document.querySelector("#search")
        );
    });

    if(queryString != undefined)
    {
        //console.log('query string isnot empty: ' + queryString)
        const next = document.querySelector("#nextButton");
        videoMax = 300;
        next.addEventListener("click", (e) => {
            //console.log(pagedVideos[0])
            if(pagedVideos[videoMax-1] === undefined) {
                handleError("ERROR | No more videos!");
                return;
            }
            videoMax += 100;
            sendAjax('GET', queryString , null, (data) =>{
                ReactDOM.render(
                    <VideoList videos={data.videos} />, document.querySelector("#content")
                );
            });
        });
    }
}

const createPlayerSearchForm = () => {
    ReactDOM.render(
        <PlayerSearchForm />, document.querySelector("#searchontent")  
    );


    if(queryString != undefined)
    {
        //console.log('query string isnot empty: ' + queryString)
        const next = document.querySelector("#nextButton");
        videoMax = 300;
        next.addEventListener("click", (e) => {
            //console.log(pagedVideos[0])
            if(pagedVideos[videoMax-1] === undefined) {
                handleError("ERROR | No more videos!");
                return;
            }
            videoMax += 100;
            sendAjax('GET', queryString , null, (data) =>{
                ReactDOM.render(
                    <VideoList videos={data.videos} />, document.querySelector("#content")
                );
            });
        });
    }
}

const createDataForm = () => {
    ReactDOM.unmountComponentAtNode(document.querySelector("#content"));
    ReactDOM.unmountComponentAtNode(document.querySelector("#info"));
    ReactDOM.unmountComponentAtNode(document.querySelector("#secondary"));
    
    ReactDOM.render(
        <DataSearchForm />, document.querySelector("#search")
    )

    $("#dataForm").find('select').on('change', function() {
        ReactDOM.render(
            <DataSearchForm />, document.querySelector("#search")
        )
        ReactDOM.render(
            <CharacterDataImage />, 
            document.querySelector('#info')
        )
    })
}

const createLoad = () => {
    ReactDOM.render(
        <Load />, document.querySelector("#content")
    );
}

const createSiteDown = () => {
    ReactDOM.render(
        <SiteDown />,
        document.querySelector('#secondary')
    )
}

const createGifs = () => {
    ReactDOM.render(
        <GifBack />,
        document.querySelector("#secondary")
    );
}

const createAssistSelect = () => {
    ReactDOM.render(
        <AssistInfo />,
        document.querySelector("#info")
    );

    $('#info').find('select').on('change', function() {
        ReactDOM.render(
            <AssistInfo />,
            document.querySelector("#info")
        );
    });
}


const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");
    const homeButton = document.querySelector("#home");
    const reportButton = document.querySelector('#reportButton');
    const reportSubmit = document.querySelector('#reportSubmit');
    const dataButton = document.querySelector('#dataButton');

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf); //Uncomment on site up 
        createGifs();
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf); //Uncomment on site up
        createGifs();
        return false;
    });

    reportButton.addEventListener("click", (e) => {
        e.preventDefault();
        var report = prompt('Please be as detailed as possible with your report')
        sendAjax('POST', "/sendReport", {report: report, _csrf: csrf}, true);
        return false;
    });

    dataButton.addEventListener("click", (e) => {
        e.preventDefault();
        createDataForm();
        return false;
    })

    homeButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSearchForm(); // Uncomment on site up
        createAssistSelect();
        //createPlayerSearchForm();
        loadAllVideosFromServer(); // Uncomment on site up
        return false;
    });

    createSearchForm();
    createLoad();
    createAssistSelect();

    // Player links
    if(window.location.pathname != '/') {
        //console.log('true')
        let player = /[^/]*$/.exec(window.location.pathname)[0]
        console.log(player)
        handleSearch(player);
    }
    else {
        //console.log('false')
     //   createPlayerSearchForm();
        loadAllVideosFromServer() //Default window Uncomment all on sit up
    }

};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});

//#region Character Forms
//Separated the character forms for ease of reference and readability in above code
const char1Search = <select id = "char1Search" className='form-control'>
    <option value="undefined" disabled selected hidden>Character 1</option><option value="Anyone">Anyone</option>
    <option value="Akira">Akira</option><option value="Ako">Ako</option>
    <option value="Asuna">Asuna</option><option value="Emi">Emi</option><option value="Kirino">Kirino</option>
    <option value="Kirito">Kirito</option><option value="Kuroko">Kuroko</option><option value="Kuroyukihime">Kuroyukihime</option>
    <option value="Mikoto">Mikoto</option><option value="Miyuki">Miyuki</option>
    <option value="Quenser">Quenser</option><option value="Rentaro">Rentaro</option><option value="Selvaria">Selvaria</option>
    <option value="Shana">Shana</option><option value="Shizuo">Shizuo</option><option value="Taiga">Taiga</option>
    <option value="Tatsuya">Tatsuya</option><option value="Tomoka">Tomoka</option><option value="Yukina">Yukina</option>
    <option value="Yuuki">Yuuki</option>
    </select>;

const assist1Search = <select id = "assist1Search" className='form-control'>
    <option value="undefined" disabled selected hidden>Assist 1</option><option value="Anyone">Anyone</option>
    <option value="Accelerator">Accelerator</option><option value="Alicia">Alicia</option>
    <option value="Boogiepop">Boogiepop</option><option value="Celty">Celty</option><option value="Dokuro">Dokuro</option>
    <option value="Enju">Enju</option><option value="Erio">Erio</option><option value="Froleytia">Froleytia</option>
    <option value="Haruyuki">Haruyuki</option><option value="Holo">Holo</option><option value="Innocent Charm">Innocent Charm</option>
    <option value="Iriya">Iriya</option><option value="Izaya">Izaya</option><option value="Kino">Kino</option>
    <option value="Kojou">Kojou</option><option value="Kouko">Kouko</option><option value="Kuroneko">Kuroneko</option>
    <option value="Leafa">Leafa</option><option value="LLENN">LLENN</option><option value="Mashiro">Mashiro</option>
    <option value="Miyuki">Miyuki</option><option value="Pai">Pai</option><option value="Rusian">Rusian</option>
    <option value="Ryuuji">Ryuuji</option><option value="Sadao">Sadao</option><option value="Tatsuya">Tatsuya</option>
    <option value="Touma">Touma</option><option value="Tomo">Tomo</option><option value="Uiharu">Uiharu</option>
    <option value="Wilhelmina">Wilhelmina</option><option value="Zero">Zero</option>
    </select>;

const char2Search= <select id = "char2Search" className='form-control'>
    <option value="undefined" disabled selected hidden>Character 2</option><option value="Anyone">Anyone</option>
    <option value="Akira">Akira</option><option value="Ako">Ako</option>
    <option value="Asuna">Asuna</option><option value="Emi">Emi</option><option value="Kirino">Kirino</option>
    <option value="Kirito">Kirito</option><option value="Kuroko">Kuroko</option><option value="Kuroyukihime">Kuroyukihime</option>
    <option value="Mikoto">Mikoto</option><option value="Miyuki">Miyuki</option>
    <option value="Quenser">Quenser</option><option value="Rentaro">Rentaro</option><option value="Selvaria">Selvaria</option>
    <option value="Shana">Shana</option><option value="Shizuo">Shizuo</option><option value="Taiga">Taiga</option>
    <option value="Tatsuya">Tatsuya</option><option value="Tomoka">Tomoka</option><option value="Yukina">Yukina</option>
    <option value="Yuuki">Yuuki</option>
    </select>;

const assist2Search = <select id = "assist2Search" className='form-control'>
    <option value="undefined" disabled selected hidden>Assist 2</option><option value="Anyone">Anyone</option>
    <option value="Accelerator">Accelerator</option><option value="Alicia">Alicia</option>
    <option value="Boogiepop">Boogiepop</option><option value="Celty">Celty</option><option value="Dokuro">Dokuro</option>
    <option value="Enju">Enju</option><option value="Erio">Erio</option><option value="Froleytia">Froleytia</option>
    <option value="Haruyuki">Haruyuki</option><option value="Holo">Holo</option><option value="Innocent Charm">Innocent Charm</option>
    <option value="Iriya">Iriya</option><option value="Izaya">Izaya</option><option value="Kino">Kino</option>
    <option value="Kojou">Kojou</option><option value="Kouko">Kouko</option><option value="Kuroneko">Kuroneko</option>
    <option value="Leafa">Leafa</option><option value="LLENN">LLENN</option><option value="Mashiro">Mashiro</option>
    <option value="Miyuki">Miyuki</option><option value="Pai">Pai</option><option value="Rusian">Rusian</option>
    <option value="Ryuuji">Ryuuji</option><option value="Sadao">Sadao</option><option value="Tatsuya">Tatsuya</option>
    <option value="Touma">Touma</option><option value="Tomo">Tomo</option><option value="Uiharu">Uiharu</option>
    <option value="Wilhelmina">Wilhelmina</option><option value="Zero">Zero</option>
    </select>;

const assistInfoSelect = <select id = "assistInfoSelect" className='form-control'>
    <option value="" disabled selected hidden>Assist Information</option>
    <option value="Accelerator">Accelerator</option><option value="Alicia">Alicia</option>
    <option value="Boogiepop">Boogiepop</option><option value="Celty">Celty</option><option value="Dokuro">Dokuro</option>
    <option value="Enju">Enju</option><option value="Erio">Erio</option><option value="Froleytia">Froleytia</option>
    <option value="Haruyuki">Haruyuki</option><option value="Holo">Holo</option><option value="Innocent Charm">Innocent Charm</option>
    <option value="Iriya">Iriya</option><option value="Izaya">Izaya</option><option value="Kino">Kino</option>
    <option value="Kojou">Kojou</option><option value="Kouko">Kouko</option><option value="Kuroneko">Kuroneko</option>
    <option value="Leafa">Leafa</option><option value="LLENN">LLENN</option><option value="Mashiro">Mashiro</option>
    <option value="Miyuki">Miyuki</option><option value="Pai">Pai</option><option value="Rusian">Rusian</option>
    <option value="Ryuuji">Ryuuji</option><option value="Sadao">Sadao</option><option value="Tatsuya">Tatsuya</option>
    <option value="Touma">Touma</option><option value="Tomo">Tomo</option><option value="Uiharu">Uiharu</option>
    <option value="Wilhelmina">Wilhelmina</option><option value="Zero">Zero</option>
    </select>;

const charDataSearch = <select id = "charDataSearch" className='form-control'>
    <option value="undefined" disabled selected hidden>Character</option>
    <option value="Akira">Akira</option><option value="Ako">Ako</option>
    <option value="Asuna">Asuna</option><option value="Emi">Emi</option><option value="Kirino">Kirino</option>
    <option value="Kirito">Kirito</option><option value="Kuroko">Kuroko</option><option value="Kuroyukihime">Kuroyukihime</option>
    <option value="Mikoto">Mikoto</option><option value="Miyuki">Miyuki</option>
    <option value="Quenser">Quenser</option><option value="Rentaro">Rentaro</option><option value="Selvaria">Selvaria</option>
    <option value="Shana">Shana</option><option value="Shizuo">Shizuo</option><option value="Taiga">Taiga</option>
    <option value="Tatsuya">Tatsuya</option><option value="Tomoka">Tomoka</option><option value="Yukina">Yukina</option>
    <option value="Yuuki">Yuuki</option>
    </select>;

const assistInfo = [
    <div id = 'aInfo' value ='Accelerator'>
        <h2>5S</h2>
        <p>Last Order wanders onto the stage for several seconds and if she is attacked, Accelerator will appear and attack the opponent, blowing them away on hit </p>
        <li>The startup on the counter is slow enough that fast attacks like Kino 5S can interrupt it if the opponent is looking for it</li>
        <li>If the opponent is hit while Last Order is out, the counter will be negated</li>
        <li>The counter-attack is not instant and can be blocked if triggered from a jump in or a low recovery move</li>
        <li>The counter-attack is full screen and has a ton of blockstun, letting you approach the opponent if blocked</li>
        <li>Has a special interaction with the Touma support, where Accelerator's counter will not activate if triggered by Touma's 6S</li>
        <br></br>
        <h2>6S</h2>
        <p>Accelerator stomps the ground and sends a ground wave across the stage that bounces the opponent up and down</p>
        <li>There is enough time to dash up while the opponent is being bounced to continue the combo. What you can do depends on how close you are initially</li>
        <li>Does not hit against airborne opponents</li>
    </div>,
    <div id = 'aInfo' value ='Alicia'>
        <h2>5S</h2>
        <p>Alicia throws a grenade that explodes when it touches the ground, launching the opponent</p>
        <li>The grenade itself does not have a hitbox, only the explosion</li>
        <li>The grenade has enough delay for you to run up and perform a quick mixup, if close enough</li>
        <br></br>
        <h2>6S</h2>
        <p>Alicia poses in front of the player and after a short delay, she transforms into Valkyria mode and teleports towards the opponent and attacks with a multi hitting move that launches the opponent </p>
        <li>As soon as Alicia's hair fully turns blue, she cannot be interrupted, even if the opponent hits you</li>
    </div>,
    <div id = 'aInfo' value ='Boogiepop'>
        <h2>5S</h2>
        <p>Boogiepop appears in front of the player and uses a ranged attack</p>
        <li>Launches on hit</li>
        <li>Only hits a specific area, can whiff if too close or too far away</li>
        <br></br>
        <h2>6S</h2>
        <p>Boogiepop appears in front of the player for a long amount of time as a flute plays. Afterwards they turn around, the screen goes dark, then they attack the entire screen. </p>
        <li>Launches on hit</li>
        <li>Hits full screen and is air unblockable</li>
        <li>Deals 500 damage and 1500 white damage when blocked</li>
        <li>During the startup you gain 65% of a bar of meter</li>
    </div>,
    <div id = 'aInfo' value ='Celty'>
        <h2>5S</h2>
        <p>Celty will ride across the screen on a motorcycle and slash at the opponent as she passes by. </p>
        <br></br>
        <h2>6S</h2>
        <p>Celty will fall from the air on her motorcycle and ride back the direction she came from as she lands. Launches high on hit for easy combo confirms.</p>
    </div>,
    <div id = 'aInfo' value ='Dokuro'>
        <h2>5S</h2>
        <p>Dokuro falls from the top of the screen with her mace </p>
        <li>Hits about 2 characters spaces in front the player and covers the entire vertical space because of its quick speed</li>
        <br></br>
        <h2>5[S]</h2>
        <p>Dokuro throws her mace and knocks your own character into the air and wall bounces into another hard knockdown</p>
        <li>Only available when you are knocked down at the cost of 3 meter</li>
        <li>This hit inflicts around 1500 white damage to yourself</li>
        <li>Afterwards she spins her mace around that hits multiple times </li>
        <br></br>
        <h2>6S</h2>
        <p>Dokuro throws her mace extremely fast across the screen at an upward angle</p>
        <li>Launches on hit</li>
        <li>Because of the angle, this move will whiff against crouching opponents from full screen</li>
        <li>Will generally cause hard knockdown on hit, even with substantial combo proration before it</li>
    </div>,
    <div id = 'aInfo' value ='Enju'>
        <h2>5S</h2>
        <p>Enju appears from the top corner of the screen behind the player and divekicks the opponent, targeting the location the opponent was at during the startup. Launches the opponent on hit.</p>
        <li>If Enju lands a clean hit on the opponent, the screen will zoom in and award bonus damage, and Enju will attack a second time, knocking the opponent down to ground level.</li>
        <li>If Enju lands an off-center hit on the opponent, the screen will not zoom in.</li>
        <br></br>
        <h2>5[S]</h2>
        <p>Enju appears and applies a mark on the opponent that lasts for about 10 seconds and does one of the following:</p>
        <li>If the opponent calls his assist while the mark is active, Enju kicks the assist away and negates it</li>
        <li>If the opponent is hit Enju will attack just like 5S, however there is no follow up attack</li>
        <br></br>
        <h2>6S</h2>
        <p>Enju appears directly in front of the player and launches the opponent</p>
        <li>If Enju lands this move while the opponent is still on their feet (?), the screen will zoom in and award full damage. Otherwise, the move will do substantially reduced damage.</li>
    </div>,
    <div id = 'aInfo' value ='Erio'>
        <h2>5S</h2>
        <p>Erio runs from behind you to 2/3s of the screen away and covers herself in a futon, hopping towards the opponent. As she hops around, any opponent attack hitbox that touches her will be nullified and treated as a 
        whiffed move that can't be canceled out of, allowing you to "whiff punish" moves that would have hit you normally. Any player attack hitbox that touches her will not change, but will force Erio to hop slightly in that direction. </p>
        <li>Erio will continue to hop around until either: 
            <ul>
                <li>The player hits Erio 3 times in total</li>
                <li>The opponent hits Erio at least 1 time and Erio has hopped 3 times in total</li>
                <li>Erio has hopped 20 times</li>
            </ul>
        </li>
        <li>Erio does start this move 2/3s of the screen away, and takes a long time to become active, so this move is mainly for offensive oki pressure. It is very unsuitable if you are being cornered by the opponent, unlike many other counter assists.</li>
        <br></br>
        <h2>6S</h2>
        <p>Erio runs in from behind your character and slides across the floor to the other side of the screen. She will then run in from that other side, after which you can hit her again to 
        repeat the sliding attack. Erio can slide 3 times in total per assist call. </p>
        <li>Once Erio starts her first slide, she cannot be interrupted by the opponent for that slide and all subsequent run-slides.</li>
        <li>If the player does not hit Erio while running in the second time, she will continue off screen, ending her assist call without a third run-by.</li>
    </div>,
    <div id = 'aInfo' value ='Froleytia'>
        <h2>5S</h2>
        <p>Froleytia appears behind the player and supports them with cover fire aimed at the ground around and in front of the player </p>
        <li>The animation of the diagonal cover fire has no hitbox, the attack is only the ground effect</li>
        <br></br>
        <h2>6S</h2>
        <p>Froleytia appears in front of the player and after a brief moment she supports him with with a barrage of missiles</p>
        <li>The missiles will track the opponent wherever they are on screen, with seemingly no height limit</li>
        <li>Froleytia is vulnerable for the entire move, including while her missiles are firing. Given that fact and how she stands out in the open, 
            this assist is not very suited as neutral tool, and should be used for combos and wakeup setups instead.</li>
    </div>,
    <div id = 'aInfo' value ='Haruyuki'>
        <h2>5S</h2>
        <p>Haruyuki applies a marker on the opponent, and after a short delay he divekicks the opponent and flies away.</p>
        <li>The second hit launches the opponent for an easy combo confirm.</li>
        <br></br>
        <h2>5[S]</h2>
        <p>Haruyuki applies a marker on the opponent, and once the opponent is hit Haruyuki will automatically attack like in his 5S. If the opponent is not hit within 10 seconds, Haruyuki will cancel his attack.</p>
        <li>Does not have the ability to negate the opponent's assist like Enju.</li>
        <br></br>
        <h2>6S</h2>
        <p>Haruyuki appears in front of the player, and fires a charged arrow horizontally across the screen. Wallbounces on hit, giving ample time to run up and extend a combo or land a Power Blast. </p>
    </div>,
    <div id = 'aInfo' value ='Holo'>
        <h2>5S</h2>
        <p>Holo slashes the opponent with her large claw, launching the opponent on hit</p>
        <li>The opponent can tech out of the air on the way down, so going straight to an air combo might be needed depending on the starter</li>
        <br></br>
        <h2>6S</h2>
        <p>Holo hops forward and summons a small field of wheat for 2.5 seconds</p>
        <li>Holo's initial hop can hit the opponent, which can lead into a hard knockdown into OTG, or be extended into a longer combo. It is recommended to choose an 
        option that let's your character remain in the field, otherwise you should use 5S for damage.</li>
        <li>Once Holo creates the field of wheat, she can no longer be hit</li>
        <li>When the field of wheat is summoned for the first time in a round, the player will receive the following buffs: 
            <ul>
                <li>Status Up Level 1 (6% attack up and 6% defense up) for 10 seconds, as soon as you enter the field</li>
                <li>Regeneration of up to 15% health and 15% white health for a total of 30%, depending on how long you were on the field</li>
                <li>Regeneration of up to 80% of one bar of meter, depending on how long you were on the field</li>
            </ul>
        </li>
        <li>On subsequent summonings in the same round, the health and meter regeneration are drastically reduced.</li>
        <li>As long as your horizontal position is over the field, it will count for "being on the field", even if you are jumping.</li>
        <li>Blocking attacks within the field will deny your health and meter regeneration.</li>
    </div>,
    <div id = 'aInfo' value ='Innocent Charm'>
        <h2>5S</h2>
        <p>Hina comes out a small distance in front of the player and sparkles fly around her while slowly pulling the opponent towards her. While the sparkles are visible, 
        Hina can block one hit from any hitbox, releasing bubbles as a counter. These bubbles put the opponent in hitstop, are only one hit, and can be blocked. The counter can be safe-jumped. </p>
        <br></br>
        <h2>6S</h2>
        <p>Hina flies further than 5S distance and has bubbles come out immediately while also pulling the opponent toward her. These bubbles are only one hit and can be blocked. If not blocked, it puts the opponent in hitstop. </p>
    </div>,
    <div id = 'aInfo' value ='Iriya'>
        <h2>5S</h2>
        <p>Iriya appears in front of the player and eats a bowl of food</p>
        <li>Once the bowl of food is eaten a food icon will appear and up to 3 icons can be stored 
            <ul>
                <li>The player can hit the bowl to knock it towards the opponent. Hitting it with an A normal will arc it toward the opponent's position. 
                    Hitting it with a B or C normal will send it up off the screen, and will drop directly over the opponent's position after a second passes.</li>
            </ul>
        </li>
        <li>Once 2 food icons are collected, the player receives Status Up Lv. 1 for 10 seconds</li>
        <li>Once 3 food icons are collected, the player receives Status Up Lv. 3 for 10 seconds, and a row of air-unblockable explosions go off. The number of food icons will reset to 0.</li>
        <li>Iriya can be hit by the opponent to deny the food buffs if done early enough in her animation. If too slow, the opponent can at least deny the plate projectile.</li>
        <br></br>
        <h2>6S</h2>
        <p>Iriya appears behind the opponent and hits them with her scooter, launching the opponent horizontally on hit. </p>
        <li>Useful as a full-screen poke, or as a combo extension</li>
    </div>,
    <div id = 'aInfo' value ='Izaya'>
        <h2>5S</h2>
        <p>Izaya appears in front of the player holding his hands up, and if he is hit he teleports behind the opponent and slashes him multiple times, launching them vertically on hit</p>
        <li>The counter is not instant and can be blocked if triggered from a jump in or a low recovery move</li>
        <li>If the move is Support Cancelled, he automatically does the follow up attack instead</li>
        <li>2nd startup value is when he is Support Cancelled</li>
        <br></br>
        <h2>6S</h2>
        <p>Izaya trips the opponent with his foot then stomps on 3 times before kicking 1 more time.</p>
        <li>Has fairly quick startup and the hitbox is deceptively large</li>
        <li>Normally the opponent is in OTG state, but Trump Cards and Climax Arts will connect, but only before the 4th kick.</li>
    </div>,
    <div id = 'aInfo' value ='Kino'>
        <h2>5S</h2>
        <p>Shoots horizontally. Fast start-up, bullet moves fast, fast recovery. Low damage.</p>
        <li>Startup is based off when used at the closest possible distance</li>
        <br></br>
        <h2>6S</h2>
        <p>Charges a little and then shoots diagonally upwards. Slow start-up and launches upwards on hit, normally leading to a hard knockdown. </p>
    </div>,
    <div id = 'aInfo' value ='Kojou'>
        <h2>5S</h2>
        <p>Summons Regulus Aurum which attacks the opponent with a homing lightning strike, which scatters across the ground </p>
        <li>Has fairly long startup, but lasts for a long while</li>
        <br></br>
        <h2>6S</h2>
        <p>Summons Al-Nasl-Minium which attacks the enemy with crimson light </p>
        <li>Has quicker startup compared to 5S and floats the opponent on hit</li>
    </div>,
    <div id = 'aInfo' value ='Kouko'>
        <h2>5S</h2>
        <p>Throws a bouquet of flowers upwards then blows a kiss afterwards that leaves a status effect that drains the opponents meter and gives you meter </p>
        <li>You will continue to get meter even if the opponent has none</li>
        <li>Only hits against opponents that are either in hitstun or are airborne</li>
        <li>On hit the kiss will always connect and on block or whiff the kiss mark will slowly track the opponent and is unblockable</li>
        <br></br>
        <h2>5[S]</h2>
        <p>Appears behind the opponent and walks towards them, attacks exactly like 5S </p>
        <br></br>
        <h2>6S</h2>
        <p>Appears behind the player at the edge of the screen and walks towards the opponent. When she reaches the opponent, she hits them multiple times with a bouquet, blows a kiss, then walks away in the same direction she came from </p>
        <li>The status effect is the same as 5S</li>
        <li>Startup is variable and does not activate until she reaches the opponent, or in the case of an airborne opponent she will attack the opponent's last grounded position</li>
    </div>,
    <div id = 'aInfo' value ='Kuroneko'>
        <h2>5S</h2>
        <p>Kuroneko summons rose petals and scatters them towards the opponent, 13 hits in total. </p>
        <br></br>
        <p>If Kamineko activates, this will have faster startup and will send 22 petals across a longer period of time. </p>
        <br></br>
        <h2>6S</h2>
        <p>Kuroneko places a magic circle on your character. Once any attack touches your character, on block or hit, the magic circle will activate and attack anything within the range of the circle, 
            including the player. The activation can be blocked by both players. </p>
        <br></br>
        <p>If Kamineko activates, the magic circle activation will not harm your character. </p>
    </div>,
    <div id = 'aInfo' value ='Leafa'>
        <h2>5S</h2>
        <p>Leafa will set out a large gust of wind across the screen that tracks the opponent. On hit will knock up. </p>
        <br></br>
        <h2>6S</h2>
        <p>Leafa will fly to the middle of the screen and do a quick dash homed at the opponent </p>
    </div>,
    <div id = 'aInfo' value ='LLENN'>
        <h2>5S</h2>
        <p>LLENN appears in a proximity sensitive case then jumps out and shoots the opponent </p>
        <li>LLENN will jump out of the case when either the opponent comes into proximity or a set amount of time passes</li>
        <li>Unlike a regular projectile, the range on LLENN's attack is fairly short</li>
        <li>It is possible for the player to hit the case to move it forward, and LLENN will immediately attack afterwards 
            <ul>
                <li>The case gains a hitbox when it is hit</li>
                <li>The distance the case moves is dependent on the attack, A attacks will move it slightly while B and C attacks will move it further</li>
            </ul>
        </li>
        <br></br>
        <h2>5[S]</h2>
        <p>Same attack as 5S, however the case will hop forward every couple of seconds </p>
        <li>LLENN can move a total of four times before she jumps out and attacks</li>
        <br></br>
        <h2>6S</h2>
        <p>LLENN appears from behind the player and runs directly in front of the opponent and shoots him </p>
        <li>The attack has the same properties as 5S</li>
    </div>,
    <div id = 'aInfo' value ='Mashiro'>
        <h2>5S</h2>
        <p>Mashiro summons baumkuchen that roll across the screen </p>
        <li>Can hit up to 5 times and the last hit launches and causes hard knockdown</li>
        <br></br>
        <h2>6S</h2>
        <p>Mashiro summons four cats that run across the screen </p>
        <li>The first cat will run in the direction the player is facing while the second cat will run in the opposite direction 
            and after reaching the edge of the screen, will turn around and travel across the screen again</li>
        <li>Once a cat attacks the opponent it will no longer have a hitbox</li>
        <li>All cats cause hard knockdown</li>
        <li>The cats that travel both directions have one hitbox per direction</li>
        <li>The travel pattern of the third and fourth cats are the same as the first two</li>
    </div>,
    <div id = 'aInfo' value ='Miyuki'>
        <h2>5S</h2>
        <p>Miyuki attacks with Floral Rock </p>
        <br></br>
        <h2>6S</h2>
        <p>Miyuki attacks with Freezing Zone </p>
        <li>LLENN can move a total of four times before she jumps out and attacks</li>
        <br></br>
        <h2>j.6S</h2>
        <p>Miyuki attacks with Gungnir </p>
        <li>Can only be used during Trump state, Double Support Ignition, or from a Support Cancel while in the air</li>
    </div>,
    <div id = 'aInfo' value ='Pai'>
        <h2>5S</h2>
        <p>Pai rushes at the opponent with a flurry of attacks</p>
        <li>There are four hits total and the fourth hit blows the opponent away, or wallbounces in the corner</li>
        <br></br>
        <h2>6S</h2>
        <p>Pai lunges at the opponent and attacks with an upward kick </p>
    </div>,
    <div id = 'aInfo' value ='Rusian'>
        <h2>5S</h2>
        <p>Russian appears in front of the player and slams his shield at the opponent after a short delay</p>
        <li>Guard point from 10-40F</li>
        <br></br>
        <h2>6S</h2>
        <p>Rusian is chased by a grouup of goblins across the screen from behind the player, running towards the opponent. If Rusian reaches the end of the screen, 
            he runs back to the player chased by a group of bigger orcs(?) at a much faster pace</p>
        <li>If the opponent hits Rusian enough on the first chase, he will be picked up by the goblins and the second half doesn't occur</li>
        <li>The first chase will hit once and cause a small bounce on hit and block</li>
        <li>The second chase will cause a very high knockup on hit and block</li>
    </div>,
    <div id = 'aInfo' value ='Ryuuji'>
        <h2>5S</h2>
        <p>Ryuuji appears behind the player and throws a lunchbox that floats in the air and travels once in each direction across the screen. Ryuuji throws 3 types of lunchboxes in a 
            preset order: White Lunchbox, Blue Lunchbox, and Triple Lunchbox. Not picking up lunchboxes alters the effect of the next lunchbox that is picked up. The effects of each lunchbox:</p>
        <li>White Lunchbox - Gives the player one bar of meter</li>
        <li>Blue Lunchbox - Gives 2% white health (10% when White Lunchbox is skipped)</li>
        <li>Triple Lunchbox - Gives 4% white health (15% when both White and Blue Lunchboxes are skipped) 
            <ul>
                <li>If the White Lunchbox is skipped and the next two are taken afterwards, it gives 20% white health</li>
                <li>Opponents can also pick up the lunchboxes.</li>
            </ul>
        </li>
        <br></br>
        <h2>6S</h2>
        <p>Appears behind the player and travels across screen, then turns around and attacks the opponent </p>
        <li>If Ryuuji is hit with a projectile before turning around he will instead attack immediately</li>
        <li>Startup is variable and he does not attack until he reaches the other end of the screen</li>
    </div>,
    <div id = 'aInfo' value ='Sadao'>
        <h2>5S</h2>
        <p>Sadao lunges forward and punches the opponent </p>
        <li>In order to use Sadao's Devil attacks, he must hit the opponent once, or be blocked twice. 
            The next time he is called he will use the Devil version attack. A cut-in of Sadao will appear and his voice will change when his next attack is the Devil version. </li>
        <br></br>
        <h2>5S (Devil Form)</h2>
        <p>Sadao appears directly above the opponent and fires a barrage of lasers at him </p>
        <br></br>
        <h2>6S</h2>
        <p>Same attack as 5S except it travels about twice as far </p>
        <br></br>
        <h2>6S (Devil Form)</h2>
        <p>Sadao appears in front of the player and swings his sword that releases lasers from the ground </p>
        <li>Travels across the screen then returns toward the player</li>
    </div>,
    <div id = 'aInfo' value ='Tatsuya'>
        <h2>5S</h2>
        <p>Tatsuya appears in front of the player and holds out two CADs. If the opponent attacks Tatsuya he becomes immobilized for a few seconds</p>
        <li>During this time the opponent can only block, throw tech (cannot initiate a throw), or Escape Blast</li>
        <br></br>
        <h2>6S</h2>
        <p>Tatsuya uses his Sliver Horns to hold the opponent in place </p>
        <li>The attack does no damage</li>
        <p>(Only in Ignition) On successful hit (even on block), empowers the next Climax Art. </p>
    </div>,
    <div id = 'aInfo' value ='Touma'>
        <h2>5S</h2>
        <p>Touma will appear in front of your character, holding his right hand out in a counter stance. If an attack hits his hand, it will negate the rest of the attack's 
            follow-ups (like multi-hit attacks) and emit an short-range unblockable explosion. </p>
        <br></br>
        <p>Because the counter explosion is unblockable, it cannot be safe-jumped like many other counters in this game. Touma does appear rather ahead of your character, 
            leaving space for the opponent to attack you directly without triggering the counter. </p>
        <br></br>
        <h2>6S</h2>
        <p>Touma will lunge out and punch the opponent. If it hits the opponent's face cleanly, it will blow them away horizontally. 
            Otherwise, it will only do half damage and ground-bounce them. All in all, not a great move for combos or poking, compared to other assists. </p>
        <br></br>
        <p>Has a special interaction with Accelerator's 5S counter, where using the punch against the counter will not activate the counterattack. </p>
    </div>,
    <div id = 'aInfo' value ='Tomo'>
        <h2>5S</h2>
        <p>Fire arrow horizontally </p>
        <br></br>
        <h2>5[S]</h2>
        <p>Fire charged up arrow horizontally. Launches on hit</p>
        <li>Longer startup compared to 5S</li>
        <br></br>
        <h2>6S</h2>
        <p>Fire arrow upward at an angle </p>
        <li>Can hit standing opponent, but only if close up</li>
        <br></br>
        <h2>6[S]</h2>
        <p>Fire charged arrow upward at an angle. Launches on hit </p>
        <li>Can hit standing opponent, but only if close up</li>
        <li>Longer startup compared to 6S</li>
        <br></br>
        <h2>41236S</h2>
        <p>Fire super charged arrow upward at an angle for 2 meter</p>
        <li>Enhance damage by pressing S during super flash at the cost of 1 meter. Can enhance up to 3 times (for a total of 5 meter spent)</li>
        <li>Can hit standing opponent, but only if close up</li>
    </div>,
    <div id = 'aInfo' value ='Uiharu'>
        <h2>5S</h2>
        <p>Uiharu uses her laptop to coordinate an attack against the opponent </p>
        <li>A reticle appears over the opponent then attacks shortly afterwards</li>
        <li>After the initial attack, Uiharu assists the player with 3 additional sequential attacks</li>
        <li>If a Climax Arts is used, it will cancel out the remaining attacks</li>
        <li>The activation requirements for the follow up attacks are selected at random and include the following: 
            <ul>
                <li>Denoted by the clock symbol, activates automatically after about 5 seconds</li>
                <li>Denoted by the V looking symbol, activates when the opponent is knocked down (does not activate against air teching)</li>
                <li>Denoted by the explosion symbol, activates when the player attacks the opponent 2~3 times (regardless of hit or block)</li>
            </ul>
        </li>
        <li>Aside the timed attack, you have about 20 seconds to activate the follow up attack before Uiharu disappears</li>
        <br></br>
        <h2>6S</h2>
        <p>Uiharu appears in front of the player standing around absentmindedly </p>
        <li>This move increases the overall length of both Power Blast, Trump Card state, potential, and also recovers about 4% of the player's health.  
            <ul>
                <li>The first use during any of these increases length by approximately four seconds. The second use increases length by approximately two seconds. Every use after that increases by approximately one second. </li>
                <ul>
                    <li>For example, let's say Kuroko is in potential and uses Uiharu 6S. This increases the length of her potential by four seonds. Let's say she uses 6S again before the potential runs out. 
                        The length will then increase by another two seconds, 
                        for a total increase of 6 seconds. Let's say potential runs out, and then Kuroko activates potential again. 
                        Because this is a separate instance of potential, if the player uses 6S now it will once again extend potential by four second.
                    </li>
                </ul>
                <li>The amount of time Uiharu is on screen appears to be proportional to the increase. However, no testing has been done to see if it is linear. Also, no testing has been done to see if 
                    Uiharu getting hit out of 6S affect subsequent uses.</li>
            </ul>
        </li>
    </div>,
    <div id = 'aInfo' value ='Wilhelmina'>
        <h2>5S</h2>
        <p>Wilhelmina appears above the player and attacks the opponent with bandages</p>
        <li>Tracks the opponent, however there is a limit on the range and will not reach more than 3/4th of the screen</li>
        <br></br>
        <h2>6S</h2>
        <p>After a short delay, Wilhelmina expands her bandages across the screen and cocoons the opponent </p>
        <li>Just like 5S this attack tracks the opponent, but it will also reach full screen</li>
    </div>,
    <div id = 'aInfo' value ='Zero'>
        <h2>5S</h2>
        <p>Parry attack, then blowback opponent into wallbounce </p>
        <li>Allows for easy followup combos</li>
        <br></br>
        <h2>6S</h2>
        <p>Summon vines that travel horizontally fullscreen. Launches opponent on hit </p>
        <li>Doesn't seem to really hit airborn opponents</li>
        <li>Very small amount of active frames; not good Oki</li>
        <br></br>
        <h2>S</h2>
        <p>Knock attacking opponent away from you. Dead angle attack </p>
        <li>Can only be used during blockstun at the cost of 2 meter</li>
    </div>,
]
//#endregion