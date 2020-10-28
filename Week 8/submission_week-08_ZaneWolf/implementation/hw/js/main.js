/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// WISH LIST ITEMS:
// Remove wrangleData to separate file.
//      Rather than have both have the Table, Map, and Bar charts have
//      the SAME EXACT 60 LINES OF CODE.
// Move state info into a look up table, the output of wrangleData?
//      { state : { key: value}}
// Add '%' to legend labels

// init global variables & switches
let myDataTable,
    myMapVis,
    myBarVisOne,
    myBarVisTwo,
    myBrushVis;

let selectedTimeRange = [];
let selectedState = '';


// load data using promises
let promises = [

    // d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json"),  // not projected -> you need to do it
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json"), // already projected -> you can just scale it to ft your browser window
    d3.csv("data/covid_data.csv"),
    d3.csv("data/census_usa.csv")
];

Promise.all(promises)
    .then( function(data){ initMainPage(data) })
    .catch( function (err){console.log(err)} );

// initMainPage
function initMainPage(dataArray) {

    // log data
    // console.log('check out the data', dataArray);

    // init table
    myDataTable = new DataTable('tableDiv', dataArray[1], dataArray[2]);

    // TODO - init map
    myMapVis = new MapVis('mapDiv', dataArray[0], dataArray[1], dataArray[2]);

    // TODO - init bars
    myBarVisOne = new BarVis('bar1',dataArray[1], dataArray[2], true, "Worst 10 States");
    myBarVisTwo = new BarVis('bar2',dataArray[1], dataArray[2], false, "Best 10 States");
    // myBarVisTwo = new BarVis('bar2',

    // init brush
    myBrushVis = new BrushVis('brushDiv', dataArray[1]);
}

// TODO Where to put this?
let selectedCategory = $('#categorySelector').val();

function categoryChange() {
    selectedCategory = $('#categorySelector').val();
    myMapVis.wrangleData(selectedCategory);
    myBarVisOne.wrangleData(selectedCategory);
    myBarVisTwo.wrangleData(selectedCategory)

}


