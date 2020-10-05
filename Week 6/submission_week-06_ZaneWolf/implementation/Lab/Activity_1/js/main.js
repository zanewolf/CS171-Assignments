// define margins
let margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20};
let width = $("#chart-area").width() - margin.left - margin.right, //$("#myCOLID").width() to make it adaptable to screen width/height rather than hardcoding
    height = $("#chart-area").width() - margin.top - margin.bottom;


// defining reused colors
// let mydarkgreen = "#38686A";
// let mypale = "#CDC6AE";
// let myred = "#AF0514";

// define svg area using said margins
let svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


//define new functions here
// // define time parser
// let parseTime= d3.timeParse("%Y-%m-%d");

// import data and set up promise
// d3.csv("data/coffee-house-chains.csv", row => {
//
// 	// transform string parameters to numerical or date, if need be.
// 	row.stores = +row.stores;
// 	row.revenue = +row.revenue;
// 	return row;
//
// }).then(function(data){
//
// 	//sort data and call visualization functions here
// 	console.log(data);
// 	// updateVisualization(data);
//
//
// });

// define drawing functions here
// The function is called every time when an order comes in or an order gets processed
// The current order queue is stored in the variable 'orders'

svg.append('text')
    .attr('class', 'label')
    .attr('x', width/2)
    .attr('y', 50)
    .attr('dy', '.35em');



function updateVisualization(orders) {
    
    // console.log(orders);
    // Data-join (circle now contains the update selection)
    let circle = svg.selectAll("circle")
        .data(orders);

    // Enter (initialize the newly added elements)
    circle.enter().append("circle")
        .attr("class", "dot")
        .attr("fill", d=> (d.product =="coffee") ? "black" : "green")

        // Enter and Update (set the dynamic properties of the elements)
        .merge(circle)
        .attr("r", d=>d.price*6)
        .attr("cx",(d,index)=>(index * 80) + 50 )
        .attr("cy", 180);

    // Exit
    circle.exit().remove();



    //update label
    updateLabel(orders.length); //having finished, probably unnecessary to make this another function, but c'est la vie

}

function updateLabel(length){

    // console.log(length);
    svg.select(".label")
        .text("Number of Orders: " + length)

}