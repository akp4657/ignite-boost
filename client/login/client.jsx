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
const handleSearch = (e) => {
    e.preventDefault();

    queryString = `${$('#searchForm').attr('action')}?`;

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

    sendAjax('GET', queryString , null, (data) =>{
        ReactDOM.render(
            <VideoList videos={data.videos} />, document.querySelector("#content")
        );
    });
};

// On the shelf for handling URLs
/*const handleURL = (e) => {
    e.preventDefault();

    queryString = "Segawa"

    sendAjax('GET', queryString , null, (data) =>{
        ReactDOM.render(
            <VideoList videos={data.videos} />, document.querySelector("#content")
        );
    });
};*/

const handleReport = (e) => {
    e.preventDefault();

    if($("#report").val() == '') {
        handleError("ERROR | Report cannot be empty");
        return false;
    }

    sendAjax('POST', $("#reportForm").attr("action"), $("#reportForm").serialize(), redirect);

    return false;

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
    <option value="" disabled selected hidden>Version</option><option value="Any">Any</option>
    <option value="2">DFC:I</option><option value="1">DFC</option>
    </select>;

    let char1Select = $("#char1Search").find(":selected").text()
    let char2Select = $("#char2Search").find(":selected").text()
    let assist1Select = $("#assist1Search").find(":selected").text()
    let assist2Select = $("#assist2Search").find(":selected").text()
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
          <table id="searchFormTable" className="table table-sm">
                <tbody>
                    <tr>
                        <td><img id="assist1Img" src={assist1Src} alt={assist1Select}/></td>
                        <td><img id="char1Img" src={char1Src} alt={char1Select}/></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>{assist1Search}</td>
                        <td>{char1Search}</td>
                        <td><input className="form-control" id="player1Search" type="text" name="player1" placeholder="Player 1"/></td>
                    </tr>
                    <tr>
                        <td><img id="assist2Img" src={assist2Src} alt={assist2Select}/></td>
                        <td><img id="char2Img" src={char2Src} alt={char2Select}/></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>{assist2Search}</td>
                        <td>{char2Search}</td>
                        <td><input className="form-control" id="player2Search" type="text" name="player2" placeholder="Player 2"/></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td><img id="versionImgSearch" src={gameSrc} alt={versionSelect}/>{gameSelection}</td>
                        <td></td>
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

// Render the report window
const ReportWindow = (props) => {
    return ( 
    <form id="reportForm" name="reportForm"
            onSubmit={handleReport}
            action="/sendReport"
            method="POST"
            className="searchForm"
        >
        <textarea rows="3" cols="60" id="report" type="text" name="report" placeholder="Please be as detailed as possible. If this pertains to a match, please include the link and/or names of the players"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input id="reportSubmit" className="formSubmit btn" type="submit" value="Submit"/>

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
                        <td>{video.player1}</td>
                        <td>{assistImg1}</td>
                        <td>{charImg1}</td>
                        <td>{charImg2}</td>
                        <td>{assistImg2}</td>
                        <td>{video.player2}</td>
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
                <table className="table table-sm">
                    {pagedVideos}
                </table>
            </div>
            <button id="nextButton" className="formSubmit btn secondBtn"type="button">View More</button>
        </div>
    );
};


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
        }
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
            console.log(pagedVideos[videoMax-2]);
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
        console.log('query string isnot empty: ' + queryString)
        const next = document.querySelector("#nextButton");
        videoMax = 300;
        next.addEventListener("click", (e) => {
            console.log(pagedVideos[0])
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

const createLoad = () => {
    ReactDOM.render(
        <Load />, document.querySelector("#content")
    );
}

const createReport = (csrf) => {
    ReactDOM.render(
        <ReportWindow csrf={csrf}/>, document.querySelector("#search")
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
        createReport(csrf);
        return false;
    });

    if(reportSubmit) {
        reportSubmit.addEventListener("click", (e) => {
            e.preventDefault();
            createSearchForm(csrf);
            return false;
        });
    }

    homeButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSearchForm(); // Uncomment on site up
        //createAssistSelect();
        loadAllVideosFromServer(); // Uncomment on site up
        return false;
    });

    createSearchForm();
    createLoad();
    createAssistSelect();

    console.log(window.location.pathname)

    /*if(window.location.pathname != '/') {
        console.log('true')
        handleURL();
    }
    else {
        console.log('false')
        loadAllVideosFromServer() //Default window Uncomment all on sit up
    }*/
    loadAllVideosFromServer() //Default window Uncomment all on sit up

    //Default loads all Videos on the server 
    //createSiteDown();

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
    <option value="" disabled selected hidden>Character 1</option><option value="Anyone">Anyone</option>
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
    <option value="" disabled selected hidden>Assist 1</option><option value="Anyone">Anyone</option>
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
    <option value="" disabled selected hidden>Character 2</option><option value="Anyone">Anyone</option>
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
    <option value="" disabled selected hidden>Assist 2</option><option value="Anyone">Anyone</option>
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

const assistInfo = [
    <div id = 'aInfo' value ='Accelerator'>
        <h2>line1</h2>
        <h2>line2</h2>
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
    </div>
]
//#endregion

const assistTest = <div>
    <h1>Testing1</h1>
</div>

const assistTest2 = <div>
    <h1>Testing2</h1>
</div>