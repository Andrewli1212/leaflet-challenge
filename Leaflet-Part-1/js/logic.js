let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

d3.json(url).then(function (data) {
  console.log(data);
  createFeatures(data.features);
});

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

function createFeatures(earthquakeData) {

  let earthquakes = L.geoJSON(earthquakeData, {

    pointToLayer: function (feature, direction) {
      return L.circleMarker(direction, {
        radius: feature.properties.mag * 5, 
        fillColor: color(feature.geometry.coordinates[2]), 
        color: "black", 
        weight: 1, 
        fillOpacity: 0.5 
      });
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup(`<strong>${feature.properties.place}</strong><hr>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}</br>`);
    }
  });

  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let myMap = L.map("map", {
    center: [40, -95],
    zoom: 5,
    layers: [street, earthquakes] 
  });

  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    let depth = [-10, 10, 30, 50, 70, 90];

    for (let i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<div class="legend-item" style=\'background-color:' + color(depth[i] + 1) + '\'></div> ' +
        depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap); 
}
