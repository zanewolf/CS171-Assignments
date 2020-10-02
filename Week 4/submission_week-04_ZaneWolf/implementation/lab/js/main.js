console.log("let's get started!")

d3.csv("data/cities.csv", row => {
    row.x = +row.x;
    row.y = +row.y;
    row.population = +row.population;
    return row;
    }).then(function(data) {
    filteredData = data.filter(function(d){ return d.eu=="true"});
    console.log(filteredData);
    d3.select("h1")
        .append("h3")
        .attr("class", "city-num")
        .text("Number of Cities: " + filteredData.length);
    // console.log(data); // [{name: "Thesis", price: "7.95", size: "large"},..]

    svg.selectAll('circle')
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("r", d => (d.population > 1000000) ? "8px": "4px")
        .attr("cy", d => (d.y))
        .attr("cx", d => (d.x))
        .attr("stroke", "black")
        .attr("fill", "deepskyblue")
        .attr("opacity", d => (d.population > 1000000) ? "1.0": "0.7")
        .on("click", function(event, d){
            console.log("The population of " + d.city + " is " + d.population)
        });;

    svg.selectAll('text')
        .data(filteredData)
        .enter()
        .append("text")
        .text(d => d.city)
        .attr("class", "city-label")
        .attr("opacity", d=> (d.population> 1000000) ? "1.0" : "0")
        .attr("x", d=> d.x)
        .attr("y", d=> d.y-12);
});

let svg = d3.select("body").append("svg")
    .attr("width", 700)
    .attr("height", 550);




