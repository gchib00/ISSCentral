//ISS Tracking API//


const iss_url = "https://api.wheretheiss.at/v1/satellites/25544" //iss api

const issIcon = L.icon({ 
    iconUrl: 'images/iss.svg',
    iconSize: [50, 32],
    iconAnchor: [25, 16],
});

//map layer for leafletjs:
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'; 
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';  
const tiles = L.tileLayer(tileUrl, { attribution });
//



let lng; let lat;

let mymap = L.map('issMap')
const marker = L.marker([0, 0], {icon: issIcon}).addTo(mymap)
tiles.addTo(mymap)
let firstRender = true;
let lockedView = false;

async function trackISS(){
	const response = await fetch(iss_url)
	const iss_data = await response.json()

	let {longitude, latitude, velocity} = iss_data

	lat = latitude;
	lng = longitude;
	marker.setLatLng([lat,lng])
	if (firstRender){
		mymap.setView([lat, lng], 4) //It will zoom the map on ISS
		firstRender = false
	}
	if (lockedView){
		mymap.setView([lat, lng]) //It will zoom the map on ISS and keep it locked onto ISS
	}


	document.getElementById("issVelocity").textContent = "Current Velocity: "+velocity.toFixed(2)+" km/h"
	document.getElementById("issLatitude").textContent = "Latitude: "+lat+"°"
	document.getElementById("issLongitude").textContent = "Longitude: "+lng+"°"
}


setInterval(function(){
	trackISS()
},2000)



// Stop logo.png drag

const logo = document.getElementById("logo")

logo.ondragstart = function() {return false}


//Locking view on ISS

const lockBtn = document.getElementById("lockBtn");

lockBtn.addEventListener("click", () => {
	if (!lockedView){
		lockBtn.textContent = "Dismiss lock-on"
		lockedView = true
	} else {
		lockBtn.textContent = "Enable lock-on"
		lockedView = false
	}
})