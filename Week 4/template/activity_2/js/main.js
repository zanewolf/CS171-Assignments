// var sandwiches = [
//     { name: "Thesis", price: 7.95, size: "large" },
//     { name: "Dissertation", price: 8.95, size: "large" },
//     { name: "Highlander", price: 6.50, size: "small" },
//     { name: "Just Tuna", price: 6.50, size: "small" },
//     { name: "So-La", price: 7.95, size: "large" },
//     { name: "Special", price: 12.50, size: "small" }
// ];

d3.csv("data/sandwiches.csv").then(function(data) {
    console.log(data); // [{name: "Thesis", price: "7.95", size: "large"},..]
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append("circle")
        .attr("fill", d => (d.price < 7.00) ? "green" : "blue" )
        .attr("r", d => (d.size == 'large') ? "50": "25")
        .attr("cy",100)
        .attr("cx", (d,i)=> (i+1)*110)
        .attr("stroke", "black")
});
console.log(`look at that: The browser already interpreted this line, while it's still waiting for the data to load`)

let svg = d3.select("body").append("svg")
    .attr("width", 1000)
    .attr("height", 1000);




//<circle cx="85" cy="25" r="25" fill="green" />