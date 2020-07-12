//At the top of the file
let _csrf;

// Values to help not repeat methods
let pageList = false;
let loopNumber = 1;
let videoKey = 0;
let videoIndex = 0;
let videoMax = 300;
let pagedVideos = [];



// ADDING A VIDEO
const handleVideo = (e) => {
    videoKey = 0;
    let modValue = 0;

    let charModValue = 0;
    e.preventDefault();

    // Create a video object to send to the server
    const videoObj = { }

    // For each match a user wants to add, push the object
    for(let i = 0; i < loopNumber; i++) {
        let newObject = {}
        videoObj[i] = newObject;
    }

    // Find the overall link the user inputted
    $('#videoForm').find('input').each(function(){
        if(this.name === 'videoLink') {
            videoObj.videoLink = this.value;
        }
    });

    if($("#timeStamp").val() == '' || $("#playerOne").val() == '' || $("#playerTwo").val() == '' ||
    $("#videoLink").val() == '') {
        handleError("ERROR | All fields are required");
        return false;
    }

    // Check if the error uses the correct link *just copying the url
    if(!$("#videoLink").val().includes('www.youtube.com')) {
        handleError("ERROR | Please use a valid YouTube link");
        return false;
    }


    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Quantifiers
    // https://www.w3schools.com/jsref/jsref_replace.asp
    let regex = /[0-9][0-9]:[0-9][0-9]:[0-9][0-9]/g;


     /// Putting each input into its own object to send to the server 
     ///
     $('#videoForm').find('td > input').each(function(){
        if(modValue===0) {

            // Using regex to ensure the timestamp is correct
            if(regex.test(this.value)) {
                let array = this.value.match(regex);
                JSON.stringify(array);
                let newArray = array[0].replace(/:.*?/, "h");
                let newArray2 = newArray.replace(/:.*?/, "m");
                let finalArray = newArray2 + "s"

                videoObj[videoKey].link = `${videoObj.videoLink}&t=${finalArray}`;
            } else {
                videoObj[videoKey].link = `${videoObj.videoLink}&t=${this.value}`;
            }
        } 
        if(modValue===1) {
            videoObj[videoKey].player1 = this.value;
        }
        if(modValue===2) {
            // Once the end is reached, add the game from the selection
            // Add characters as well
            // and iterate the videoKey and reset the modification values
            videoObj[videoKey].player2 = this.value;
            videoObj[videoKey].version = $('#videoForm').find('#version').find(":selected").val();
            videoKey++;
            modValue=-1;
        }

        modValue++;
    });


    // Set the new video key to the loop number for the next loop
    videoKey = loopNumber;

    // For character selection
    $('#videoForm').find('select').each(function() {
        // One of the selections is for the game, we don't need that
        // Also, if the key is equal to zero, skip it.
        if(this.id != "version") {
            if(videoKey>0) {
                if(charModValue === 0) {
    
                    // In order to ensure the object exists, take it from 
                    // the loop number and go down what's already been created
                    // and add that property to the list
                    videoObj[loopNumber-videoKey].assist1 = this.value;
                } else if(charModValue === 1) {
                    videoObj[loopNumber-videoKey].char1 = this.value;
                } else if(charModValue === 2) {
                    videoObj[loopNumber-videoKey].char2 = this.value;
                } else if(charModValue === 3) {
                    videoObj[loopNumber-videoKey].assist2 = this.value;
                    charModValue = -1;
                    videoKey--;
                }
                charModValue++;
            }
        }
    })
    

    // CSRF is associated with a user, so add a token to the overall object to send to the server
    $('#videoForm').find('input').each(function(){
        if(this.type === 'hidden') {
            videoObj._csrf = this.value;
        }
    });
    // Uncomment this to send data
    // Send the object! :diaYay:
    sendAjax('POST', $("#videoForm").attr("action"), videoObj, function() {
        loadAllVideosFromServer();
    });

    return false;
};

// Handle deletion of a video
const handleDelete = (e) => {
    e.preventDefault();
  
    let data = {
      uid: e.target.value,
      _csrf
    }
  
    sendAjax('POST', '/delete', data, function () {loadVideosFromServer();});
  
    return false;
  }

// Handling password change
const handleChange = (e) => {
    e.preventDefault();

    if($("#pass").val() == '' || $("#pass2").val() =='') {
        handleError("ERROR | All fields are required");
        return false;
    }

    if($("#pass").val() === $("#pass2").val()) {
        handleError("ERROR | Passwords cannot match");
        return false;
    }

    if($("#pass2").val() !== $("#pass3").val()) {
        handleError("ERROR | The new passwords do not match");
        return false;
    }

    sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);

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

    let queryString = `${$('#searchForm').attr('action')}?`;
    
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

