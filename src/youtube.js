//Youtube 
let YouTubeKey = 'AIzaSyCDLBp4ecF3bkrq_rJWb47Gu9hdtw58YrU';

let accessToken = localStorage.getItem('accessToken');

document.getElementById("back").href = "http://localhost:8081/?access_token=" + accessToken;

console.log(YouTubeKey);

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
            "\"" + "onclick=\"playYoutube('" + res.items[i].id + "')\">" 
            + "<h1>"+ res.items[i].snippet.title + "</h1>"
            + "</div>";
            id++;
        }
    }
})

//Add video to player div
window.playYoutube = function(videoId)
{
    document.getElementById("player").innerHTML = null

    document.getElementById("player").innerHTML = "<iframe class=\"youtubePlayer\"" +
    "src=\"https://www.youtube.com/embed/" + videoId + "?autoplay=1\">" +
    "</iframe>";
}


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
        document.getElementById("youtubeResults").innerHTML = null;

        for(let i=0; i<15; i++)
        {
            if(res.items[i].id.kind === "youtube#video")
            {
               document.getElementById("youtubeResults").innerHTML += 
                "<div class=\"result\"id=\"item" + i + "\">" 
                + "<img class=\"thumbnail\"id=\"thumbnail" + id + "\"" + "src=\""
                + res.items[i].snippet.thumbnails.default.url + 
                "\"" + "onclick=\"playYoutube('" + res.items[i].id.videoId + "')\">" 
                + "<h1>"+ res.items[i].snippet.title + "</h1>"
                + "</div>";
                id++;
            }
        }
    })
};