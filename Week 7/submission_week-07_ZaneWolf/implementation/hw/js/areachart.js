
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

		// * TO-DO *


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

