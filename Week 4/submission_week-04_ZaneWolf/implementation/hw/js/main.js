// console.log("let's get started!")

//So, I realized I ended up creating the bar chart a different way than the hw stipulated. I defined a y-axis and used that to create the building names. I didn't use labels. Just wanted to let you know that I realized the problem, tried a solution (clicking on y-axis tick marks) and failed, considered starting over, and then decided not to because the point value of that attribute probably isn't worth the hassle of redoing that aspect of the chart. My apologies.

//define default margins
var margin = {
    top: 0,
    right: 25,
    bottom: 25,
    left: 250},
    width = 750 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

//define svg area using said margins
let svg = d3.select("#chartarea")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//gotta provide those units
d3.select("#chartarea").append("p").text("Building height specified in meters (m).");

//journey to the promise land
d3.csv("data/buildings.csv", row => {
    // height_m,height_ft,height_px,floors,completed - transform to numerical
    row.height_m = +row.height_m;
    row.height_ft = +row.height_ft;
    row.height_px = +row.height_px;
    row.completed = +row.completed;

    return row;

}).then(function(data){
    sortedData = data.sort(function(a,b){ return d3.descending(a.height_px,b.height_px)});
    // console.log(sortedData);
    updateInfoArea(sortedData[0]); //set initial information starting at world's tallest

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, sortedData[0].height_px+20])
        .range([ 0, width]);
    // svg.append("g") //removed to delete x-axis
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(x))
    //     .selectAll("text")
    //     .attr("transform", "translate(-10,0)rotate(-45)")
    //     .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(data.map(function(d) { return d.building; }))
        .padding(.2) //space between the bars
    svg.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove(); //remove the y-axis line


    // #make the bars
    svg.selectAll("rect.rect")
        .data(sortedData)
        .enter()
        .append("rect")
        .attr("class", "mybar")
        .attr("x", x(0) )
        .attr("y", function(d) { return y(d.building); })
        .attr("width", function(d) { return x(d.height_px); })
        .attr("height", y.bandwidth() )
        .attr("fill", "#2D3319")
        .on("click", function(event, d){

            updateInfoArea(d);
        });

    //make the height labels on the bars
    svg.selectAll('rect.tag')
        .data(sortedData)
        .enter()
        .append("text")
        .attr("class", "height-label")
        .text(d => d.height_m)
        .attr("fill", "#9FD8CB")
        .attr("font-weight", "bold")
        .attr("x",  function(d) { return x(d.height_px)-35; })
        .attr("y", function(d) { return y(d.building)+y.bandwidth()/2; });

        });

function updateInfoArea(d){
    //pull from data to update the info area
    document.getElementById('buildingName').innerHTML = d.building;
    document.getElementById("buildingHeight").innerHTML = d.height_m;
    document.getElementById("buildingCity").innerHTML = d.city;
    document.getElementById("buildingCountry").innerHTML = d.country;
    document.getElementById("buildingFloors").innerHTML = d.floors;
    document.getElementById("buildingDone").innerHTML = d.completed;
    document.getElementById("buildingImage").src = "img/"+d.image;
    document.getElementById("wiki").href = d.wiki; //An alternative way to do this was to append the building name to a blanket "www.wikipedia.com/" string, and augment the name to be separated by underscores rather than spaces (.replace(/ /g,"_")). But since I had to go find the wikipedia pages to confirm that that was indeed the case anyway, I decided to just copy/paste the urls into the csv while I was at it.
    document.getElementById("wiki").text="Read more about " + d.building + " on Wikipedia!";

}


