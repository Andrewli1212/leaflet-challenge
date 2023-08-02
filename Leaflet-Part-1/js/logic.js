// URL to fetch earthquake data in GeoJSON format from the USGS API
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch earthquake data from the API using D3.js and call createFeatures function with the fetched data
d3.json(url).then(function(data) {
  console.log(data); // Display the fetched data in the browser console (optional)
  createFeatures(data.features); // Call the createFeatures function with the fetched data
});

// Function to determine the color based on earthquake depth
function color(depth) {
  switch (true) {
    case depth > 90:
      return 'red';
    case depth > 70:
      return 'pink';
    case depth > 50:
      return 'orange';
    case depth > 30:
      return 'lime';
    case depth > 10:
      return 'yellow';
    default:
      return 'green';
  }
}

// Function to create the earthquake features and add them to the map
function createFeatures(earthquakeData) {
  // Create a GeoJSON layer for the earthquakes
  let earthquakes = L.geoJSON(earthquakeData, {
    // Use a custom function to create circle markers for each earthquake
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag * 5, // Set circle radius based on earthquake magnitude
        fillColor: color(feature.geometry.coordinates[2]), // Set circle fill color based on earthquake depth
        color: "black", // Set circle border color
        weight: 1, // Set circle border weight
        fillOpacity: 0.5 // Set circle fill opacity
      });
    },
    // Function to bind a popup to each circle marker showing earthquake details
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<strong>${feature.properties.place}</strong><hr>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}</br>`);
    }
  });

  // Set up the Leaflet map
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create a Leaflet map object with the street map layer and the earthquake GeoJSON layer
  let myMap = L.map("map", {
    center: [40, -95], // Set the initial map center coordinates
    zoom: 5, // Set the initial map zoom level
    layers: [street, earthquakes] // Add the street map and earthquake GeoJSON layers to the map
  });

  // Add a legend to the map to represent the depth ranges with different colors
  let legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let depth = [-10, 10, 30, 50, 70, 90];

    // Iterate through the depth ranges and create the legend items with color swatches and depth values
    for (let i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<div class="legend-item" style=\'background-color:' + color(depth[i] + 1) + '\'></div> ' +
        depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap); // Add the legend to the map
}
