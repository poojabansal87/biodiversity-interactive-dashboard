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
      meta.append("p"). text(key+": "+value);     
    });
    meta.style("font-size","12px")
        .style("font-weight","bold");
    // BONUS: Build the Gauge Chart
    buildGauge(sampleDict.WFREQ); 
  });
}

function buildGauge(wfreq) {
  // Using the value of wfreq
  var level = wfreq;

  // Trig to calc meter point
  var degrees = (9 - level)*20,
	radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
	 pathX = String(x),
	 space = ' ',
	 pathY = String(y),
	 pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
	marker: {size: 28, color:'850000'},
	showlegend: false,
	name: 'washes',
	text: level,
	hoverinfo: 'text+name'},
  { values: [50/9, 50/9, 50/9,50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
  rotation: 90,
  text: ['8-9', '7-8', '6-7', '5-6',
			'4-5', '3-4', '2-3','1-2','0-1',''],
  textinfo: 'text',
  textposition:'inside',	  
  marker: {colors:['rgba(30, 127, 0, .5)', 								'rgba(60, 140, 22, .5)',
						 'rgba(90, 150, 44, .5)',
						 'rgba(120, 160, 66, .5)',
						 'rgba(150, 170, 88, .5)',
						 'rgba(180, 180, 110, .5)',
						 'rgba(202, 190, 140, .5)',
						 'rgba(210, 206, 180, .5)', 							'rgba(232, 226, 202, .5)',
						 'rgba(255, 255, 255, 0)']},
  labels: ['8-9', '7-8', '6-7', '5-6',
			'4-5', '3-4', '2-3','1-2','0-1',''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per week',
  height: 500,
  width: 500,
  xaxis: {zeroline:false, showticklabels:false,
			 showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
			 showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);
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
        marker: {
          size: data.sample_values,
          // color: d3.scale
          //         .linear()
          //         .domain([0,d3.max(data.sample_values)])
          //         .range(["#50f442", "#f44141"])
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
    console.log(plotArray);
    var pieplot_data = [
      {
        values: plotArray.map(function(d,i){
          return d.value;
        }), 
        
        labels: plotArray.map(function(d,i){
          return d.id;
        }),
        type: 'pie', 
        hoverinfo: plotArray.map(function(d,i){
          return "("+d.id[i]+", "+d.value[i]+")"+d.label[i];
        })
      }
    ];
    var layout = {
      height: 500,
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
