
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


// (1) Load CSV data
// 	(2) Convert strings to date objects
// 	(3) Create new bar chart objects
// 	(4) Create new area chart object

d3.csv("data/household_characteristics.csv"). then(csv=>{

	// prepare data
	// console.log(csv);
	csv.forEach(function(d){
		//caused errors in rollup, since Date objects aren't read correctly, it wants strings
		// will convert later
		d.survey = parseDate(d.survey);
	});

	// Store csv data in global variable
	data = csv;
	// console.log(data);

	// create the bar chart objects
	bar1 = new BarChart("bar1", data, 'ownrent');
	bar2 = new BarChart("bar2", data, 'electricity');
	bar3 = new BarChart("bar3", data, 'hohreligion');
	bar4 = new BarChart("bar4", data, 'latrine');

	// // console.log(data)/**/
	//
	// // TO-DO (Activity I): instantiate visualization objects
	areachart = new AreaChart("histogram-chart", data);

	//
	// // TO-DO (Activity I):  init visualizations
	// areachart.initVis();
	//
	// timechart = new Timeline("timeline", data.years);
	// timechart.initVis();


});


// React to 'brushed' event and update all bar charts
function brushed() {

	// Get the extent of the current brush
	let selectionRange = d3.brushSelection(d3.select(".brush").node());

	// console.log(selectionRange);
	// Convert the extent into the corresponding domain values
	let selectionDomain = selectionRange.map(areachart.xScale.invert);

	// console.log(areachart.xScale.invert(selectionRange[0]));;

	// I feel like there's a better way to do this but right now I'm too tired to actually remove the hardcoding
	// and implement it. probably something like moving the config variables to an array and then iterating through it (forEach),
	// creating a new barchart every time. and storing the names of the new barcharts in another object, so I could
	// call it here. And I could create the divs for the barcharts in the same function, rather than hardcode them
	// in the html so that if we decided to plot 3 or 6 variables, it wouldn't be an issue

	// bar1.x.domain(selectionDomain1)
	// console.log(selectionDomain[0]);
	// bar2.x.domain(selectionDomain2)
	// bar3.x.domain(selectionDomain3)
	// bar4.x.domain(selectionDomain4)
	// bar1.wrangleData();
	// bar2.wrangleData();
	// bar3.wrangleData();
	// bar4.wrangleData();
	bar1.selectionChanged(selectionDomain);
	bar2.selectionChanged(selectionDomain);
	bar3.selectionChanged(selectionDomain);
	bar4.selectionChanged(selectionDomain);


}