// Search form
//Sets up the search form, will change the select for characters depending on the game selected
const SearchForm = () => {

    let charSelection = char1Search;
    let char2Selection = char2Search;
    let assist1Selection = assist1Search;
    let assist2Selection = assist2Search;

    const gameSelection = <select id = "gameSec" className = 'form-control'>
    <option value="" disabled selected hidden>Version</option><option value="Any">Any</option>
    <option value="2">DFC:I</option><option value="1">DFC</option>
    </select>;

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
                        <td>{assist1Selection}</td>
                        <td>{charSelection}</td>
                        <td id="vs">vs</td>
                        <td>{char2Selection}</td>
                        <td>{assist2Selection}</td>
                        <td><input className="form-control" id="player2Search" type="text" name="player2" placeholder="Player 2"/></td>
                        <td>{gameSelection}</td>
                    </tr>
                </tbody>
            </table>
        </form>
    )
};

/// FORM TO SUBMIT NEW DATA
const VideoForm = (props) => {

    // Rows to dynamically add more matches
    // https://stackoverflow.com/questions/22876978/loop-inside-react-jsx
    let rows = [];
    let charSelection = char1Select;
    let char2Selection = char2Select;
    let assist1Selection = assist1Select;
    let assist2Selection = assist2Select


    for(let i = 0; i < loopNumber; i++) {
        rows.push(
            <tbody>
                <tr>
                    <td><input id="timestamp" type="text" name="timestamp" placeholder="00:00:00"/></td>
                    <td><input id="playerOne" type="text" name="playerOne" placeholder="Player 1"/></td>
                    <td>{assist1Selection}</td>
                    <td>{charSelection}</td>
                    <td id="vs">vs</td>
                    <td>{char2Selection}</td>
                    <td>{assist2Selection}</td>
                    <td><input id="playerTwo" type="text" name="playerTwo" placeholder="Player 2"/></td>
                </tr>
            </tbody>
        )
    }

    return ( 
    <form 
        id="videoForm"
        onSubmit={handleVideo}
        name="videoForm"
        action="/main"
        method="POST"
        className="videoForm"
    >
        <div id ="static">
            <input id="videoLink" className='form-control' type="text" name="videoLink" placeholder="YouTube Link (https://www.youtube.com/watch?v=***********)"/>
            <select className="form-control" id="version" placeholder="Version">
                <option value="" disabled selected hidden>Version</option>
                <option value="2">DFC:I</option>
                <option value="1">DFC</option>
            </select>
            <div className='table-responsive'>
                <table id="videoFormTable" className="table table-sm table-dark">
                    {rows}
                </table>
            </div>
            <input className="makeVideoSubmit" className="formSubmit btn mainBtn" type="submit" value="Add Video"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <button id="addMatchButton" className="formSubmit btn secondBtn"type="button">Add a Match</button>
            <button id="removeMatchButton" className="formSubmit btn thirdBtn"type="button">Remove a Match</button>

        </div>
        <div id="adSpace"></div>

    </form>
    );
};


/// CHANGE PASSWORD WINDOW
const ChangeWindow = (props) => {
    return ( 
    <form   id="changeForm" 
            name="changeForm"
            onSubmit={handleChange}
            action="/passChange"
            method="POST"
            className="mainForm"
        >
        <input className="form-control" id="pass" type="password" name="pass" placeholder="old password"/>
        <input className="form-control" id="pass2" type="password" name="pass2" placeholder="new password"/>
        <input className="form-control" id="pass3" type="password" name="pass3" placeholder="re-type password"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="formSubmit btn" type="submit" value="Change"/>
    </form>
    );
};

const Load = () => {
    return (<div className="videoList">
                <h3 className="emptyVideo">Loading videos from the database...</h3>
             </div>)
};

/// RENDERING THE LIST
/// Render the list depending on if it's a page list or the full list
const VideoList = function(props) {

    
    // Do we need to show deletion or not
    let deleteButton;

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
                        <td id="name">{video.player1}</td>
                        <td>{assistImg1}</td>
                        <td>{charImg1}</td>
                        <td>vs</td>
                        <td>{charImg2}</td>
                        <td>{assistImg2}</td>
                        <td>{video.player2}</td>
                        <td id ="name2">
                            <a href={video.link} className="icons-sm yt-ic" target="_blank"><i className="fab fa-youtube fa-2x"> </i></a>
                        </td>
                        <td>{versionImg}</td>
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
    //console.log(pagedVideos.length);
    
    return (
        <div id="pageContainer">
            <div className="table-responsive">
                <table className="table table-sm table-dark">
                {pagedVideos}
                </table>
            </div>
            <button id="nextButton" className="formSubmit btn secondBtn"type="button">View More</button>
            <button id="nextButtonSearch" className="formSubmit btn secondBtn"type="button">View More</button>
            
        </div>
    );
};

const loadVideosFromServer = () => {
    loopNumber = 1;
    pageList = true;
    sendAjax('GET', '/getVideos', null, (data) => {
        ReactDOM.render(
            <VideoList videos={data.videos} />, document.querySelector("#content")
        );
    });
};

