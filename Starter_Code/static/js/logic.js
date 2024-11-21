// Creating the map object
var myMap = L.map("map", {
    center: [37.3846664428711, -122.478668212891],
    zoom: 6
  });
  
// Adding tile for mapbox
  // Adding the tile layer
  L.tileLayer('https://a.tiles.mapbox.com/v3/mapbox.world-bright/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
}).addTo(myMap);

  // Adding the tile layer for open street map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> <a href="https://labs.mapbox.com/contribute/">Improve this map</a>'
  }).addTo(myMap);

//   // Creating a new marker:
// // We pass in some initial options, and then add the marker to the map by using the addTo() method.
// var marker = L.marker([40.7128, -74.0059], {
//   draggable: true,
//   title: "My First Marker"
// }).addTo(myMap);

// // Binding a popup to our marker
// marker.bindPopup("Hello There!");
  
// Use this link to get the GeoJSON data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

function getDepthColor(depth) {
  return depth > 90 ? '#e03a22' :
         depth > 70 ? '#f56623' :
         depth > 50  ? '#f69332' :
         depth > 30 ? '#efc842' :
         depth > 10 ? '#d2e34c' :
                       '#a4d75b';
}


let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [-10, 10, 30, 50, 70, 90]; // Depth ranges
    let labels = [];

    // Loop through depth ranges and generate a label with a colored square
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getDepthColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

// Getting our GeoJSON data
d3.json(link).then(function(data) {

var features = data.features;

// console.log(features.length);

var markers = L.markerClusterGroup();

for(var i = 0; i < features.length; i++) {
  var location = features[i].geometry.coordinates;

  // console.log(location);
  // console.log(features[i].properties.title);

      // Check for the location property.
      if (location) {

        // // Add a new marker to the cluster group, and bind a popup.
        // markers.addLayer(L.marker([location[1], location[0]])
        //   // .bindPopup(features[i].properties.title));
        //   .bindPopup("Magnitude: " + features[i].properties.mag + 
        //     "<br />Place: : " + features[i].properties.place + 
        //     "<br />Time: " + new Date(features[i].properties.time).toLocaleString()));

            // Create circle marker options
        var circleMarkerOptions = {
          radius: features[i].properties.mag*5, // Size based on the location data
          fillColor: getDepthColor(location[2]), // Color based on the location data
          color: "#000", // Border color
          weight: 1, // Border weight
          opacity: 0.8, // Border opacity
          fillOpacity: 0.7 // Fill opacity
      }

        // Create the circle marker and add it to the map
      var circleMarker = L.circleMarker([location[1], location[0]], circleMarkerOptions).addTo(myMap);

        // Add a popup to each circle marker
      circleMarker.bindPopup("Magnitude: " + features[i].properties.mag + 
            "<br />Place: " + features[i].properties.place + 
            "<br />Depth: " + location[2] + "km" +
            "<br />Time: " + new Date(features[i].properties.time).toLocaleString());
      }
}

  // Creating a GeoJSON layer with the retrieved data
  // L.geoJson(data).addTo(myMap);

  myMap.addLayer(markers);
});