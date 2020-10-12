
// Variables for the visualization instances
let areachart, timeline;


// Start application by loading the data
loadData();

function loadData() {
    d3.json("data/uk-household-purchases.json"). then(jsonData=>{
            
        // prepare data
        let data = prepareDataForStudents(jsonData)
        
        console.log('data loaded ')

        // TO-DO (Activity I): instantiate visualization objects

        // TO-DO (Activity I):  init visualizations
        
    });
}


// helper function - PROVIDE WITH TEMPLATE
function prepareDataForStudents(data){

	let parseDate = d3.timeParse("%Y");

	let preparedData = {};

	// Convert Pence Sterling (GBX) to USD and years to date objects
	preparedData.layers = data.layers.map( d => {
		for (let column in d) {
			if (d.hasOwnProperty(column) && column !== "Year") {
				d[column] = parseFloat(d[column]) * 1.481105 / 100;
			} else if(d.hasOwnProperty(column) && column === "Year") {
				d[column] = parseDate(d[column].toString());
			}
		}
	});

	//
	data.years.forEach(function(d){
		d.Expenditures = parseFloat(d.Expenditures) * 1.481105 / 100;
		d.Year = parseDate(d.Year.toString());
	});

	return data
}



function brushed() {

	// TO-DO: React to 'brushed' event
}
