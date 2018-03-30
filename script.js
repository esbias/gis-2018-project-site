// This isn't necessary but it keeps the editor from thinking L and carto are typos
/* global L, carto */

var map = L.map('map').setView([11,-7], 2);

// Add base layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
  maxZoom: 18
}).addTo(map);

// Initialize Carto
var client = new carto.Client({
  apiKey: 'apikey',
  username: 'ericbias'
});

// Initialze source data
var source = new carto.source.SQL("SELECT * FROM fop_simple");

// Create style for the data
var style = new carto.style.CartoCSS(`

#layer {
  polygon-fill: ramp([fop_status], (#efd551, #c42525, #60bc52, #cccccc, #cccccc), ("PF", "NF", "F", null), "=");
}

#layer::outline {
  line-width: 0.5;
  line-color: #FFFFFF;
  line-opacity: 0.5;
}

`);

// Add style to the data
var layer = new carto.layer.Layer(source, style);


// Add the data to the map as a layer
client.addLayer(layer);
client.getLeafletLayer().addTo(map);


/*
 * Listen for changes on the layer picker
 */

// Step 1: Find the dropdown by class. If you are using a different class, change this.
var layerPicker = document.querySelector('.layer-picker');

// Step 2: Add an event listener to the dropdown. We will run some code whenever the dropdown changes.
layerPicker.addEventListener('change', function (e) {
  // The value of the dropdown is in e.target.value when it changes
  var value = e.target.value;
  
  // Step 3: Decide on the SQL query to use and set it on the datasource
  if (value === 'all') {
    // If the value is "all" then we show all of the features, unfiltered
    source.setQuery("SELECT * FROM fop_simple");
  }
  else {
    // Else the value must be set to a life stage. Use it in an SQL query that will filter to that life stage.
    source.setQuery("SELECT * FROM fop_simple WHERE fop_status = '" + value + "'");
  }
  
  
  
  // Sometimes it helps to log messages, here we log the lifestage. You can see this if you open developer tools and look at the console.
  console.log('Dropdown changed to "' + value + '"');
});