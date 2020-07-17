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
        orientation: 'h'
      }
    ];

    // Aesthetics
    var barOptions = {
      margin: { t: 100, l: 150 },
      title: 'Top 10 Bacteria Cultures Found',
      titlefont:{ size: 28 },
      font: { size: 16 },
      margin: { t: 60 }
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
      titlefont:{ size: 28 },
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

// Building the Metadata Panel

function buildMetaData(sampleId) {

  // Fetching a sample of the metadata through D3.JSON
  d3.json('samples.json').then(data => {
    
    // Given the sampleId, use find to get the object that matches the id
    var userdata = data.samples.filter(obj => obj.id === sampleId)
    var user = userdata[0];

    // D3 to select `#sample-metadata`
    var metadata = d3.select('#sample-metadata');
  
    // HTML to clear any existing metadata
    metadata.html("")
  
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(user).forEach(([key, value]) => {

      metadata
      .append('panel-body')
      .text(`${key.toUpperCase()}: ${value} \n`);
  })
  });
  }
  
// Fetching new data each time a new sample is selected
function optionChanged(newSampleId) {
  buildCharts(newSampleId);
  buildMetaData(newSampleId);
}

// Initialize the dashboard
init()
