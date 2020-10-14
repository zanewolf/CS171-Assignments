
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
let parseDate = d3.timeParse("%Y-%m-%d");


// (1) Load CSV data
// 	(2) Convert strings to date objects
// 	(3) Create new bar chart objects
// 	(4) Create new area chart object

d3.csv("data/household_characteristics.csv"). then(csv=>{

	// prepare data
	console.log(csv);
	csv.forEach(function(d){
		d.survey = parseDate(d.survey);
	});

	// Store csv data in global variable
	data = csv;
	console.log(data);

	// create the bar chart objects
	bar1 = new BarChart("bar1", data, 'ownrent');
	bar2 = new BarChart("bar2", data, 'electricity');
	bar3 = new BarChart("bar3", data, 'hohreligion');
	bar4 = new BarChart("bar4", data, 'latrine');

	bar1.initVis();
	bar2.initVis();
	bar3.initVis();
	bar4.initVis();

	// // console.log(data)/**/
	//
	// // TO-DO (Activity I): instantiate visualization objects
	// areachart = new StackedAreaChart("stacked-area-chart", data.layers);
	// // console.log(something)
	// // console.log(data.layers)
	//
	// // TO-DO (Activity I):  init visualizations
	// areachart.initVis();
	//
	// timechart = new Timeline("timeline", data.years);
	// timechart.initVis();


});


// React to 'brushed' event and update all bar charts
function brushed() {
	
	// * TO-DO *

}
