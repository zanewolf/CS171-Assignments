
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


		// initialize custom icons
		let LeafIcon = L.Icon.extend({
			options: {
				shadowUrl: 'icons/marker-shadow.png',
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [0, -28]
			}
		});

		vis.redMarker = new LeafIcon({ iconUrl:  'icons/marker-red.png' });
		vis.blueMarker = new LeafIcon({ iconUrl:  'icons/marker-blue.png' });
		vis.yellowMarker = new LeafIcon({ iconUrl:  'icons/marker-yellow.png' });


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

			let myicon = styleIcon(d)
			// myicon=vis.redMarker

			vis.marker = L.marker([d.lat, d.long],{icon: myicon}).addTo(vis.map).bindPopup(d.station + "<br> Available Bikes: " + d.bikes + "<br> Available Docks: " + d.docks)
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

		function styleIcon(d){
			console.log(d);

			if (d.bikes === 0 | d.docks === 0 ) {
				return vis.redMarker;
			} else {
				return vis.blueMarker;
			}
		}

	}
}

