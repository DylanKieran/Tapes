let YouTubeKey = 'AIzaSyCDLBp4ecF3bkrq_rJWb47Gu9hdtw58YrU';
     
//This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//This function creates an <iframe> (and YouTube player)
//after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {

player = new YT.Player('player', {
  height: '360',
  width: '640',
  videoId: 'WILNIXZr2oc',
  events: {
    'onReady': onPlayerReady,
    'onError': onPlayerError
    }
  });
}

/*document.getElementById("video").onclick = function(){
  player.loadVideoById({'videoId': 'cwQgjq0mCdE',
  'startSeconds': 5,
  'suggestedQuality': 'large'});
}*/

//The API will call this function when the video player is ready.
function onPlayerReady(event) {
  //event.target.playVideo();  /*Uncomment to autoplay video*/
}

function onPlayerError(e){
  //code 2 = invalid parameter in the request
  //code 5 = html5 player error
  //code 100 = removed video or private video
  //code 101 = embedding video is not allowed
  //code 150 = same as 101
  console.log('error has occured' + e.data);
}

// Adds video to start of queue to be played
function addtoqueue(videoid)
{
    player.cueVideoById({'videoId': videoid,
        'startSeconds':5});
    Queue.unshift(videoid)
    retrieveVideoInfo(videoid).then(function(res)
    {
      console.log(res.items);
      insertHead(res);
    })
    addQueue(Queue);
}

// Retrieve Youtube video information
function retrieveVideoInfo(videoId)
{
   return fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet'
    + '&id=' + videoId
    + '&key=' + YouTubeKey,{
      method: 'get'
  })
    .then(res =>  res.json())
    .catch(error => console.log(error))
}

//Queue
let Queue = []; 

// Add item to queue
function addtoQueue(videoid)
{
    //Add song to bottom of Queue
    retrieveVideoInfo(videoid).then(function(res)
    {
      console.log(res.items);
      popQueue(res);
    })

    Queue.push(videoid);
    console.log("Video added:" + Queue);
    addQueue(Queue);
}

// Add queue playlist to youtube player
function addQueue(addQueue)
{
  player.cuePlaylist({
    playlist: addQueue
  });
}

// Remove video from queue
function removefromQueue(videoid)
{
    //Remove song when finished playing
    //shift removes song from beginning of the array
    var index = Queue.indexOf(videoid);
 
    if (index > -1) {
       Queue.splice(index, 1);
    }
    console.log("Video Removed:" + Queue);

    var elem = document.getElementById(videoid);
    elem.parentNode.removeChild(elem);

    removeToast();

    addQueue(Queue);
}

//Populate Queue list with added song
function popQueue(res)
{
    console.log(res);

    document.getElementById("queue").innerHTML += 
    "<li id=\"" + res.items[0].id + "\" class=\"collection-item avatar\">" +
    "<img src=\"" + res.items[0].snippet.thumbnails.high.url + "\" alt=\"\" class=\"circle\" onclick=\"addtoqueue('" + res.items[0].id + "')\">" +
    "<div class=\"col s10 offset-s1\">" +
    "<p class=\"title\">" + res.items[0].snippet.title + "</p>" +
    "<i class=\"secondary-content material-icons small pink-text\" onclick=\"removefromQueue('" + res.items[0].id + "')\">remove_from_queue</i>" +
    "</div>" +
    "</li>";

    queueToast(res.items[0].snippet.title);
}

//Add song to start of queue to be played
function insertHead(res)
{
  console.log(res);

  listitem = document.createElement("li"); 

  var id = document.createAttribute("id");
  id.value = res.items[0].id;                           
  listitem.setAttributeNode(id);

  var att = document.createAttribute("class");
  att.value = "collection-item avatar";                           
  listitem.setAttributeNode(att);

  var list = document.getElementById("queue");
  list.insertBefore(listitem, list.childNodes[0]);

  document.getElementById(res.items[0].id).innerHTML =
  "<img src=\"" + res.items[0].snippet.thumbnails.high.url + "\" alt=\"\" class=\"circle\" onclick=\"addtoqueue('" + res.items[0].id + "')\">" +
  "<div class=\"col s10 offset-s1\">" +
  "<p class=\"title\">" + res.items[0].snippet.title + "</p>" +
  "<i class=\"secondary-content material-icons small pink-text\" onclick=\"removefromQueue('" + res.items[0].id + "')\">remove_from_queue</i>" +
  "</div>";

  playnowToast(res.items[0].snippet.title);
}

//Function to retrieve top songs
function youtubetopSongs()
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

