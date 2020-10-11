
// SVG drawing area

let margin = {top: 40, right: 40, bottom: 60, left: 60};

let width = 700 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

let svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Date parser
let formatDate = d3.timeFormat("%Y");
let parseDate = d3.timeParse("%Y");


// define X scale
let padding = 30;
let x = d3.scaleTime()
	.range([padding, width - padding]);


// define Y scale
let y = d3.scaleLinear()
	.range([height-padding, padding]);
var xAxis = svg.append("g")
	.attr("transform", "translate(0," + height + ")")
	.attr("class", 'xaxis');
var yAxis = svg.append("g")
	.attr("class", 'yaxis');

//define magic numbers
var transtime = 800;

var sliderRange= d3
		.sliderBottom()
		.width(400);
var gRange = d3
	.select('div#slider-range')
	.append('svg')
	.attr('width', 500)
	.attr('height', 100)
	.append('g')
	.attr('transform', 'translate(30,30)');


// Initialize data
loadData();

// FIFA world cup
let data;

var newDates = [1930,2014];
var selectedVariable;
var selectedLabel;
toggle = false;


// Load CSV file
function loadData() {
	d3.csv("data/fifa-world-cup.csv").then(function(csv) {

		csv.forEach(function(d){
			// Convert string to 'date object'
			d.YEAR = +parseDate(d.YEAR);
			
			// Convert numeric values to 'numbers'
			d.TEAMS = +d.TEAMS;
			d.MATCHES = +d.MATCHES;
			d.GOALS = +d.GOALS;
			d.AVERAGE_GOALS = +d.AVERAGE_GOALS;
			d.AVERAGE_ATTENDANCE = +d.AVERAGE_ATTENDANCE;
		});

		// Store csv data in global variable
		data = csv;

		// Draw the visualization for the first time



		updateVisualization("GOALS", "Goals", newDates);

	});
}


// Render visualization
function updateVisualization(selectedVariable, selectedLabel, newDates) {

	let selectedData = data.map(function(d){return {name: d.EDITION, date: d.YEAR, value: d[selectedVariable]}});
	console.log(selectedData);
	let padding = 30;

	// define Slider

	//I couldn't get this quite right and at this point, I've been working on it for 5 hours. I'm done.
	sliderRange
		.tickFormat(d3.timeFormat("%Y"))
		.step(1000*60*60*24*366*4)
		.min(d3.min(selectedData, d=>d.date))
		.max(d3.max(selectedData, d=>d.date))
		.default([d3.min(selectedData, d=>d.date),d3.max(selectedData, d=>d.date)])
		.fill('#2196f3')
		.on('onchange', function(val){
			newDates = val.map(d3.timeFormat("%Y")).join(",").split(",").map(Number);
			d3.select('p#startdate').text(val.map(d3.timeFormat("%Y")).join("-"));
			// updateVisualization(selectedVariable, selectedLabel, newDates);
			// calling this messed up both how the scale was drawn (the fill wouldn't track the max slider) and the graph went all to hell. Oh well.
		});

	gRange.call(sliderRange);


	// define X scale
	// console.log(typeof d3.min(newDates));
	// x.domain([newDates[0], newDates[1]]);
	x.domain([d3.min(selectedData, d=>d.date), d3.max(selectedData, d=>d.date)])
	// console.log(x(1974));


	// define Y scale
	y.domain([d3.min(selectedData, d=> d.value), d3.max(selectedData, d=>d.value)]);

	// define slider

	var tooltip = d3.select("body")
		.append("div")
		.attr('class', 'tooltip')
		.style("position", "absolute")
		.style("visibility", "hidden")
		.style("opacity", 0.9);


	// d3.select('p#start-range').text(
	// 	sliderRange
	// 		.value()
	// 		.join('-')
	// );


	// define line
	let line = svg.selectAll(".line")
		.data(selectedData);

	line
		.enter()
		.append("path")
		.merge(line)
		.datum(selectedData)
		.attr("class", "line")
		.transition()
		.duration(transtime)
		.attr("d", d3.line()
			.x(d=> x(d.date))
			.y(d=> y(d.value))
		);

	line.exit().remove();

	// update x axis
	svg.selectAll('.xaxis')
		.call(d3.axisBottom(x));

	// update y axis
	svg.selectAll('.yaxis')
		.transition()
		.duration(transtime)
		.call(d3.axisLeft(y));

	// define circles
	let circles = svg.selectAll("circle")
		.data(selectedData);

	// update circles
	circles
		.enter()
		.append("circle")
		.data(selectedData)
		.merge(circles)
		.transition()
		.duration(transtime)
		.attr("class", "dot")
		.attr("cx", d=>x(d.date))
		.attr("cy", d=>y(d.value))
		.attr("r", 5);

	circles
		.on("mouseover", function(){return tooltip.style("visibility", "visible");})
		.on('mousemove', function(event,d) {
			tooltip.transition()
				.delay(30)
				.duration(200)
				.style("opacity", 1);


			return tooltip.html(d.name+"<br>" + selectedLabel + ":  "+d.value)
				.style("top", (event.pageY)-50+"px")
				.style("left", (event.pageX)+25+"px")
		})
		.on("mouseout", function(){return tooltip.style("visibility", "hidden");
		});



	circles.exit().remove();


	d3.select("#var-type").on("change", function(){
		var newVar = d3.select("#var-type").property("value");
		// I spent way too much over this
		var newLabel = d3.select("#"+newVar).property("label");
		updateVisualization(newVar, newLabel, newDates);
	});

}

// Show details for a specific FIFA World Cup
function showEdition(d){
	
}



