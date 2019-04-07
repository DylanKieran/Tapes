// Variables
playback = 
"<div id=\"playback-container\" class=\"row\">" +

    "<div id=\"previous\" class=\"col s2 offset-s1\"></div>"+

    "<div class=\"col s4 offset-s1\">" +
        "<h4 class=\"header\">Now Playing</h4>" +
        "<div class=\"row purple darken-1 wrapper\">" +
            "<div class=\"card horizontal grey lighten-5\">" +

                "<div class=\"card-image\">" +
                    "<img id=\"albumArt\" src=\"\">" +
                "</div>" +

                "<div class=\"card-stacked\">" +
                    "<div class=\"card-content\">" +
                        "<h3 class=\"title\" id=\"trackName\"></h3>" +
                        "<h6 class=\"title\" id=\"albumName\"></h6>" +
                        "<h6 class=\"title\" id=\"artistName\"></h6>" +
                    "</div>" + 
                "</div>" +
            "</div>" +

            "<div class=\"col s10 offset-s1 card horizontal purple darken-1\">" +
                "<i id=\"volDown\" class=\"col s2 material-icons white-text\">volume_mute</i>" +
                "<i id=\"prev\" class=\"col s2 material-icons small white-text\">fast_rewind</i>" + 
                "<i id=\"play\" class=\"col s2 material-icons small white-text\">play_arrow</i>" + 
                "<i id=\"next\" class=\"col s2 material-icons small white-text\">fast_forward</i>" + 
                "<i id=\"volUp\" class=\"col s2 material-icons white-text\">volume_up</i>" +
            "</div>" + 
        "</div>" +

    "</div>" +

    "<div id=\"nexttrack\" class=\"col s2 offset-s1\"></div>"+

"</div>" + 

    "<div id=\"search-container\">" +
        "<div class=\"row\">" +
        "<h4 class=\"center-align\">Search</h4>" +
            "<div class=\"col s6 offset-s3 input-field\">" +
                "<input type=\"search\" id=\"query\" placeholder=\"Search ...\"/>" +
                "<i id=\"searchSpotify\" onclick=\"search()\" class=\"material-icons pink-text\">search</i>" +
            "</div>" +
        "</div>" +
        "<div class=\"row\">" +
            "<div id=\"search-results\" class=\"col s10 offset-s1\"></div>" +
        "</div>" +
    "</div>" +

    "<div id=\"rec-lists-container\">" +
        "<div class=\"row\">" +

            "<div class=\"col s6\">" +
                "<h4 class=\"center-align\">Song Recommendations</h4>" +
                "<br>" +
                "<div id=\"recommendations\" class=\"col s12\"></div>" +
            "</div>" +

            "<div class=\"col s6\">" +
                "<h4 class=\"center-align\">Playlists</h4>" +
                "<br>" +
                "<div id=\"playlists\" class=\"col s12\"></div>" +
            "</div>" +

        "</div>" +
    "</div>";

instructions = 
"<div class=\"row\">" + 
    "<div class=\"col s8 offset-s2\">" +
     "<br><br>" +
        "<div class=\"card-panel grey lighten-5 z-depth-1\">" +
            "<div class=\"row valign-wrapper\">" +
                "<div class=\"col s2\">" +
                    "<img src=\"./assets/instructions.gif\"/>" +
                "</div>" +
                "<div class=\"col s6\">" +
                    "<h4>Control Playback</h4>" + 
                    "<span class=\"black-text\">" +
                        "In order to connect to the Spotify Player please follow the following instructions:" +
                        "<br><br>" +
                        "<b>1.</b> Fire up the Spotify app on your phone, laptop or tablet." +
                        "<br>" +
                        "<b>2.</b> Play a song and select Devices Available." +
                        "<br>" +
                        "<b>3.</b> Select Tapes as your device and start listening." +
                    "</span>" +
                "</div>" +
            "</div>" +
        "</div>" +
    "</div>" +
"</div>";

//Parse authentication token passed from server to client via browser url and store in local storage
let parsed = window.location.search.substr(1);
let parsedToken = parsed.slice(13);