//Populate div with top songs 
youtubetopSongs().then(function(res) 
{
    let id = 0;
    console.log(res);
    document.getElementById("youtube-topSongs-list").innerHTML = null;

    for(let i=0; i<10; i++)
    {
        if(res.items[i].kind === "youtube#video")
        {
            document.getElementById("youtube-topSongs-list").innerHTML += 
            "<li class=\"collection-item avatar\">" +
            "<img src=\"" + res.items[i].snippet.thumbnails.high.url + "\" alt=\"\" class=\"circle\" onclick=\"addtoqueue('" + res.items[i].id + "')\">" +
            "<div class=\"col s10 offset-s1\">" +
            "<p class=\"title\">" + res.items[i].snippet.title + "</p>" +
            "<i class=\"secondary-content material-icons small pink-text\" onclick=\"addtoQueue('" + res.items[i].id + "')\">add_to_queue</i>" +
            "</div>" +
            "</li>";
            id++;
        }
    }
})

//YouTube Search Function
function youtubeSearch(YouTubeKey, youtubeQuery, maxResults)
{
    let q = youtubeQuery.split(' ').join('+');
    let arrayRes = [];
    let id = 0;

    return fetch('https://www.googleapis.com/youtube/v3/search?part=snippet'
    + '&maxResults=' + maxResults
    + '&q=' + q
    + '&key=' + YouTubeKey,{
        method: 'get'
    })
    .then(res =>  res.json())
    .catch(error => console.log)
}

//Populate div with search results
document.getElementById("searchYoutube").onclick = function()
{
    let youtubeQuery = document.getElementById("youtubeQuery").value;
    console.log(youtubeQuery);

    youtubeSearch(YouTubeKey, youtubeQuery, 15).then(function(res) {

        let id = 0;
        console.log(res);
        document.getElementById("search-results").innerHTML = null;

        for(let i=0; i<15; i++)
        {
            if(res.items[i].id.kind === "youtube#video")
            {
              document.getElementById("search-results").innerHTML += 
              "<li id=\"" + res.items[0].id.videoId + "\" class=\"collection-item avatar\">" +
              "<img src=\"" + res.items[i].snippet.thumbnails.high.url + "\" alt=\"\" class=\"circle\" onclick=\"addtoqueue('" + res.items[i].id.videoId + "')\">" +
              "<div class=\"col s10 offset-s1\">" +
              "<p class=\"title\">" + res.items[i].snippet.title + "</p>" +
              "<i class=\"secondary-content material-icons small pink-text\" onclick=\"addtoQueue('" + res.items[i].id.videoId + "')\">add_to_queue</i>" +
              "</div>" +
              "</li>";
              id++;
            }
        }
    })
};

// Search for Playlist and show result on screen
document.getElementById("retrievePlaylist").onclick = function() 
{
  let playlistId = document.getElementById("importplaylist").value;
  console.log(playlistId);

  retrievePlaylistInfo(playlistId).then(function(res){
    console.log(res);

    document.getElementById("youtubePlaylist").innerHTML = null;

    document.getElementById("youtubePlaylist").innerHTML +=
    "<li class=\"collection-item avatar\">" +
    "<img src=\"" + res.items[0].snippet.thumbnails.high.url + "\" alt=\"\" class=\"circle\" onclick=\"addPlaylist('" + res.items[0].id + "','" + res.items[0].snippet.title + "')\">" +
    "<div class=\"col s10 offset-s1\">" +
    "<p class=\"title\">" + res.items[0].snippet.title + "</p>" +
    "<i class=\"secondary-content material-icons small pink-text\" onclick=\"addPlaylist('" + res.items[0].id + "','" + res.items[0].snippet.title + "')\">playlist_add</i>" +
    "</div>" +
    "</li>";
  })
}

// Function to add playlist tracks to song queue
function addPlaylist(playlistId, title)
{
  retrievePlaylistitems(playlistId).then(function(res){
      console.log(res);
      let id = 0;
      
      for(let i=0; i<50; i++)
      {
        addtoQueue(res.items[i].snippet.resourceId.videoId)
      }

  })

  playlistToast(title);
}

// Retrieve Playlist tracks
function retrievePlaylistitems(playlistId)
{
     return fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet'
    + '&maxResults=50'
    + '&playlistId=' + playlistId
    + '&key=' + YouTubeKey,{
      method: 'get'
    })
    .then(res =>  res.json())
    .catch(error => console.log(error))
}

// Retrieve Playlist Information
function retrievePlaylistInfo(playlistId)
{
  return fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet'
  + '&id=' + playlistId
  + '&key=' + YouTubeKey,{
    method: 'get'
  })
  .then(res =>  res.json())
  .catch(error => console.log(error))
}

function playnowToast(title)
{
  M.toast({html: 'Playing Now: ' + title, classes: 'rounded'});
}

function queueToast(title)
{
  M.toast({html: 'Added to Queue: ' + title, classes: 'rounded'});
}

function removeToast(title)
{
  M.toast({html: 'Removed from Queue', classes: 'rounded'});
}

function playlistToast(title)
{
  M.toast({html: 'Playlist added to song queue: ' + title, classes: 'rounded'});
}