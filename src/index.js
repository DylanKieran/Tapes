// On DOM load initiate Parallax and Tabs for Materialize
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.parallax');
    var instances = M.Parallax.init(elems);

    var tabs = document.querySelectorAll('.tabs')
    for (var i = 0; i < tabs.length; i++){
	    M.Tabs.init(tabs[i]);
    }
});

// Redo this API Key part
LastFMKey = "dbde17b3ffb13c8656d3d2bc5e6ee583";

// Function that retrieves Top Artists from LastFM
function getTopArtists()
{
  url = "http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=" + LastFMKey + "&format=json";
}

// Function that retrieves Top Songs from LastFM
function getTopSongs()
{
 url = "http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=" + LastFMKey + "&format=json";
}

// Function that retrieves Top Albums per Artist from LastFM
function getTopAlbums(artist)
{
  url = "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" + artist + "&api_key=" + LastFMKey + "&format=json";
}