
/*
 * AreaChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the area chart
 * @param _data						-- the dataset 'household characteristics'
 */



class AreaChart {

	constructor(parentElement, data) {
		this.parentElement = parentElement;
		this.data = data;
		this.displayData = [];

		this.initVis();

	}


	/*
	 * Initialize visualization (static content; e.g. SVG area, axes, brush component)
	 */

	initVis() {
		let vis = this;

		vis.margin = {top: 100, right: 5, bottom:5, left: 50};

		vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
		vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;
		// vis.width = 800 - vis.margin.left - vis.margin.right;
		// vis.height = 600 - vis.margin.top - vis.margin.bottom;



		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		// Scales and axes
		// vis.x = d3.scaleTime()
		// 	.range([0, vis.width]);

		// Initialize time scale (x-axis)
		vis.xScale = d3.scaleTime()
			.range([0, vis.width])
			.domain(d3.extent(vis.data, function(d) { return d.key; }));

		vis.y = d3.scaleLinear()
			.range([vis.height, 0]);

		vis.xAxis = d3.axisBottom()
			.scale(vis.xScale);

		vis.yAxis = d3.axisLeft()
			.scale(vis.y);

		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")");

		vis.svg.append("g")
			.attr("class", "y-axis axis");

		vis.area = d3.area()
			.curve(d3.curveCardinal)
			.x(d=>vis.xScale(d.key))
			.y0(vis.height)
			.y1(d=>vis.y(d.value));

		// Initialize brush component
		vis.brush = d3.brushX()
			.extent([[0, 0], [vis.width, vis.height]])
			.on("brush", brushed);

		// console.log(xScale(new Date("07-15-2016")))

		// Append brush component
		vis.svg.append("g")
			.attr("class", "x brush")
			.call(vis.brush)
			.selectAll("rect")
			.attr("y", -6)
			.attr("height", vis.height + 7);

		// vis.svg.append("defs").append("clipPath")
		// 	.attr("id", "clip")
		// 	.append("rect")
		// 	.attr("width", vis.width)
		// 	.attr("height", vis.height);

		// (Filter, aggregate, modify data)
		vis.wrangleData();
	}


	/*
	 * Data wrangling
	 */

	wrangleData() {
		let vis = this;

		// (1) Group data by date and count survey results for each day
		// (2) Sort data by day

		vis.rolled= d3.rollup(vis.data, v=> v.length, d=>+d.survey);
		vis.data=Array.from(vis.rolled, ([key, value]) => ({key, value}));
		//
		// var parseDate = d3.timeParse("%Y-%m-%d");
		//
		// // convert keys to date objects
		// vis.data.forEach(function(d,i){
		// 	vis.data[i].key= parseDate(vis.data[i].key);
		// });

		// sort dates
		vis.data.sort(function(a,b){return d3.ascending(a.key, b.key)});
		// console.log(vis.data);

		// Update the visualization
		vis.updateVis();
	}


	/*
	 * The drawing function
	 */

	updateVis() {
		let vis = this;

		// * TO-DO *

		// console.log("x: "+  d3.extent(vis.data, d=> d.key));
		vis.xScale.domain(d3.extent(vis.data, d=> d.key));
		vis.y.domain([0, d3.max(vis.data, d=> d.value)]);

		vis.svg.select(".x-axis").call(vis.xAxis);
		vis.svg.select(".y-axis").call(vis.yAxis);

		vis.svg
			.append("g")
			.append("path")
			.datum(vis.data)
			.attr("class", "area")
			.attr("d", vis.area)
			.attr("fill", "blue");

	}
}

