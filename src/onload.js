// On DOM load initiate Parallax and Tabs for Materialize
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.parallax');
    var instances = M.Parallax.init(elems);

    var tabs = document.querySelectorAll('.tabs')
    for (var i = 0; i < tabs.length; i++){
	    M.Tabs.init(tabs[i]);
    }

    var coll = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(coll);
});