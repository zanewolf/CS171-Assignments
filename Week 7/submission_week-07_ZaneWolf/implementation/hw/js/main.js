// Bar chart configurations: data keys and chart titles
let configs = [
	{ key: "ownrent", title: "Own or Rent" },
	{ key: "electricity", title: "Electricity" },
	{ key: "latrine", title: "Latrine" },
	{ key: "hohreligion", title: "Religion" }
];


// Initialize variables to save the charts later
let barcharts = [];
let areachart;



// Date parser to convert strings to date objects
var parseDate = d3.timeParse("%Y-%m-%d");

d3.csv("data/household_characteristics.csv"). then(csv=>{

	csv.forEach(function(d){
		d.survey = parseDate(d.survey);
	});

	// Store csv data in global variable
	data = csv;

	// create the bar chart objects
	configs.forEach(function(d,i){
		barname = "bar_"+configs[i].key;
		label = "bar"+i;
		barcharts[i]=new BarChart(label, data, configs[i].key, configs[i].title);
	});

	areachart = new AreaChart("histogram-chart", data);
});



// React to 'brushed' event and update all bar charts
function brushed() {

	// Get the extent of the current brush
	let selectionRange = d3.brushSelection(d3.select(".brush").node());


	// Convert the extent into the corresponding domain values
	let selectionDomain = selectionRange.map(areachart.xScale.invert);

	// redraw barcharts
	barcharts.forEach(d=>d.selectionChanged(selectionDomain));



}

// Redraw based on the new size whenever the browser window is resized.
window.addEventListener("resize", function(d){
	areahart.initVis()
	barcharts.forEach(d=>d.initVis())
});