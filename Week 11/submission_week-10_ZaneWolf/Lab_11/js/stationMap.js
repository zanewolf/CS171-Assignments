
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

class StationMap {

	/*
	 *  Constructor method
	 */
	constructor(parentElement, displayData, mapCenter, lineData) {
		this.parentElement = parentElement;
		this.displayData = displayData;
		this.mapCenter = mapCenter;
		this.lineData = lineData;

		this.initVis();
	}


	/*
	 *  Initialize station map
	 */
	initVis () {
		let vis = this;

		L.Icon.Default.imagePath = 'images/';


		vis.map=L.map(vis.parentElement).setView(vis.mapCenter, 13);

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(vis.map);



		vis.wrangleData();
	}


	/*
	 *  Data wrangling
	 */
	wrangleData () {
		let vis = this;

		// No data wrangling/filtering needed

		// Update the visualization
		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		// see ya, dworky
		// let dworkin = L.marker([42.378774,-71.117303]).bindPopup("Maxwell Dworkin");
		// vis.map.addLayer(dworkin);

		// add markers
		vis.stations = L.layerGroup().addTo(vis.map)

		vis.displayData.forEach((d,i)=>{
			vis.marker = L.marker([d.lat, d.long]).addTo(vis.map).bindPopup(d.station + "<br> Available Bikes: " + d.bikes + "<br> Available Docks: " + d.docks)
			vis.stations.addLayer(vis.marker)

		})

		// add MBTA lines
		let lines = L.geoJson(vis.lineData, {
			style: styleLines,
			weight: 5,
			fillOpacity: 0.7
		}).addTo(vis.map)
		// L.geoJson(vis.lineData).addTo(vis.map)


		function styleLines(feature){
			// console.log(feature)
			switch(feature.properties.LINE){
				case 'RED': return {color: "red"};
				case 'GREEN': return {color: "green"};
				case 'ORANGE': return {color: "orange"};
				case 'SILVER': return {color: "grey"};
				case 'BLUE': return {color: "blue"};
			}
		}

	}
}

