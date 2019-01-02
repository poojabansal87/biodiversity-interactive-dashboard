# biodiversity-interactive-dashboard
Belly Button Biodiversity

## Background

In this project, an interactive dashboard is built to explore the [Belly Button Biodiversity DataSet](http://robdunnlab.com/projects/belly-button-biodiversity/).

The dashboard can be accessed on Heroku at (https://belly-button-biodiv.herokuapp.com/)

## Technical Details

* Used Plotly.js to build interactive charts for dashboard.

* Created a PIE chart that uses data from samples route (`/samples/<sample>`) to display the top 10 samples.

* Created a Bubble Chart that uses data from samples route (`/samples/<sample>`) to display each sample.

  * Used `otu_ids` for the x values and marker colors, `sample_values` for the y values

  * Used `sample_values` for the marker size

  * Used `otu_labels` for the text values

* Displayed the sample metadata from the route `/metadata/<sample>` with each key/value pair from the metadata JSON object

* Used `Flask API` to serve the data needed for each plot.

* All of the plots are updated any time that a new sample is selected.

* Adapted the Gauge Chart from <https://plot.ly/javascript/gauge-charts/> to plot the Weekly Washing Frequency obtained from the route `/wfreq/<sample>`

![Weekly Washing Frequency Gauge](Images/gauge.png)

