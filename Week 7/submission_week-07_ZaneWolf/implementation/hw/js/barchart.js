

/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */


class BarChart {

	constructor(parentElement, data, config) {
		this.parentElement = parentElement;
		this.data = data;
		this.config = config;
		this.displayData = data;

		console.log(this.displayData);

		this.initVis();
	}
	/*
	 * Initialize visualization (static content; e.g. SVG area, axes)
	 */

	initVis() {
		let vis = this;


		vis.margin = {top: 5, right: 5, bottom: 5, left: 5};

		vis.width = $('#' + vis.parentElement).width() - vis.margin.left - vis.margin.right;
		vis.height = $('#' + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;
		// vis.width = 300 - vis.margin.left - vis.margin.right;
		// vis.height = 150 - vis.margin.top - vis.margin.bottom;


		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


		// Scales and axes
		// define Y axis as categorical and X as linear, since it's quantitative
		vis.y = d3.scaleBand()
			.range([0, vis.height])
			.domain(d3.extent(vis.data, d=> d.config));

		vis.x = d3.scaleLinear()
			.range([0, vis.width]);

		vis.xAxis = d3.axisBottom()
			.scale(vis.x);

		vis.yAxis = d3.axisLeft()
			.scale(vis.y);

		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")");

		vis.svg.append("g")
			.attr("class", "y-axis axis");

		vis.bars = vis.svg.selectAll(".bar")
			.data(vis.data)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", vis.x(0) )
			.attr("y", function(d) { return vis.y(d.config); })
			.attr("width", function(d) { return vis.x(d[0]); })
			.attr("height", vis.y.bandwidth() )
			.attr("fill", "#2D3319")

		console.log("here");


		// (Filter, aggregate, modify data)
		vis.wrangleData();
	}




	/*
	 * Data wrangling
	 */

	wrangleData() {
		let vis = this;

		// (1) Group data by key variable (e.g. 'electricity') and count leaves
		// (2) Sort columns descending


		// * TO-DO *


		// Update the visualization
		vis.updateVis();
	}



	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
	 */

	updateVis() {
		let vis = this;

		// (1) Update domains
		// (2) Draw rectangles
		// (3) Draw labels


		// * TO-DO *


		// Update the y-axis
		vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg
            .selectAll(".bar")
            .data(vis.data)
            .enter()
            .append('rect')
            .attr("class", "bar")
            .attr("d", vis.bar)


	}



	/*
	 * Filter data when the user changes the selection
	 * Example for brushRegion: 07/16/2016 to 07/28/2016
	 */

	selectionChanged(brushRegion) {
		let vis = this;

		// Filter data accordingly without changing the original data


		// * TO-DO *


		// Update the visualization
		vis.wrangleData();
	}
}
