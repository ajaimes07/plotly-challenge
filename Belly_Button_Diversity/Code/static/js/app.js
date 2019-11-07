function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
  var metadataURL = "/metadata/" + sample;
  // Use d3 to select the panel with id of `#sample-metadata`
  var panelMetadata = d3.select("#sample-metadata");
  // Use `.html("") to clear any existing metadata
  panelMetadata.html("");
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  d3.json(metadataURL).then(function (data) {
    Object.entries(data).forEach(([key, value]) => {
      panelMetadata.append("h5").text(`${key}: ${value}`);
    });
    function buildGauge(wfreq) {
      // Enter the washing frequency between 0 and 180
      var level = parseFloat(wfreq) * 20;
          // Trig to calc meter point
      var degrees = 180 - level;
      var radius = 0.5;
      var radians = (degrees * Math.PI) / 180;
      var x = radius * Math.cos(radians);
      var y = radius * Math.sin(radians);
          // Path: may have to change to create a better triangle
      var mainPath = "M -.0 -0.05 L .0 0.05 L ";
      var pathX = String(x);
      var space = " ";
      var pathY = String(y);
      var pathEnd = " Z";
      var path = mainPath.concat(pathX, space, pathY, pathEnd);
          var data = [
        {
          type: "scatter",
          x: [0],
          y: [0],
          marker: { size: 12, color: "850000" },
          showlegend: false,
          name: "Freq",
          text: level,
          hoverinfo: "text+name"
        },
        {
          values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
          rotation: 90,
          text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          textinfo: "text",
          textposition: "inside",
          marker: {
            colors: [
              "rgba(0, 105, 11, .5)",
              "rgba(10, 120, 22, .5)",
              "rgba(14, 127, 0, .5)",
              "rgba(110, 154, 22, .5)",
              "rgba(170, 202, 42, .5)",
              "rgba(202, 209, 95, .5)",
              "rgba(210, 206, 145, .5)",
              "rgba(232, 226, 202, .5)",
              "rgba(240, 230, 215, .5)",
              "rgba(255, 255, 255, 0)"
            ]
          },
          labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
          hoverinfo: "label",
          hole: 0.5,
          type: "pie",
          showlegend: false
        }
      ];
          var layout = {
        shapes: [
          {
            type: "path",
            path: path,
            fillcolor: "850000",
            line: {
              color: "850000"
            }
          }
        ],
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        height: 500,
        width: 500,
        xaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        },
        yaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
        }
      };
      var gauge = document.getElementById("gauge");
      Plotly.newPlot(gauge, data, layout);
    }
function buildCharts(sample) {
  // Use `d3.json` to fetch the sample data for the plots
  var chartsURL = "/samples/" + sample;
  d3.json(chartsURL).then((data) => {
    // Build a Bubble Chart using the sample data
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      text: data.otu_labels,
      marker: {
        color: data.otu_ids,
        size: data.sample_values,
        marker=dict(
          color=[120, 125, 130, 135, 140, 145],
          size=[15, 30, 55, 70, 90, 110],
          showscale=True
          )
        // colorscale: "Earth"
      }
    };
    var trace1 = [trace1];
    var layout = {
      title: "CHART: OTU ID",
      showlegend: true,
      height: 600,
      width: 1500
    };
    Plotly.newPlot("bubble", trace1, layout);
    
    // Build a Pie Chart
    // Use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var trace2 = [{
      values: data.sample_values.slice(0, 10),
      labels: data.otu_ids.slice(0, 10),
      hovertext: data.otu_labels.slice(0, 10),
      type: "pie",
      mode='markers',
      marker=dict(
          color=[120, 125, 130, 135, 140, 145],
          size=[15, 30, 55, 70, 90, 110],
          showscale=True
          )
      // marker: {
      //   colorscale: "Earth"
      // }
    }];
    var layout2 = {
      showlegend: true,
      height: 400,
      width: 500
    };
    Plotly.newPlot("pie", trace2, layout2);

  })
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
    console.log(firstSample)
  });
}
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}
// Initialize the dashboard
init();