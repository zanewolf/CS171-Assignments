
// SVG drawing area

let margin = {top: 40, right: 40, bottom: 60, left: 30};

let width = 650 - margin.left - margin.right,
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

var gRange = d3
	.select('div#slider-range')
	.attr("class", "gRange")
	.append('svg')
	.attr('width', 500)
	.attr('height', 100)
	.append('g')
	.attr('transform', 'translate(30,30)');


// Initialize data
loadData();

// FIFA world cup
let data;

// define initial variables
var newDates = [new Date(-1262286000000), new Date( 1388552400000)]
var selectedVariable;
var selectedLabel;

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

	let newData = data.map(function(d){return {name: d.EDITION, date: d.YEAR, value: d[selectedVariable], winner: d.WINNER, matches: d.MATCHES, attend: d.AVERAGE_ATTENDANCE, avggoals: d.AVERAGE_GOALS, teams:d.TEAMS, goals: d.GOALS }});
	console.log(newData);
	// filter data set and redraw plot
	var  selectedData = newData.filter(function(d) {
		return ((d.date >= newDates[0]) && (d.date <= newDates[1]))
	})
	console.log(newData);
	let padding = 30;

	// define Slider

	//This took me 6 hours to get the slider to work. It shouldn't have taken 6 hours. Idk why it wasn't working, and then idk why it started. Which I know is normal, but regardless, fuck this slider.
	var sliderRange=d3
		.sliderBottom()
		.width(400)
		.tickFormat(d3.timeFormat("%Y"))
		.step(1000*60*60*24*365.25*4)
		.min(d3.min(newData, d=>d.date))
		.max(d3.max(newData, d=>d.date))
		.ticks(8)
		.default([d3.min(newData, d=>d.date),d3.max(newData, d=>d.date)])
		.fill('#C3FF0B')
		.on('onchange', function(val) {
			newDates=[new Date(val[0]), new Date(val[1])];
			console.log(val)
			d3.select('p#startdate').text(val.map(d3.timeFormat("%Y")).join("-"));
			updateVisualization(selectedVariable, selectedLabel, newDates);
		});

	gRange.call(sliderRange);


	d3.select('p#value-range')
		.text(
			sliderRange
				.value()
				.map(d3.format('.2%'))
				.join('-'))
		.style("font", "25pt");


	// define X scale
	x.domain([d3.min(newDates), d3.max(newDates)])

	// define Y scale
	y.domain([d3.min(selectedData, d=> d.value), d3.max(selectedData, d=>d.value)]);

	// define tooltip
	var tooltip = d3.select("body")
		.append("div")
		.attr('class', 'tooltip')
		.style("position", "absolute")
		.style("visibility", "hidden")
		.style("opacity", 0.9);

	// define line
	let line = svg.selectAll(".line")
		.data(selectedData);

	line
		.enter()
		.append("path")
		.merge(line)
		.datum(selectedData)
		.transition()
		.duration(transtime)
		.attr("class", "line")
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
		.on("click", function(event,d){
			console.log(d)
			showEdition(d)
		})
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
		})
		.merge(circles)
		.transition()
		.duration(transtime)
		.attr("class", "dot")
		.attr("cx", d=>x(d.date))
		.attr("cy", d=>y(d.value))
		.attr("r", 5)

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
	document.getElementById('fifayear').innerHTML = d.name;
	document.getElementById("fifawinner").innerHTML = d.winner;
	document.getElementById("fifagoals").innerHTML = d.goals;
	document.getElementById("fifaavggoals").innerHTML = d.avggoals;
	document.getElementById("fifamatches").innerHTML = d.matches;
	document.getElementById("fifateams").innerHTML = d.teams;
	document.getElementById("fifaattend").innerHTML = d.attend;

}




