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
          height: '200',
          width: '200',
          videoId: 'WILNIXZr2oc',
          events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError
          }
        });
      }

      document.getElementById("video").onclick = function(){
        player.loadVideoById({'videoId': 'cwQgjq0mCdE',
        'startSeconds': 5,
        'suggestedQuality': 'large'});
      }

      //The API will call this function when the video player is ready.
      function onPlayerReady(event) {
        event.target.playVideo();
      }

      function onPlayerError(e){
          //code 2 = invalid parameter in the request
          //code 5 = html5 player error
          //code 100 = removed video or private video
          //code 101 = embedding video is not allowed
          //code 150 = same as 101
          console.log('error has occured' + e.data);
      }


//Function to retrieve top songs
function topSongs(YouTubeKey)
{
    return fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet'
    + '&maxResults=10'
    + '&chart=mostPopular' 
    + '&videoCategoryId=10'
    + '&regionCode=IE'
    + '&key=' + YouTubeKey,{
        method: 'get'
    })
    .then(res =>  res.json())
    .catch(error => console.log(error))
}

//Populate div with top songs 
topSongs(YouTubeKey).then(function(res) {

    let id = 0;
    console.log(res);
    document.getElementById("TopSongs").innerHTML = null;

    for(let i=0; i<10; i++)
    {
        if(res.items[i].kind === "youtube#video")
        {
           document.getElementById("TopSongs").innerHTML += 
            "<div class=\"result\"id=\"item" + i + "\">" 
            + "<img class=\"thumbnail\"id=\"thumbnail" + id + "\"" + "src=\""
            + res.items[i].snippet.thumbnails.default.url + 
            "\"" + "onclick=\"addtoqueue('" + res.items[i].id + "')\">" 
            + "<h1>"+ res.items[i].snippet.title + "</h1>"
            + "</div>";
            id++;
        }
    }
})

function addtoqueue(videoid)
{
    player.cueVideoById({'videoId': videoid,
        'startSeconds':5});
    player.playVideo();
}