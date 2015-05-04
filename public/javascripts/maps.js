function initialize() {
    var map;
    var bounds = new google.maps.LatLngBounds();


    mapOptions = ({
        scrollwheel: false,
        navigationControl: false,
        mapTypeControl: false,
        scaleControl: false,
        draggable: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    map.setTilt(45);


    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;

    // Loop through our array of markers & place each one on the map
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0],
            icon: '/images/markers/marker-'+markers[i][3]+'.png'
        });

        // Allow each marker to have an info window
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(makeInfoWindow(markers[i][4], markers[i][0], 12,32));
                infoWindow.open(map, marker);
            }
        })(marker, i));
        map.fitBounds(bounds);
    }

    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(14);
        google.maps.event.removeListener(boundsListener);
    });



    function makeInfoWindow(amount, locationName, startTime, endTime){
        return '<div class="info_content">' +
            '<h3>'+locationName+'</h3>' +
            '<p>&pound;'+amount+' was collected at '+locationName+' between '+makeTimeFromTimestamp(startTime)+' and '+
            makeTimeFromTimestamp(endTime)+'</p></div>';
    }

    function makeTimeFromTimestamp(timestamp){
        var a       = new Date(timestamp*1000);
        var months  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year    = a.getFullYear();
        var month   = months[a.getMonth()];
        var date    = a.getDate();
        var hour    = a.getHours();
        var min     = a.getMinutes();
        var sec     = a.getSeconds();
        var time    = date + ',' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
    }


}
google.maps.event.addDomListener(window, 'load', initialize);
