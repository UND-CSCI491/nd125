$('#map,#narrative').css({
    'height': $(window).height()-50
});

// insert spinner for now
var opts = {
    lines: 13, // The number of lines to draw
    length: 20, // The length of each line
    width: 10, // The line thickness
    radius: 30, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '25%' // Left position relative to parent
};
var target = document.getElementById('map');
var spinner = new Spinner(opts).spin(target);

var worker = cw(function(base,cb){
    importScripts('/js/shp.min.js');
    shp(base).then(cb);
});

//worker can be called multiple times
worker.data(cw.makeUrl('/maps/nd_counties.zip')).then(function(data){
    spinner.stop();
    var map = L.map('map').setView([47, -97.5], 7.5);
    var myStyle = {
        "color": "#ff0000",
        "weight": 5,
        "opacity": 0.65
    };
  
    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.NAME) {
            layer.bindPopup(feature.properties.NAME);
        }
    }

    L.geoJson(data.features, {
        style: myStyle,
        onEachFeature: onEachFeature
    }).addTo(map);
    console.log(data.features);
});

$('#slider').click(function() {
    if ($(this).hasClass('expanded')) {
        $('#narrative').animate({width: 70});
        $(this).removeClass('expanded').find('i').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');
        $('#content').hide();
    }
    else {
        $('#content').show();
        $('#narrative').animate({width: 700});
        $(this).addClass('expanded').find('i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-left');
    }
});
