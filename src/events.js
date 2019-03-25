eventkey = "virS07Ql6mmEjqnO3iN8MJTsAjjLPPX8";

function returnEvents()
{
    return fetch('https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&dmaId=608&sort=relevance,desc&selection=standard&size=80&apikey='
    + eventkey
    )
    .then(res =>  res.json())
    .catch(error => console.log(error))
}

returnEvents().then(function(res)
{
    console.log(res);
    document.getElementById("event-list").innerHTML = null;
    let id=0;
    let date1 = "";

    for(let i=0; i<50; i++)
    {
        if(res._embedded.events[i].name.includes('Vip') || res._embedded.events[i].name.includes('Platinum') || res._embedded.events[i].name.includes('VIP'))
        {
            id++;
        }
        else
        {
            console.log(res._embedded.events[i].name);

            date1 = new Date(res._embedded.events[i].dates.start.dateTime);
            console.log(res._embedded.events[i].dates.start.dateTime)

            document.getElementById("event-list").innerHTML += 
            "<li class=\"collection-item avatar\">" +
            "<img src=\"" + res._embedded.events[i].images[7].url + "\" alt=\"\" class=\"circle\">" +
            "<div class=\"col s12 offset-s1\">" +
            "<span class=\"title\">" + res._embedded.events[i].name + "</span>" +
            "<p class=\"truncate title\">" + date1 + "<br></p>" +
            "</p>" + res._embedded.events[i]._embedded.venues[0].name +
            "<a href=\"" + res._embedded.events[i].url + "\"class=\"secondary-content pink waves-effect waves-light btn\"><i class=\"material-icons left\">event</i>Book</a>"
            "</div>" +
            "</li>";
            id++;
        }
    }
})