
/*
 * CountVis - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the visualization
 * @param _data						-- the actual data: perDayData
 */

class CountVis {


	constructor(_parentElement, _data, myEventHandler) {
		this.parentElement = _parentElement;
		this.data = _data;
		this.myEventHandler = myEventHandler;

		this.initVis();
	}


	/*
	 * Initialize visualization (static content, e.g. SVG area or axes)
	 */

	initVis() {
		let vis = this;

		vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

		vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right,
			vis.height = 300 - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");


		// Scales and axes
		vis.x = d3.scaleTime()
			.range([0, vis.width]);

		vis.y = d3.scaleLinear()
			.range([vis.height, 0]);



		vis.yAxis = d3.axisLeft()
			.scale(vis.y)
			.ticks(6);


		// Set domains
		let minMaxY = [0, d3.max(vis.data.map(function (d) { return d.count; }))];
		vis.y.domain(minMaxY);

		let minMaxX = d3.extent(vis.data.map(function (d) { return d.time; }));
		vis.x.domain(minMaxX);

		vis.xScaleModified = vis.x;
		vis.xAxis = d3.axisBottom()
			.scale(vis.xScaleModified);


		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")");

		vis.svg.append("g")
			.attr("class", "y-axis axis");

		// Axis title
		vis.svg.append("text")
			.attr("x", -50)
			.attr("y", -8)
			.text("Votes");


		// Append a path for the area function, so that it is later behind the brush overlay
		vis.timePath = vis.svg.append("path")
			.attr("class", "area area-time");

		// Define the D3 path generator
		vis.area = d3.area()
			.curve(d3.curveStep)
			.x(function (d) {
				return vis.x(d.time);
			})
			.y0(vis.height)
			.y1(function (d) { return vis.y(d.count); });


		// Initialize brushing component

		vis.brush = d3.brushX()
			.extent([[0,0],[vis.width, vis.height]])
			.on("brush", function(event){
				// User just selected a specific region
				vis.currentBrushRegion = event.selection;
				vis.currentBrushRegion = vis.currentBrushRegion.map(vis.xScaleModified.invert);

				// 3. Trigger the event 'selectionChanged' of our event handler
				$(vis.myEventHandler).trigger("selectionChanged", vis.currentBrushRegion);
			});

		vis.brushGroup = vis.svg.append("g")
			.attr("class", "brush");


		// Original scale
		vis.xScaleOrig = vis.x;

		// Initialize the zoom component
		vis.zoom = d3.zoom()
			// Subsequently, you can listen to all zooming events
			.on("zoom", function(event){
				console.log("zoom");
				vis.xScaleModified = event.transform.rescaleX(vis.x);
				if(vis.currentBrushRegion) {
					vis.brushGroup.call(vis.brush.move, vis.currentBrushRegion.map(vis.xScaleOrig));
					vis.x.domain([vis.x.invert(vis.currentBrushRegion.map(vis.xScaleModified)[0]),vis.x.invert(vis.currentBrushRegion.map(vis.xScaleModified)[1])])
				}
				vis.updateVis();

			})
			// .on("dblclick.zoom", function(event){
			// 	vis.x.domain(vis.xScaleOrig)
			// })
			// Specify the zoom scale's allowed range
			.scaleExtent([1,20]);

		// d3.select('#Reset').on('click', function (event) {
		// 	console.log("reset")
		// 	vis.x.domain(d3.extent(vis.data.map(function (d) { return d.time; })))
		//
		// })

		vis.brushGroup.call(vis.zoom)
			.on("mousedown.zoom", null)
			.on("touchstart.zoom", null);


		// Define the clipping region
		vis.svg.append("defs")
			.append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("width", vis.width)
			.attr("height", vis.height);

		// (Filter, aggregate, modify data)
		vis.wrangleData();
	}



	/*
	 * Data wrangling
	 */

	wrangleData() {
		let vis = this;

		this.displayData = this.data;

		// Update the visualization
		vis.updateVis();
	}



	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
	 * Function parameters only needed if different kinds of updates are needed
	 */

	updateVis() {
		let vis = this;
		//
		// vis.xAxis.scale(vis.xScaleModified)
		// Call brush component here

		vis.svg
			.select(".brush")
			.call(vis.brush)
			// .selectAll("rect")
			// .attr("height", vis.height)
			// .attr("clip-path", "url(#clip)")
		;




		// Call the area function and update the path
		// D3 uses each data point and passes it to the area function.
		// The area function translates the data into positions on the path in the SVG.
		vis.timePath
			.datum(vis.displayData)
			.merge(vis.timePath)
			.transition()
			.duration(1000)
			.attr("d", vis.area)
			.attr("clip-path", "url(#clip)");


		// Call axis functions with the new domain 
		vis.svg.select(".x-axis").call(vis.xAxis);
		vis.svg.select(".y-axis").call(vis.yAxis);


	}
	//
	// zoomFunction(event){
	// 	let vis = this;
	//
	// 	let xRescaled = event.transform.rescaleX(vis.XOirginal);
	// 	if(vis.currentBrushRegion){
	// 		vis.svg.selectAll(".brush").call(vis.brush.move, vis.currentBrushRegion.map(xRescaled));
	//
	// 	}
	//
	// 	vis.updateVis();
	// }
}