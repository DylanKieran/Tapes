const queryString = require('querystring');
const fetch = require('node-fetch');

document.getElementById("trackName").innerHTML = "";
document.getElementById("albumName").innerHTML = "";
document.getElementById("artistName").innerHTML = "";

//Click event for sign in functionality
let login = document.getElementById("signin").onclick = function() 
{
    location.href = "http://localhost:8888/login";
}

//Parse authentication token passed from server to client via browser url and store in local storage
let parsed = queryString.parse(window.location.search);
let parsedToken = parsed["?access_token"];

localStorage.setItem('accessToken', parsedToken);
let accessToken = localStorage.getItem('accessToken');

if(accessToken.length > 1){
    fetch('https://api.spotify.com/v1/me',{
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + accessToken},
    })
    .then(res =>  res.json())
    .then(function(res) {
        
        console.log(res);
        document.getElementById("signin").src = res.images[0].url;
    });
}
else{
    document.getElementById("signin").src = "search.png";
}

//Click event for search button 
document.getElementById("search").onclick = function()
{
    let query = document.getElementById("query").value;
    console.log(query);
    Search(accessToken,query, 10);
};

//Search function to search for artist/track
function Search(accessToken, query, limit)
{
    fetch('https://api.spotify.com/v1/search?q=' 
    + query 
    + '&type=' + 'track%2Cartist' 
    + '&market=US' 
    + '&limit=' + limit 
    + '&offset=5', {
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + accessToken},
    })
    .then(res =>  res.json())
    .then(function(res) {
 
        console.log(res);
        document.getElementById("results").innerHTML = null;

        //Loop through search results and display them on screen
        for(let i=0; i<10; i++)
        {
            document.getElementById("results").innerHTML += "<div class=\"result\"><img class=\"artWork\" src="
            + res.tracks.items[i].album.images[2].url + ">" 
            + "<h1>" + res.tracks.items[i].name + "</h1>"
            + "<h2>" + res.tracks.items[i].album.name + "</h2>"
            + "<h3>" + res.tracks.items[i].artists.map(artist => artist.name).join(", ") + "</h3>"
            + "</div>";
        }

    });

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
        let albumArt = state.track_window.current_track.album.images[0].url;


        document.getElementById("albumArt").src = albumArt;
        document.getElementById("trackName").innerHTML = trackName;
        document.getElementById("albumName").innerHTML = albumName;
        document.getElementById("artistName").innerHTML = artistName;
    
    });
  
    //Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });
  
    //Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });
  
    //Connect to the player!
    player.connect();

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
};
