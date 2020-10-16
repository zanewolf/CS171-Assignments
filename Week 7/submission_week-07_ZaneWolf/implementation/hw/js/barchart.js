

/*
 * BarChart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the bar charts
 * @param _data						-- the dataset 'household characteristics'
 * @param _config					-- variable from the dataset (e.g. 'electricity') and title for each bar chart
 */
// d3 = require("d3-array@2");
// var filtered =false;

class BarChart {

	constructor(parentElement, data, config, title) {
		this.parentElement = parentElement;
		this.data = data;
		this.config = config;
		this.displayData = data;
		this.title = title;

		// console.log(this.displayData);

		this.initVis();
	}
	/*
	 * Initialize visualization (static content; e.g. SVG area, axes)
	 */

	initVis() {
		let vis = this;


		vis.margin = {top: 30, right: 50, bottom: 5, left: 130};

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
			.range([0, vis.height]);

		vis.x = d3.scaleLinear()
			.range([0, vis.width-50]);

		vis.xAxis = d3.axisBottom()
			.scale(vis.x);

		vis.yAxis = d3.axisLeft()
			.scale(vis.y);

		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(," + vis.height + ")");

		vis.svg.append("g")
			.attr("class", "y-axis axis")
			.attr("transform", "translate(-5,0)");

		//Bars
		vis.svg.append("g")
			.attr("class", "bar");

		vis.svg.append("g")
			.append("text")
			.attr("class", "values");

		//Title
		vis.svg.append("text")
			.attr("x", vis.width/2 )
			.attr("class", "vistitle")
			.attr("y", -10)
			.style("text-anchor", "middle")
			.text(this.title);



		// (Filter, aggregate, modify data)
		vis.wrangleData();
	}

	/*
	 * Data wrangling
	 */

	wrangleData() {
		let vis = this;

		// console.log(vis.data);

		// (1) Group data by key variable (e.g. 'electricity') and count leaves
		vis.rolled=d3.rollup(vis.displayData, leaves=>leaves.length, d=>d[vis.config])
		vis.arrayed=Array.from(vis.rolled, ([key, value]) => ({key, value}));

		// (2) Sort columns descending
		vis.sorted=vis.arrayed.sort(function(a,b){return d3.descending(a.value, b.value)});
		// console.log(vis.sorted);

		// Option to remove the NAs
		// vis.displayData=vis.displayData.filter(d=>d.key!=="NA");
		// console.log(vis.displayData);

		// Update the visualization
		vis.updateVis();
	}



	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
	 */

	updateVis() {
		let vis = this;

		// (1) Update domains
		vis.y
			.domain(vis.sorted.map(d=>d.key))
			.padding(0.3);
		vis.x.domain([0, d3.max(vis.sorted, d=>d.value)]);

		vis.svg.select(".y-axis")
			// .transition()
			// .duration(300)
			.call(vis.yAxis
				.tickSize(0))
			.select(".domain").remove();
		vis.svg.select(".x-axis")
			// .transition()
			// .duration(300)
			.call(vis.xAxis
				.tickSize(0)
				.tickValues([]))
			.select(".domain").remove()
		;


		// (2) Draw rectangles
		vis.rect = vis.svg.selectAll(".bar")
			.data(vis.sorted, d=>d);

		vis.rect
			.enter()
			.append('rect')
			.attr("class", "bar")
			.merge(vis.rect)
			.attr("height", vis.y.bandwidth() )
			.attr("y", function(d) { return vis.y(d.key); })
			.attr("width", function(d) { return vis.x(d.value); })
			.attr("fill", "#69b3a2")
			.transition()
			.duration(500)
			.attr("x", 0 );

		vis.rect.exit().remove();


		// (3) Draw labels

		vis.barsLabel = vis.svg.selectAll(".barlabel")
			.data(vis.sorted);

		vis.barsLabel
			.enter()
			.append('text')
			.attr("class", "barlabel")
			.merge(vis.barsLabel)
			.attr("x", function(d){return (vis.width-(vis.width-vis.x(d.value))+5);})
			.attr("y", function(d){return (vis.y(d.key)+vis.y.bandwidth()/1.5);})
			.text(d=>d.value)
			.transition()
			.duration(500);

		vis.barsLabel.exit().remove();

		// add titles


	}



	/*
	 * Filter data when the user changes the selection
	 * Example for brushRegion: 07/16/2016 to 07/28/2016
	 */

	selectionChanged(brushRegion) {
		let vis = this;

		// console.log(vis.data);

		// console.log(brushRegion);
		// // Filter data accordingly without changing the original data
		vis.displayData=vis.data.filter(function(d) {
			return ((d.survey >= brushRegion[0]) && (d.survey <= brushRegion[1]))
		});
		// console.log(vis.displayData);

		// * TO-DO *


		// Update the visualization
		vis.wrangleData();
	}
}
