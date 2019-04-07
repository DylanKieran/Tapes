//Populate div with top songs 
yttopSongsIE().then(function(res) 
{
    console.log(res);
    document.getElementById("topVideos").innerHTML = null;

    for(let i=0; i<40; i++)
    {
        if(res.items[i].kind === "youtube#video")
        {
           document.getElementById("topVideos").innerHTML += 
            "<div class=\"col s3\">" +
                "<div class=\"card\">" +
                    "<div class=\"card-image\">" +
                        "<img src=\"" + res.items[i].snippet.thumbnails.high.url + "\" alt=\"\" onclick=\"window.location='http://localhost:8080/youtubeplayer.html#" + res.items[i].id + "'\" class=\"circle\">" +
                    "</div>" +
                    "<div class=\"card-content\">" +
                        "<h5 class=\"truncate\">" + res.items[i].snippet.title + "</h5>" +
                    "</div>" +
                "</div>" +
            "</div>";
        }
    }
})

//Function to retrieve top songs
function yttopSongsIE()
{
    return fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet'
    + '&maxResults=50'
    + '&chart=mostPopular' 
    + '&videoCategoryId=10'
    + '&regionCode=IE'
    + '&key=' + "AIzaSyCDLBp4ecF3bkrq_rJWb47Gu9hdtw58YrU",{
        method: 'get'
    })
    .then(res =>  res.json())
    .catch(error => console.log(error))
}