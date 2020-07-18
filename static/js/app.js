// Building the requested Charts

function buildCharts(sampleId) {
  d3.json('samples.json').then(data => {
    // Given the sampleId, use find to get the object that matches the id
    var user = data.samples.find(obj => obj.id === sampleId)

    // Variable definitions for the Charts 

    // x values - sample values
    var xVals = user.sample_values.slice(0, 10)
    // y values - otu ids
    var yVals = user.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`)
    // hovers - otu labels
    var hovers = user.otu_labels.slice(0, 10)
    // size of sample values
    var size = user.sample_values.slice(0, 10)
    // color of samples 
    var color = user.otu_ids.slice(0, 10)

    // Build Bar Chart

    var barTrace = [
      {
        x: xVals,
        y: yVals,
        text: hovers,
        type: 'bar',
        orientation: 'h',
        marker: {
          color: 'green',
          opacity: 0.7
        }
      }
    ];

    // Aesthetics
    var barOptions = {
      width: 800,
      height: 600,
      margin: { t: 200, l: 10, r: 10 },
      title: 'Top 10 Bacteria Cultures Found',
      titlefont: { size: 28 },
      font: { size: 16 },
      margin: { t: 60, l: 80 },
      bargap: 0.25
    };
    Plotly.newPlot('bar', barTrace, barOptions)

    // Build Bubble Chart

    var bubbleTrace = [
      {
        x: yVals,
        y: xVals,
        text: hovers,
        mode: "markers",
        marker: {
          size: size,
          color: color
        }
      }
    ];

    // Aesthetics
    var bubbleOptions = {
      margin: { t: 20, l: 400 },
      height: 600,
      title: 'Bacteria Cultures per Sample',
      hovermode: 'closest',
      titlefont: { size: 28 },
      font: { size: 15 },
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'OTU Samples' },
      margin: { t: 60 }
    };

    Plotly.newPlot('bubble', bubbleTrace, bubbleOptions)

  })
}


// Dropdown Menu

function init() {
  d3.json('samples.json').then(data => {
    var option = d3

      // selecting reference to the dropdown menu

      .select('#selDataset')
      .selectAll('option')
      .data(data.samples)
      .enter()
      .append('option')
      .text(d => d.id)

    // Build initial plots from the first sample
    buildCharts(data.samples[0].id)
  })
}

// Build Metadata Panel

function buildMetaData(sampleId) {

  // Fetching a sample of the metadata through D3.JSON
  d3.json('samples.json').then(data => {

    // Given the sampleId, use find to get the object that matches the id
    var userdata = data.metadata.filter(obj1 => obj1.id == sampleId)
    var user = userdata[0];

    // D3 to select `#sample-metadata`
    var demo = d3.select('#sample-metadata');

    // HTML to clear any existing metadata
    demo.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(user).forEach(([key, value]) => {

      demo
        .append('panel-body')
        .text(`${key.toUpperCase()}: ${value} \n`);
    })
  });
}


/////     BONUS       //////

// Build Gauge Chart

function buildGauge(wfreq) {
  
  // Trigonometry to compute meter point
  var level = parseFloat(wfreq) * 20;
  var degrees = 180 - level, radius = .5;
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path
  var mainPath = 'M -.0 -0.035 L .0 0.035 L ';
  var pathX = String(x);
  var space = ' ';
  var pathY = String(y);
  var pathEnd = ' Z';
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var gaugeData = [{
    type: 'scatter',
    x: [0],
    y: [0],
    marker: { size: 24, color: 'grey' },
    showlegend: false,
    name: 'Freq indicator',
    text: level,
    hoverinfo: 'text+name'
  },
  {
    values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
    rotation: 90,
    text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    textinfo: 'text',
    textposition: 'inside',
    marker: {
      colors: [
        'rgba(119, 170, 221, .5)',
        'rgba(153, 221, 255, .5)',
        'rgba(68, 187, 153, .5)',
        'rgba(187, 204, 51, .5)',
        'rgba(170, 170, 0, .5)',
        'rgba(238, 221, 136, .5)',
        'rgba(238, 136, 102, .5)',
        'rgba(255, 170, 187, .5)',
        'rgba(221, 221, 221, .5)',
        'rgba(255, 255, 255, 0)'
      ]
    },
    labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  // Layout object

  var gaugeLayout = {
    shapes: [{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000',
      }
    }
    ],
    title: 'Belly Button Washing Frequency per Week',
    height: 800,
    width: 800,
    xaxis: { 
      type: 'category', 
      zeroline: false, 
      showticklabels: false,
      showgrid: false, 
      range: [-1, 1]
    },
    yaxis: {
      type: 'category', 
      zeroline: false, 
      showticklabels: false,
      showgrid: false, 
      range: [-1, 1]
    },
    titlefont: { size: 28 },
    font: { size: 15 },
  };

  // Plot
  Plotly.newPlot('gauge', gaugeData, gaugeLayout)

}

// Fetching new data each time a new sample is selected
function optionChanged(newSampleId) {
  buildCharts(newSampleId);
  buildMetaData(newSampleId);
  buildGauge(newSampleId);
}

// Initialize the dashboard
init()