localStorage.setItem('accessToken', parsedToken);
let accessToken = localStorage.getItem('accessToken');

// If user is signed in then proceed to display the playback instructions
if(accessToken.length > 1)
{
    fetch('https://api.spotify.com/v1/me',{
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + accessToken},
    })
    .then(res =>  res.json())
    .then(function(res) {
        console.log(res);
        //document.getElementById("signin").src = res.images[0].url;
        document.getElementById("playback").innerHTML = instructions;
    });
}

// Retrieve Spotify topSongs
function spotify_topSongs(accessToken)
{
    url="https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF"

    return fetch(url,{
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + accessToken}})
    .then(res => res.json())
    .catch(error => console.log(error))
}

//Call Spotify Player and initiate player
//Allows user playback in web browser from any device
window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
      name: 'Tapes',
      getOAuthToken: cb => { cb(accessToken); }
    });

    //Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });
  
    //Playback status updates
    player.addListener('player_state_changed', state => { 
        
        console.log(state); 

        //Change DOM and display current track information
        let trackName = state.track_window.current_track.name;
        let albumName = state.track_window.current_track.album.name;
        let artistName = state.track_window.current_track.artists
                        .map(artist => artist.name)
                        .join(", ");
        let albumArt = state.track_window.current_track.album.images[2].url;
        let trackid = state.track_window.current_track.id;

        document.getElementById("playback").innerHTML = playback;

        document.getElementById("albumArt").src = albumArt;
        document.getElementById("trackName").innerHTML = trackName;
        document.getElementById("albumName").innerHTML = albumName;
        document.getElementById("artistName").innerHTML = artistName;

        playerEvents();

        getRecommendations(trackid,accessToken).then(function(res)
        {
            insertRecommendations(res);
        });

        insertPlaylists();

        //Change DOM and display next track information
        //If next track exists add it
        if(state.track_window.next_tracks[0] == null)
        {
            document.getElementById("nexttrack").innerHTML = null;
        }
        else
        {
            let nexttrackName = state.track_window.next_tracks[0].name;
            let nextalbumName = state.track_window.next_tracks[0].album.name;
            let nextartistName = state.track_window.next_tracks[0].artists
                            .map(artist => artist.name)
                            .join(", ");
            let nextalbumArt = state.track_window.next_tracks[0].album.images[0].url;

            insertNext();

            document.getElementById("nextalbumArt").src = nextalbumArt;
            document.getElementById("nexttrackName").innerHTML = nexttrackName;
            document.getElementById("nextalbumName").innerHTML = nextalbumName;
            document.getElementById("nextartistName").innerHTML = nextartistName;
        }

        //Change DOM and display previous track information
        //If previous track exists add it
        if(state.track_window.previous_tracks[0] == null)
        {
            document.getElementById("previous").innerHTML = null;
        }
        else if(state.track_window.previous_tracks[1] != null)
        {
            let prevtrackName = state.track_window.previous_tracks[1].name;
            let prevalbumName = state.track_window.previous_tracks[1].album.name;
            let prevartistName = state.track_window.previous_tracks[1].artists
                            .map(artist => artist.name)
                            .join(", ");
            let prevalbumArt = state.track_window.previous_tracks[1].album.images[0].url;

            insertPrev();

            document.getElementById("prevalbumArt").src = prevalbumArt;
            document.getElementById("prevtrackName").innerHTML = prevtrackName;
            document.getElementById("prevalbumName").innerHTML = prevalbumName;
            document.getElementById("prevartistName").innerHTML = prevartistName;
        }
        else
        {
            let prevtrackName = state.track_window.previous_tracks[0].name;
            let prevalbumName = state.track_window.previous_tracks[0].album.name;
            let prevartistName = state.track_window.previous_tracks[0].artists
                            .map(artist => artist.name)
                            .join(", ");
            let prevalbumArt = state.track_window.previous_tracks[0].album.images[0].url;

            insertPrev();

            document.getElementById("prevalbumArt").src = prevalbumArt;
            document.getElementById("prevtrackName").innerHTML = prevtrackName;
            document.getElementById("prevalbumName").innerHTML = prevalbumName;
            document.getElementById("prevartistName").innerHTML = prevartistName;
        }
    });
  
    //Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
      playSong(device_id, accessToken);
    });
  
    //Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });
  
    //Connect to the player!
    player.connect();

    function playerEvents()
    {
        //Click event for previous track button 
        document.getElementById("prev").onclick = function()
        {
            player.previousTrack();
        };

        //Click event for play/pause button 
        document.getElementById("play").onclick = function()
        {
            player.togglePlay();
        };

        //Click event for next track button 
        document.getElementById("next").onclick = function()
        {
            player.nextTrack();
        };

        let vol = 0.05;

        //Volume Down
        document.getElementById("volDown").onclick = function()
        {
            if(vol <= 0)
            {
                vol = 0;
            }
            else
            {
                vol = vol - 0.05;
                player.setVolume(vol).catch(error => console.log(error));
            }
            console.log(vol);
        };

        //Volume Up
        document.getElementById("volUp").onclick = function()
        {
            if(vol >= 1)
            {
                vol = 1
            }
            else
            {
                vol = vol + 0.05;
                player.setVolume(vol).catch(error => console.log(error));
            }
            console.log(vol);
        };
        player.setVolume(vol)
    }
}

