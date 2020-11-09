// Variable for the visualization instance
let stationMap,
lineData;


// Hubway JSON feed
let url = 'https://member.bluebikes.com/data/stations.json';

/*d3.json(url).then(jsonData =>{
	console.log(jsonData);
});*/

d3.json("data/MBTA-Lines.json")
    .then(d=>{
        lineData=d;
    })


fetch(url, function(d){
    console.log(d)
})
    .then(response => response.json())
    .then(data => { gettingStarted(data)});


// function that gets called once data has been fetched.
// We're handing over the fetched data to this function.
// From the data, we're creating the final data structure we need and create a new instance of the StationMap
function gettingStarted(data) {

    // Extract list with stations from JSON response


    // variations for creating objects with stationname as key or index as key

    // data.stations.forEach(d=>console.log(d.s))
    // let displayData = {};

    // data.stations.forEach(function(d,i){

    //     // station name as main key
    //     // displayData[d.s]={};
    //     // displayData[d.s]["bikes"]=d.ba;
    //     // displayData[d.s]["docks"]=d.da;
    //     // let lat = d.la;
    //     // let long = d.lo;
    //     // displayData[d.s]["coordinates"]=[lat, long];

    //     // index as main key
    //     displayData[i]={};
    //     displayData[i]["station"]=d.s;
    //     displayData[i]["bikes"]=d.ba;
    //     displayData[i]["docks"]=d.da;
    //     let lat = d.la;
    //     let long = d.lo;
    //     displayData[i]["coordinates"]=[lat, long];
    //
    // })

    displayData=[];
    data.stations.forEach((d,i)=>{
        displayData.push({
            index: i,
            station: d.s,
            bikes: d.ba,
            docks: d.da,
            lat: d.la,
            long: d.lo,
        })
    })


    // Display number of stations in DOM
    $("#station-count").text(displayData.length)

    // Instantiate visualization object (bike-sharing stations in Boston)
    stationMap = new StationMap("station-map", displayData,[42.360082, -71.058880], lineData);
}
