var map;
var marker;
var gc;

const init = () => {

	map = L.map('map', {
		center: [13.728785, 100.535729],
		zoom: 1,
		worldCopyJump: true //this is necessary for the wrapping effect to work
	}).setView([13.728785, 100.535729], 3);

	//load OpenStreetMap map tiles
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		osm = L.tileLayer(osmUrl, {attribution: osmAttrib, });
	osm.addTo(map);

	//create the marker
	marker = new L.marker(map.getCenter(),{
		draggable: true,
		autoPan: true 
	}).addTo(map)
	
	//initialize the circle object
	gc = new L.greatCircle(marker.getLatLng(), {
		radius: parseInt(document.getElementById("radius").value)*250,
	});
	gc.addTo(map); //add to map
	gc.bindTo(marker); //bind to marker
	
}

//just a little function to update the circle and caption
const changeSettings = () => {
	var newrad = parseInt(document.getElementById("radius").value);
	gc.setRadius(newrad*1000)
	document.getElementById("radiuskm").innerHTML = `LV: ${newrad/250}, ${newrad} km`
	// document.getElementById("markerlatlng").innerHTML = `${marker.getLatLng()}`
}

init()
changeSettings()

const toRadian = (degree) => {
    return degree*Math.PI/180;
}
const getDistance = (origin, destination) => {
    // return distance in meters
    var lon1 = toRadian(origin[1]),
        lat1 = toRadian(origin[0]),
        lon2 = toRadian(destination[1]),
        lat2 = toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS; //km
}

map.on('contextmenu', function(e) {
	var lat = e.latlng.lat.toFixed(6)
    var lng = e.latlng.lng.toFixed(6)
	const radius = parseInt(document.getElementById("radius").value)
	const agentLV = radius/250
	// console.log(agentLV)
	const distance = getDistance([map.getCenter().lat.toFixed(6), map.getCenter().lng.toFixed(6)], [lat, lng])
	// console.log(distance)
	const efficiency = Math.floor(1000 - distance/(5 * agentLV))/10
	if (distance > radius) {
		document.getElementById("efficiencyResult").innerText = `Cannot Calculate Efficiency, Out of Range`
	} else {
		document.getElementById("efficiencyResult").innerText = `${efficiency}%`
	}
})