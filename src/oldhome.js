// Redo this API Key part
LastFMKey = "dbde17b3ffb13c8656d3d2bc5e6ee583";

// Call Top Songs function that will display Top Songs to screen
getTopSongs().then(function(res)
{
  let id = 0;
  console.log(res);

  document.getElementById("topSongs-list").innerHTML = null;

  for(let i=0; i<10; i++)
  {
    document.getElementById("topSongs-list").innerHTML += 
    "<li class=\"collection-item avatar\">" +
    "<img src=\"" + res.tracks.track[i].image[3]['#text'] + "\" alt=\"\" class=\"circle\">" +
    "<div class=\"col s10 offset-s1\">" +
    "<p class=\"title\">" + res.tracks.track[i].name + "</p>" +
    "<p>" + res.tracks.track[i].artist.name + "<br></p>" +
    "</p>" +
    "</div>" +
    "</li>";
    id++;
  }
});

// Call Top Artists function that will display Top Artists to screen
getTopArtists().then(function(res)
{
  let id = 0;
  
  document.getElementById("topArtists-list").innerHTML = null;
  
  for(let i=0; i<10; i++)
  {
    document.getElementById("topArtists-list").innerHTML += 
    "<li class=\"collection-item avatar\">" +
    "<img src=\"" + res.artists.artist[i].image[3]['#text'] + "\" alt=\"\" class=\"circle\">" +
    "<div class=\"col s12 offset-s1\">" +
    "<span class=\"title\">" + res.artists.artist[i].name + "</span>" +
    "<p>Playcount: " + res.artists.artist[i].playcount + "<br></p>" +
    "</p>" + (id+1) + 
    "</div>" +
    "</li>";
    id++;
  }
});

//Populate div with top songs 
yttopSongsIE().then(function(res) 
{
    let id = 0;
    console.log(res);
    document.getElementById("yt-topSongs-IE").innerHTML = null;

    for(let i=0; i<10; i++)
    {
        if(res.items[i].kind === "youtube#video")
        {
           document.getElementById("yt-topSongs-IE").innerHTML += 
            "<li class=\"collection-item avatar\">" +
            "<img src=\"" + res.items[i].snippet.thumbnails.high.url + "\" alt=\"\" class=\"circle\">" +
            "<div class=\"col s10 offset-s1\">" +
            "<p class=\"title truncate\">" + res.items[i].snippet.title + "</p>" +
            "</p>" +
            "</div>" +
            "</li>";
            id++;
        }
    }
})

//Populate div with top songs 
yttopSongsUS().then(function(res) 
{
    let id = 0;
    console.log(res);
    document.getElementById("yt-topSongs-US").innerHTML = null;

    for(let i=0; i<10; i++)
    {
        if(res.items[i].kind === "youtube#video")
        {
           document.getElementById("yt-topSongs-US").innerHTML += 
            "<li class=\"collection-item avatar\">" +
            "<img src=\"" + res.items[i].snippet.thumbnails.high.url + "\" class=\"circle\">" +
            "<div class=\"col s10 offset-s1\">" +
            "<p class=\"title truncate\">" + res.items[i].snippet.title + "</p>" +
            "</p>" +
            "</div>" +
            "</li>";
            id++;
        }
    }
})

// Function that retrieves Top Songs from LastFM
function getTopSongs()
{
  url = "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=" + LastFMKey + "&format=json";

  return fetch(url)
  .then(res => res.json())
  .catch(error => console.log(error))
}

// Function that retrieves Top Artists from LastFM
function getTopArtists()
{
  url = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=" + LastFMKey + "&format=json";

  return fetch(url)
  .then(res => res.json())
  .catch(error => console.log(error))
}

//Function to retrieve top songs
function yttopSongsIE()
{
    return fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet'
    + '&maxResults=10'
    + '&chart=mostPopular' 
    + '&videoCategoryId=10'
    + '&regionCode=IE'
    + '&key=' + "AIzaSyCDLBp4ecF3bkrq_rJWb47Gu9hdtw58YrU",{
        method: 'get'
    })
    .then(res =>  res.json())
    .catch(error => console.log(error))
}

//Function to retrieve top songs
function yttopSongsUS()
{
    return fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet'
    + '&maxResults=10'
    + '&chart=mostPopular' 
    + '&videoCategoryId=10'
    + '&regionCode=US'
    + '&key=' + "AIzaSyCDLBp4ecF3bkrq_rJWb47Gu9hdtw58YrU",{
        method: 'get'
    })
    .then(res =>  res.json())
    .catch(error => console.log(error))
}