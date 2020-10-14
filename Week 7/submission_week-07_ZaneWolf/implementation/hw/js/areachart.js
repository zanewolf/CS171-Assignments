
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

		// vis.margin = {top: 5, right: 5, bottom:5, left: 5};
		//
		// vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
		// vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;
		// // vis.width = 800 - vis.margin.left - vis.margin.right;
		// // vis.height = 600 - vis.margin.top - vis.margin.bottom;



		// SVG drawing area
		// vis.svg = d3.select("#" + vis.parentElement).append("svg")
		// 	.attr("width", vis.width + vis.margin.left + vis.margin.right)
		// 	.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
		// 	.append("g")
		// 	.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");
		//
		// // // Overlay with path clipping
		// // vis.svg.append("defs").append("clipPath")
		// // 	.attr("id", "clip")
		// //
		// // 	.append("rect")
		// // 	.attr("width", vis.width)
		// // 	.attr("height", vis.height);
		//
		// // Scales and axes
		// vis.x = d3.scaleTime()
		// 	.range([0, vis.width])
		// 	.domain(d3.extent(vis.data, d=> d.Year));
		//
		// vis.y = d3.scaleLinear()
		// 	.range([vis.height, 0]);
		//
		// vis.xAxis = d3.axisBottom()
		// 	.scale(vis.x);
		//
		// vis.yAxis = d3.axisLeft()
		// 	.scale(vis.y);
		//
		// vis.svg.append("g")
		// 	.attr("class", "x-axis axis")
		// 	.attr("transform", "translate(0," + vis.height + ")");
		//
		// vis.svg.append("g")
		// 	.attr("class", "y-axis axis");



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


		// * TO-DO *


		// Update the visualization
		vis.updateVis();
	}


	/*
	 * The drawing function
	 */

	updateVis() {
		let vis = this;

		// * TO-DO *

	}
}

