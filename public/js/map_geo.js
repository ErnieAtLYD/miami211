
var geo;

function geocode(mapboxAccessToken, query){
	return $.ajax({
		url: 'https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(query) + '.json?access_token=' + mapboxAccessToken,
		context: document.body
	}).fail(function( jqXHR, textStatus ) {
		alert( "Request failed: " + textStatus );
	});
}

// Listen for "Near this location" to be selected
$("#address-input").on("click", function(event){
    $("#geo").prop("checked", true)
//	return false
})

$("#geo").change(function(){
    $("#address-input").toggleClass("geo-gray")
})

$("#find-me").on("click", function(event){
    $("#geo").prop("checked", true)
    if ($("#address-input").hasClass("geo-gray")) {
        $("#address-input").toggleClass("geo-gray")
    }
    $(this).trigger("geocode:get")
})

$("#downtown").change(function(){
    $("#address-input").toggleClass("geo-gray")
})

$(document).on("geocode:get", function (event) {
    if ($("#address-input").hasClass("geo-gray")){
        $("#address-input").val("")
    }
    if (navigator.geolocation) {
//        $("#address-input").toggleClass("geo-gray")
		navigator.geolocation.getCurrentPosition(function(position) {
			var locationMarker = null;
			if (locationMarker){
		 		// return if there is a locationMarker bug
		  		return;
			}
			// sets default position to your position
            lat = position.coords["latitude"];
			lng = position.coords["longitude"];	
			geo = [lat, lng];
			console.log(geo);
			$('input[name=lat]').val( lat );
			$('input[name=lng]').val( lng );

			var MAPBOX_TOKEN = 'pk.eyJ1IjoiZXJuaWVhdGx5ZCIsImEiOiJNcmFnemM0In0.gP2qLay9LMBD1mCyffesMw';
			geocode( MAPBOX_TOKEN, [lng, lat] ).done( function(data){
				$("#address-input").val( data.features[0].place_name )
//               
				$(event.target).prop('disabled', false);
			} );
				
		},function(error){
			console.log("Error: ", error)
		},{
			enableHighAccuracy: true
		});
	} else {
		geo = null;
	}
});


getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};


$(document).on("distance:display", function (event){
    let this_lat = getUrlParameter('lat')
    let this_lng = getUrlParameter("lng")
    if (this_lat === "") { this_lat = 25.7713 }
    if (this_lng === "") { this_lng = -80.1919 }
    if (event && $(event.target).attr("data-id")) {

		geo = [ parseFloat(this_lat), parseFloat(this_lng) ];
        console.log("test: " + geo)
		if (geo) {
//			console.log(geo);
			var from = geo;

			var to = [
				parseFloat($(event.target).attr("data-latitude")), 
				parseFloat($(event.target).attr("data-longitude"))];

			var distance = turf.distance(from, to, "miles");
			$(event.target).find('.distance').text( '(' + distance.toFixed(2) + ' miles)' );
            $(event.target).attr("data-distance", distance.toFixed(2));
		}

	}
});
