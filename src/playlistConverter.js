accessToken = "BQCRVJfCANBmrC-pTuCbt8HCcCw4K1OR_VtiGACLrgnMQdXaqrbP0-GaFQsDpi-pYYwZ0QVR4OhgjUnbc2EC_t0ee7R05xj9JCh40oOGiZ_eLkm7gt_GMDwYuMQLeH6_zQa8X1UNDPDv0RY6hiuy2SEuxWCLI2zod7aHZx1CTaPK1cm04tYCwpgcH_iKpth-3PJ7TEbnSIjVbVrdw8Ca2NBelZ-1cpCTweWoiVHVAcCeznrqV0ixMFciB6MuaAJRL-dj6WA9mGsXDTba_GYuP2zMaRM";

function returnUser()
{
    return fetch('https://api.spotify.com/v1/me',{
        method: 'get',
        headers: { 'Authorization': 'Bearer ' + accessToken},
    })
    .then(res =>  res.json())
    .then(function(res)
    {
        returnPlaylists(res.userid);
    });
}

function returnPlaylists(userid)
{
    console.log(userid);
}