function insertPrev()
{
    document.getElementById("previous").innerHTML =
    "<h4 class=\"header\">Previous</h4>" +
        "<div class=\"row pink wrapper\">" +
            "<div id=\"prevTrack\" class=\"card hoverable grey lighten-5\">" + 
                "<div class=\"card-image\">" +
                    "<img id=\"prevalbumArt\" src=\"\">" +
                "</div>" +
                "<div class=\"card-content\">" +
                    "<h5 id=\"prevtrackName\"></h5>" +
                    "<p class=\"truncate\" id=\"prevalbumName\"></p>" +
                    "<p class=\"truncate\" id=\"prevartistName\"></p>" +
                "</div>" +
            "</div>" +
        "</div>" +
    "</div>";

}

function insertNext()
{
    document.getElementById("nexttrack").innerHTML =
    "<h4 class=\"header\">Next</h4>" +
        "<div class=\"row pink wrapper\">" +
            "<div id=\"nextTrack\" class=\"card hoverable grey lighten-5\">" + 
                "<div class=\"card-image\">" +
                    "<img id=\"nextalbumArt\" src=\"\">" +
                "</div>" +
                "<div class=\"card-content\">" +
                    "<h5 id=\"nexttrackName\"></h5>" +
                    "<p class=\"truncate\" id=\"nextalbumName\"></p>" +
                    "<p class=\"truncate\" id=\"nextartistName\"></p>" +
                "</div>" +
            "</div>" +
        "</div>" +
    "</div>";
}

function getRecommendations(trackid, accessToken)
{
    url="https://api.spotify.com/v1/recommendations?"

    return fetch(url + "seed_tracks=" + trackid,{
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + accessToken}})
    .then(res => res.json())
    .catch(error => console.log(error));
}

function insertRecommendations(res)
{
    document.getElementById("recommendations").innerHTML = null;

    for(let i=0; i<6; i++)
    {
        //console.log(res);
        let trackName = res.tracks[i].name;
        let albumName = res.tracks[i].album.name;
        let artistName = res.tracks[i].artists
                        .map(artist => artist.name)
                        .join(", ");
        let albumArt = res.tracks[i].album.images[0].url;
        let trackuri = res.tracks[i].uri;

        document.getElementById("recommendations").innerHTML += 
        "<div class=\"col s4\">" +
            "<div class=\"card\">" +
                "<div class=\"card-image\">" +
                    "<img onclick=\"playSong('" + trackuri + "')\" src=\"" + albumArt + "\">" +
                "</div>" +
                "<div class=\"card-content\">" +
                    "<h5 class=\"truncate\">" + trackName + "</h5>" +
                    "<h6 class=\"truncate\">" + albumName + "</h6>" +
                    "<h6 class=\"truncate\">" + artistName + "</h6>" +
                "</div>" +
            "</div>" +
        "</div>";
    }
}

