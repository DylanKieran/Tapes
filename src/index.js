//Function to retrieve top music videos from Ireland
function topIreland()
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

//Function to retrieve top music videos from Global
function topGlobal()
{
    return fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet'
    + '&maxResults=50'
    + '&chart=mostPopular' 
    + '&videoCategoryId=10'
    + '&key=' + "AIzaSyCDLBp4ecF3bkrq_rJWb47Gu9hdtw58YrU",{
        method: 'get'
    })
    .then(res =>  res.json())
    .catch(error => console.log(error))
}

//Function to retrieve top music videos from USA
function topUSA()
{
    return fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet'
    + '&maxResults=50'
    + '&chart=mostPopular' 
    + '&videoCategoryId=10'
    + '&regionCode=US'
    + '&key=' + "AIzaSyCDLBp4ecF3bkrq_rJWb47Gu9hdtw58YrU",{
        method: 'get'
    })
    .then(res =>  res.json())
    .catch(error => console.log(error))
}

//Function to retrieve top music videos from UK
function topUK()
{
    return fetch('https://www.googleapis.com/youtube/v3/videos?part=snippet'
    + '&maxResults=50'
    + '&chart=mostPopular' 
    + '&videoCategoryId=10'
    + '&regionCode=GB'
    + '&key=' + "AIzaSyCDLBp4ecF3bkrq_rJWb47Gu9hdtw58YrU",{
        method: 'get'
    })
    .then(res =>  res.json())
    .catch(error => console.log(error))
}

//Populate div with top songs 
topIreland().then(function(res) 
{
    console.log(res);
    document.getElementById("topIreland").innerHTML = null;

    for(let i=0; i<40; i++)
    {
        if(res.items[i].kind === "youtube#video")
        {
           document.getElementById("topIreland").innerHTML += 
            "<div class=\"col s3\">" +
                "<div class=\"card\">" +
                    "<div class=\"card-image\">" +
                        "<img src=\"" + res.items[i].snippet.thumbnails.high.url + "\" alt=\"\" onclick=\"window.location='http://localhost:8080/youtubeplayer.html#" + res.items[i].id + "'\" class=\"circle\">" +
                    "</div>" +
                    "<div class=\"card-content\">" +
                        "<h6 class=\"truncate\">" + (i+1) + ". " + res.items[i].snippet.title + "</h6>" +
                        "<br>" +
                    "</div>" +
                "</div>" +
            "</div>";
        }
    }
})

//Populate div with top songs 
topGlobal().then(function(res) 
{
    console.log(res);
    document.getElementById("topGlobal").innerHTML = null;

    for(let i=0; i<40; i++)
    {
        if(res.items[i].kind === "youtube#video")
        {
           document.getElementById("topGlobal").innerHTML += 
            "<div class=\"col s3\">" +
                "<div class=\"card\">" +
                    "<div class=\"card-image\">" +
                        "<img src=\"" + res.items[i].snippet.thumbnails.high.url + "\" alt=\"\" onclick=\"window.location='http://localhost:8080/youtubeplayer.html#" + res.items[i].id + "'\" class=\"circle\">" +
                    "</div>" +
                    "<div class=\"card-content\">" +
                        "<h6 class=\"truncate\">" + (i+1) + ". " + res.items[i].snippet.title + "</h6>" +
                        "<br>" +
                    "</div>" +
                "</div>" +
            "</div>";
        }
    }
})

//Populate div with top songs 
topUSA().then(function(res) 
{
    console.log(res);
    document.getElementById("topUSA").innerHTML = null;

    for(let i=0; i<40; i++)
    {
        if(res.items[i].kind === "youtube#video")
        {
           document.getElementById("topUSA").innerHTML += 
            "<div class=\"col s3\">" +
                "<div class=\"card\">" +
                    "<div class=\"card-image\">" +
                        "<img src=\"" + res.items[i].snippet.thumbnails.high.url + "\" alt=\"\" onclick=\"window.location='http://localhost:8080/youtubeplayer.html#" + res.items[i].id + "'\" class=\"circle\">" +
                    "</div>" +
                    "<div class=\"card-content\">" +
                        "<h6 class=\"truncate\">" + (i+1) + ". " + res.items[i].snippet.title + "</h6>" +
                        "<br>" +
                    "</div>" +
                "</div>" +
            "</div>";
        }
    }
})

//Populate div with top songs 
topUK().then(function(res) 
{
    console.log(res);
    document.getElementById("topUK").innerHTML = null;

    for(let i=0; i<40; i++)
    {
        if(res.items[i].kind === "youtube#video")
        {
           document.getElementById("topUK").innerHTML += 
            "<div class=\"col s3\">" +
                "<div class=\"card\">" +
                    "<div class=\"card-image\">" +
                        "<img src=\"" + res.items[i].snippet.thumbnails.high.url + "\" alt=\"\" onclick=\"window.location='http://localhost:8080/youtubeplayer.html#" + res.items[i].id + "'\" class=\"circle\">" +
                    "</div>" +
                    "<div class=\"card-content\">" +
                        "<h6 class=\"truncate\">" + (i+1) + ". " + res.items[i].snippet.title + "</h6>" +
                        "<br>" +
                    "</div>" +
                "</div>" +
            "</div>";
        }
    }
})