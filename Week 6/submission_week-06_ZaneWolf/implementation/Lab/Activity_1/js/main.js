// define margins
let margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20};
let width = $("#chart-area").width() - margin.left - margin.right, //$("#myCOLID").width() to make it adaptable to screen width/height rather than hardcoding
    height = $("#chart-area").height() - margin.top - margin.bottom;


// define svg area using said margins
let svg = d3.select("#chart-area")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


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