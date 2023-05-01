
// initialize variable for data file in .json format with d3
let data = d3.json("samples.json");
console.log(data);

// function that populates the metadata
function demoInfo(sample){
    

    // use d3.json to get the data
    d3.json("samples.json").then((data) => {
        // retrieve all metadata
        let metadata = data.metadata;
        
        // filter with sample value
        let result = metadata.filter(sampleResult => sampleResult.id == sample);

        // access index 0 from the array
        let resultData = result[0];

        // clear the metaData and html out
        d3.select("#sample-metadata").html("");

        // use Object.entries to get the value key pairs
        Object.entries(resultData).forEach(([key,value]) => {
            // add to the sample data demographics section
            d3.select("#sample-metadata")
                .append("h5").text(`${key}: ${value}`);
        });
    });
}

// function that builds the graphs
function buildBarChart(sample){

    d3.json("samples.json").then((data) => {
        // retrieve all sample data
        let sampleData = data.samples;
       
        
        // filter with sample value
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        
        
        // access index 0 from the array
        let resultData = result[0];
       

        // get the otu ids and labels
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
       

        // build bar chart
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`);
        let xValues = sample_values.slice(0,10);
        let textLabels = otu_labels.slice(0,10);
        

        let barChart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        }

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        Plotly.newPlot("bar", [barChart], layout);



    });
    
}

// function that builds the bubble chart
function buildBubbleChart(sample){


    d3.json("samples.json").then((data) => {
        // retrieve all sample data
        let sampleData = data.samples;
       
        
        // filter with sample value
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        
        
        // access index 0 from the array
        let resultData = result[0];
       

        // get the otu ids and labels
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
       

        // build bubble chart
        
        let bubbleChart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }

        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", [bubbleChart], layout);
    });
}

// function that initializes the dashboard
function initialize(){
    // load the data from the .json file

    // access the dropdown selector from the index.html file
    var select = d3.select("#selDataset");

    // use d3.json to get the data
    d3.json("samples.json").then((data) => {
        let sampleNames = data.names;  // made an array of just the names

        // use a for each to create options for each sample in selector
        sampleNames.forEach((sample) => {
            select.append("option")
                .text(sample)
                .property("value", sample);
        });
    // when initialized, pass in the information for the first sample
    let sample1 = sampleNames[0];

    // call function to build metadata
    demoInfo(sample1);
    // call function to build bar chart
    buildBarChart(sample1);
    // call function to build bubble chart
    buildBubbleChart(sample1);
    });
    
}
// function that updates the dashboard
function optionChanged(item){
    //console.log(item);
    demoInfo(item);
    // call function to build the bar chart
    buildBarChart(item);
    // call function to build the bubble chart
    buildBubbleChart(item);
}
// call the initialize function
initialize();
