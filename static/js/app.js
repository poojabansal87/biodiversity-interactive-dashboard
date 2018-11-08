function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var metadataURL = "/metadata/" + sample;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(metadataURL).then((sampleDict) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.select("#sample-metadata").html("");
    var meta = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    meta.html = "";
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sampleDict).forEach(([key, value]) => {
      meta.append("p").text(key+" : "+value);     
    });
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampleDataUrl = "/samples/" + sample;
 // d3.select("#bubble").html("");

  // @TODO: Build a Bubble Chart using the sample data
  d3.json(sampleDataUrl).then(function(data) {
  
    // console.log(data.otu_ids);
    // console.log(data.otu_labels);
    // console.log(data.sample_values);
    
    var plot_data = [
      {
        x: data.otu_ids, 
        y: data.sample_values,
        type: 'scatter',
        mode: 'markers',
        markers: {
          size: data.sample_values
        },
        text: data.otu_ids.map(function(d,i){
          return "("+d+", "+data.sample_values[i]+")"+data.otu_labels[i];
        })
      }
    ];
    
    Plotly.newPlot("bubble", plot_data);
    
    var otuIds = data.otu_ids;
    var sampleValues = data.sample_values;
    var otuLabels = data.otu_labels;

    var newArray = [];
    for(var j=0;j<otuIds.length;j++){
      newArray.push({
        "id": otuIds[j],
        "value": sampleValues[j],
        "label": otuLabels[j] 
      });
    }
    newArray.sort(function(a,b) {
      return b.value-a.value;
    });
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var plotArray = newArray.slice(0,10);
    
    var pieplot_data = [
      {
        values: plotArray.map(function(d,i){
          return d.value;
        }), 
        type: 'pie',
        label: plotArray.map(function(d,i){
          return d.label;
        }), 
        // text: plotArray.map(function(d,i){
        //   return "("+d.id+", "+d.value+")"+d.label;
        // })
      }
    ];
    var layout = {
      height: 400,
      width: 500
    };
    Plotly.newPlot("pie", pieplot_data, layout);
    });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  //d3.select("#bubble").remove();
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// function sortArrays(sample) {
  
// }

// Initialize the dashboard
init();