function getPlaylists()
{
    url="https://api.spotify.com/v1/me/playlists"

    return fetch(url,{
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + accessToken}})
    .then(res => res.json())
    .catch(error => console.log(error));
}

function insertPlaylists()
{
    getPlaylists().then(function(res)
    {
        document.getElementById("playlists").innerHTML = null;
        for(let i=0; i<6; i++)
        {
            //console.log(res);
            let playlistName = res.items[i].name;
            let playlistArt = res.items[i].images[0].url;
            let playlisturi = res.items[i].uri;
            let playlistCreator = res.items[i].owner.display_name;
    
            document.getElementById("playlists").innerHTML += 
            "<div class=\"col s4\">" +
                "<div class=\"card\">" +
                    "<div class=\"card-image\">" +
                        "<img onclick=\"playPlaylist('" + playlisturi + "')\" src=\"" + playlistArt + "\">" +
                    "</div>" +
                    "<div class=\"card-content\">" +
                        "<h5 class=\"truncate\">" + playlistName + "</h5>" +
                        "<p class=\"truncate\">" + playlistCreator + "</p>" +
                    "</div>" +
                "</div>" +
            "</div>";
        }
    })
}

//Search function to search for artist/track
function search()
{
    let query = document.getElementById("query").value;
    console.log(query);

    fetch('https://api.spotify.com/v1/search?q=' 
    + query 
    + '&type=' + 'track%2Cartist' 
    + '&market=US' 
    + '&limit=12' 
    + '&offset=5', {
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + accessToken},
    })
    .then(res =>  res.json())
    .then(function(res) {
 
        console.log(res);
        document.getElementById("search-results").innerHTML = null;

        //Loop through search results and display them on screen
        for(let i=0; i<12; i++)
        {
            document.getElementById("search-results").innerHTML += 
            "<div class=\"col s2\">" +
            "<div class=\"card\">" +
                "<div class=\"card-image\">" +
                    "<img onclick=\"playSong('" + res.tracks.items[i].uri + "')\" src=\"" + res.tracks.items[i].album.images[0].url + "\">" +
                "</div>" +
                "<div class=\"card-content\">" +
                    "<h5 class=\"truncate\">" + res.tracks.items[i].name + "</h5>" +
                    "<h6 class=\"truncate\">" + res.tracks.items[i].album.name + "</h6>" +
                    "<h6 class=\"truncate\">" + res.tracks.items[i].artists.map(artist => artist.name).join(", ") + "</h6>" +
                "</div>" +
            "</div>" +
        "</div>";
        }

    });
}

function getDevice()
{
    return fetch("https://api.spotify.com/v1/me/player/devices",{
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + accessToken}
    })
    .then(res => res.json())
    .catch(error => console.log(error))
}

function playSong(uri)
{
    getDevice().then(function(res){
        //console.log(res);
        let i = 0;
        let deviceid = "";

        do{
            i++;
            if(res.devices[i].is_active == true)
            {
                deviceid = res.devices[i].id;
            }
        }while(res.devices[i].is_active != true)

        url = "https://api.spotify.com/v1/me/player/play?device_id=" + deviceid;
        data = {"uris": [uri]};
    
        fetch(url,{
            method: 'put',
            headers: { 'Authorization': 'Bearer ' + accessToken},
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .catch(error => console.log(error))
    })
}

function playPlaylist(uri)
{
    getDevice().then(function(res){
        //console.log(res);
        let i = 0;
        let deviceid = "";

        do{
            i++;
            if(res.devices[i].is_active == true)
            {
                deviceid = res.devices[i].id;
            }
        }while(res.devices[i].is_active != true)

        url = "https://api.spotify.com/v1/me/player/play?device_id=" + deviceid;
        data = {"context_uri": uri};
    
        fetch(url,{
            method: 'put',
            headers: { 'Authorization': 'Bearer ' + accessToken},
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .catch(error => console.log(error))
    })
}