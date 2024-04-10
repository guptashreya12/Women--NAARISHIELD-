// Initialize Leaflet map
const map = L.map('map');

// Add OpenStreetMap base layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Get user's location using Geolocation API
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        
        // Set the map view to the user's location
        map.setView([userLat, userLon], 15);

        // Perform a nearby search for police stations
        fetch(`https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="police"](around:5000,${userLat},${userLon});out;`)
            .then(response => response.json())
            .then(data => {
                // Process the search results
                data.elements.forEach(element => {
                    const marker = L.marker([element.lat, element.lon]).addTo(map);
                    marker.bindPopup(`<b>${element.tags.name || 'Police Station'}</b><br>${element.tags.addr:housenumber} ${element.tags.addr:street}`);
                });
            })
            .catch(error => {
                console.error(error);
            });
    }, error => {
        console.error('Error getting user location:', error);
    });
} else {
    console.error('Geolocation is not supported by this browser.');
}
