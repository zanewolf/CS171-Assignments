//define Margins
var margin = {
        top: 0,
        right: 20,
        bottom: 50,
        left: 100},
    width1 = 850 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom,
    width2 = 750 - margin.left - margin.right,
    height2 = 650 - margin.top - margin.bottom;

//define shelter data
let shelterData = [{shelter: "Caravans", percentage: 79.68},{shelter: "Combination", percentage: 10.81}, {shelter: "Tents", percentage: 9.51}];

//define svg area of LINE CHART using said margins
let svg = d3.select("#linechart")
    .append("svg")
    .attr("width", width1 + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//define svg area of BAR CHART using said margins
let svg2 = d3.select("#barchart")
    .append("svg")
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (0.5*margin.left) + "," + margin.top+ ")");

// define time parser
var parseTime= d3.timeParse("%Y-%m-%d");


//journey to the promise land
d3.csv("data/zaatari-refugee-camp-population.csv", row => {

    row.population = +row.population;
    row.date = parseTime(row.date);

    return row;

}).then(function(data){

    drawLineChart(data);

    drawBarChart(shelterData.sort(function(a,b){ return d3.ascending(a.percentage,b.percentage)}));

});




function drawBarChart(data){
    let padding = 30;

    // Add X Axis
    var xBarScale = d3.scaleBand()
        .range([ 0, width2 ])
        .domain(data.map(function(d) { return d.shelter; }))
        // .domain(['Caravans','Combination','Tents'])
        .padding(.2) //space between the bars
    svg2.append("g")
        .attr("class", "xBarAxis")
        .attr("transform", "translate(0,"+ (height2-padding) +")")
        .call(d3.axisBottom(xBarScale)
            .tickSize(0))
        .select(".domain").remove(); //remove the x-axis line

    // Add Y Axis
    let yBarScale = d3.scaleLinear()
        .domain([0, 100])
        // .range([padding,height - padding]);
        .range([height2-2*padding, 3*padding]);
    svg2.append("g")
        // .attr("transform", "translate(" + padding + ",0)")
        .attr("transform", "translate(" + (width2-0.9*padding) + ",0)")
        .attr("class", "yBarAxis")
        .call(d3.axisRight(yBarScale)
            .tickSize(0))
    svg2.append("text")
        .attr("class", "ylabel")
        // .attr("transform", "translate("+width2 +","+height/2+")")
        .attr("transform","rotate(90)")
        .attr("y", -width2-0.5*padding)
        .attr("x", width2/2+padding)
        .style("text-anchor", "end")
        .text("Percent (%)")
    svg2.select(".domain").remove();

    svg2.selectAll("rect.rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "mybar")
        .attr("x", function (d) { return xBarScale(d.shelter);} )
        .attr("y", function(d) { return yBarScale(d.percentage); })
        .attr("height", function(d) { return (height2-2*padding-yBarScale(d.percentage)); })
        .attr("width", xBarScale.bandwidth() )
        // .attr("x", xBarScale(0) )
        // .attr("y", function(d) { return yBarScale(d.percentage); })
        // .attr("width", xBarScale.bandwidth() )
        // .attr("height", function(d) { return yBarScale(d.percentage); })
        .attr("fill", "#CDC6AE")
        .attr("stroke", "#38686A")
        .attr("stroke-width", "4");

    svg2.selectAll('rect.tag')
        .data(data)
        .enter()
        .append("text")
        .attr("class", "perc-label")
        .text(d => d.percentage+"%")
        .attr("fill", "#CDC6AE")
        .attr("font-weight", "bold")
        .attr("x",  function(d) { return (xBarScale(d.shelter)+xBarScale.bandwidth()/2)-22; })
        .attr("y", function(d) { return (yBarScale(d.percentage)-10); });

};

function drawLineChart(data) {

    let padding = 30;

    // Add X Axis
    let xScale = d3.scaleTime()
        .domain([d3.min(data, d => d.date), d3.max(data, d => d.date)])
        .range([padding, width1 - padding]);
    svg.append("g")
        .attr("transform", "translate(0," + (height-padding) + ")")
        .attr("class", "xaxis")
        .call(d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%b %Y"))
            .tickSize(0))
        // .select(".domain").remove()
        // .selectAll(".tick text")
        // .call(wrap, xScale.bandwidth());
        .selectAll("text")
        // .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");



    // Add Y Axis
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.population)+0.05*d3.max(data, d => d.population)])
        // .range([padding,height - padding]);
        .range([height - 2*padding, 2*padding]);
    svg.append("g")
        .attr("transform", "translate(" + 0.91*padding + ",0)")
        .attr("class", "yaxis")
        .call(d3.axisLeft(yScale)
            .tickSize(0))
        .select(".domain").remove();
        // .attr("stroke","#38686A")
        // .attr("stroke-width","4")
        // .attr("opacity",".9");

    // Add Area Component
    let path = svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("fill", "#CDC6AE")
        .attr("d", d3.area()
            .x(d => xScale(d.date))
            .y0(yScale(0))
            .y1(d => yScale(d.population)))
        .on("mouseover", function mousemove(event){
            //code goes here
            const currentXPosition = d3.mouse(this)[0];
            const xValue = xScale.invert(currentXPosition);
            let bisectDate = d3.bisector(d=>d.date).left;
            const dataIndex = bisectDate(data, xValue, 1);
            const leftData = data[dataIndex - 1];
            const rightData = data[dataIndex];
            console.log(leftData,rightData);

        });

    // Add Thick Top Line - Bonus 6d
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#38686A")
        .attr("stroke-width", 4)
        .attr("d", d3.line()
            .x(d=> xScale(d.date))
            .y(d => yScale(d.population))
        )

}