// Display all videos for home page
const loadAllVideosFromServer = () => {
    loopNumber = 1;
    pageList = false;
    createSearchForm();

    sendAjax('GET', '/getAllVideos', null, (data) => {
        ReactDOM.render(
            <VideoList videos={data.videos} />, document.querySelector("#content")
        );
        document.querySelector("#nextButton").style.display = "block";
        document.querySelector("#nextButtonSearch").style.display = "none";
        videoMax = 300; 
        const next = document.querySelector("#nextButton");
            next.addEventListener("click", (e) => {
            console.log(pagedVideos);
                if(pagedVideos[videoMax-2] === undefined) {
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

const createPassChangeWindow = (csrf) => {
    loopNumber =1;
    ReactDOM.render(
        <ChangeWindow csrf={csrf} />,
        document.querySelector("#content")
    );

    // Unmount the search bar
    ReactDOM.unmountComponentAtNode(document.querySelector("#search"));

};

const createAddWindow = (csrf) => {
    ReactDOM.render(
        <VideoForm csrf={csrf} />,
        document.querySelector("#content")
    );

    ReactDOM.unmountComponentAtNode(document.querySelector("#search"));

    const removeMatchButton = document.querySelector("#removeMatchButton");
    removeMatchButton.addEventListener("click", (e) => {
        if(loopNumber !== 1) {
            loopNumber--;
            //If it's clicked, just re-render
            ReactDOM.render(
                <VideoForm csrf={csrf} />,
                document.querySelector("#content")
            );
        } else {
            handleError("ERROR | Cannot remove last match")
        }
    });

    // Get the button that was made in the videoForm
    const addMatchButton = document.querySelector("#addMatchButton");
    addMatchButton.addEventListener("click", (e) => {
        loopNumber++;
        //If it's clicked, just re-render
        ReactDOM.render(
            <VideoForm csrf={csrf} />,
            document.querySelector("#content")
        );
    });
};

const createSearchForm = () => {
    ReactDOM.render(
        <SearchForm />, document.querySelector("#search")  
    );

    // If the game changes, re-render
    $('#searchForm').find('select').on('change', function() {
        ReactDOM.render(
            <SearchForm />,
            document.querySelector("#search")
        );
        document.querySelector("#nextButton").style.display = "none";
        if(queryString != '')
        {
                const next = document.querySelector("#nextButtonSearch");
                next.style.display = "block";
                videoMax = 300;
                next.addEventListener("click", (e) => {
                    if(pagedVideos[videoMax-2] === undefined) {
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
        else {
            const next = document.querySelector("#nextButtonSearch");
            next.style.display = "none";
        }
    });
}

const createLoad = () => {
    ReactDOM.render(
        <Load />, document.querySelector("#content")
    );
}

const setup = function(csrf) {
    const homeButton = document.querySelector("#home");
    //const pageButton = document.querySelector("#myPage");
    const addButton = document.querySelector("#addVideo");
    const passChangeButton = document.querySelector("#passChangeButton");

    passChangeButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPassChangeWindow(csrf);
        return false;
    });

    addButton.addEventListener("click", (e) => {
        e.preventDefault();
        createAddWindow(csrf);
        return false;
    });

    homeButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSearchForm();
        loadAllVideosFromServer();
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
    loadAllVideosFromServer();

};

//And set it in getToken
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
      _csrf = result.csrfToken;
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});

//#region Character Forms
//Separated the character forms for ease of reference and readability in above code
const char1Select = <select id = "char1">
    <option value="Akira" selected>Akira</option><option value="Ako">Ako</option>
    <option value="Asuna">Asuna</option><option value="Emi">Emi</option><option value="Kirino">Kirino</option>
    <option value="Kirito">Kirito</option><option value="Kuroko">Kuroko</option><option value="Kuroyukihime">Kuroyukihime</option>
    <option value="Mikoto">Mikoto</option><option value="Miyuki">Miyuki</option>
    <option value="Quenser">Quenser</option><option value="Rentaro">Rentaro</option><option value="Selvaria">Selvaria</option>
    <option value="Shana">Shana</option><option value="Shizuo">Shizuo</option><option value="Taiga">Taiga</option>
    <option value="Tatsuya">Tatsuya</option><option value="Tomoka">Tomoka</option><option value="Yukina">Yukina</option>
    <option value="Yuuki">Yuuki</option>
    </select>;

const assist1Select = <select id = "assist1">
    <option value="Accelerator" selected>Accelerator</option><option value="Alicia">Alicia</option>
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

const char2Select = <select id = "char2">
    <option value="Akira" selected>Akira</option><option value="Ako">Ako</option>
    <option value="Asuna">Asuna</option><option value="Emi">Emi</option><option value="Kirino">Kirino</option>
    <option value="Kirito">Kirito</option><option value="Kuroko">Kuroko</option><option value="Kuroyukihime">Kuroyukihime</option>
    <option value="Mikoto">Mikoto</option><option value="Miyuki">Miyuki</option>
    <option value="Quenser">Quenser</option><option value="Rentaro">Rentaro</option><option value="Selvaria">Selvaria</option>
    <option value="Shana">Shana</option><option value="Shizuo">Shizuo</option><option value="Taiga">Taiga</option>
    <option value="Tatsuya">Tatsuya</option><option value="Tomoka">Tomoka</option><option value="Yukina">Yukina</option>
    <option value="Yuuki">Yuuki</option>
    </select>;

const assist2Select = <select id = "assist2">
    <option value="Accelerator" selected>Accelerator</option><option value="Alicia">Alicia</option>
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

//#endregion