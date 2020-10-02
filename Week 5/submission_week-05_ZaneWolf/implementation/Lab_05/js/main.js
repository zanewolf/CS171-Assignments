
// SVG Size
// let width = 700,
// 	height = 500;

var margin = {
		top: 10,
		right: 25,
		bottom: 10,
		left: 25},
	width = 750 - margin.left - margin.right,
	height = 520 - margin.top - margin.bottom;

let svg = d3.select("#chartarea")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// let svg = d3.select("#chartarea")
// 	.append("svg")
// 	.attr("width", width)
// 	.attr("height", height);



// Load CSV file
d3.csv("data/wealth-health-2014.csv", row => {
	// height_m,height_ft,height_px,floors,completed - transform to numerical
	row.Income = +row.Income;
	row.LifeExpectancy = +row.LifeExpectancy;
	row.Population = +row.Population;
	return row;

}).then( data => {

	// Analyze the dataset in the web console
	console.log(data);
	let sortedData = data.sort(function(a,b){return d3.descending(a.Population, b.Population)})
	console.log(sortedData);

	drawChart(sortedData);


});

function drawChart(data){

	let padding = 30;

	// Add X Axis
	let incomeScale = d3.scaleLog()
		.domain([d3.min(data, d=>d.Income)-200, d3.max(data, d=>d.Income)+200])
		.range([padding, width-padding]);
	svg.append("g")
		.attr("transform", "translate(0," + (height-padding) + ")")
		.call(d3.axisBottom(incomeScale)
			.ticks(10, ",.1s"))
		.selectAll("text")
		.style("text-anchor", "middle");
	svg.append("text")
		.attr("class", "xlabel")
		.attr("transform","translate("+(width-padding)+","+(height-1.2*padding)+")")
		.style("text-anchor", "end")
		.text("Income per Person (GDP per Capita)")


	// Add Y Axis
	let lifeExpectancyScale = d3.scaleLinear()
		.domain([d3.min(data, d=>d.LifeExpectancy)-5, d3.max(data, d=>d.LifeExpectancy)+5])
		.range([height-padding,padding]);
	svg.append("g")
		.attr("transform", "translate("+padding+",0)")
		.attr("class", "yaxis")
		.call(d3.axisLeft(lifeExpectancyScale).ticks(5))
	svg.append("text")
		.attr("transform","rotate(-90)")
		.attr("class", "ylabel")
		// .attr("transform", "translate(15,"+height/2+")")
		.attr("y", 15+padding)
		.attr("x", -1.5*padding)
		.style("text-anchor", "end")
		.text("Life Expectancy (Years)")


	// Make Radius Scale
	let populationScale = d3.scaleLinear()
		.domain([d3.min(data, d=>d.Population), d3.max(data, d=>d.Population)])
		.range([4,30]);

	// Color Scale
	let colorScale = d3.scaleOrdinal(d3.schemeCategory10);



	//Make Circles
	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("class", "country_circ")
		.attr("cx", d => incomeScale(d.Income))
		.attr("cy", d => lifeExpectancyScale(d.LifeExpectancy))
		.attr("r", d => populationScale(d.Population))
		.attr("stroke", "#333")
		.attr("opacity", 0.7)
		.attr("fill", d => colorScale(d.Region))
		.on("mouseover", function(event,d){
			console.log(event,d,this);
		});


}

