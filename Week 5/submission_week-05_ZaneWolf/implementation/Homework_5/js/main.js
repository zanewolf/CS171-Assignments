//define Margins
let margin = {
        top: 0,
        right: 35,
        bottom: 50,
        left: 100},
    width1 = 850 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom,
    width2 = 750 - margin.left - margin.right,
    height2 = 650 - margin.top - margin.bottom;

let maxCapacity = 100000; //gotta get rid of those magic numbers, yaknow. already have too many of them.

let mydarkgreen = "#38686A";
let mypale = "#CDC6AE";
let myred = "#AF0514";

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
let parseTime= d3.timeParse("%Y-%m-%d");


//journey to the promise land
d3.csv("data/zaatari-refugee-camp-population.csv", row => {

    row.population = +row.population;
    row.date = parseTime(row.date);
    return row;

}).then(function(data){

    drawLineChart(data);
    drawBarChart(shelterData.sort(function(a,b){
        return d3.ascending(a.percentage,b.percentage)}));

});

function drawBarChart(data){
    let padding = 30;

    // Add X Axis
    let xBarScale = d3.scaleBand()
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
        .range([height2-2*padding, 3*padding]);
    svg2.append("g")
        .attr("transform", "translate(" + (width2-0.9*padding) + ",0)")
        .attr("class", "yBarAxis")
        .call(d3.axisRight(yBarScale)
            .tickSize(0))
    svg2.append("text")
        .attr("class", "ylabel")
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
        .attr("fill", mypale)
        .attr("stroke", mydarkgreen)
        .attr("stroke-width", "4");

    svg2.selectAll('rect.tag')
        .data(data)
        .enter()
        .append("text")
        .attr("class", "perc-label")
        .text(d => d.percentage+"%")
        .attr("fill", mydarkgreen)
        .attr("font-weight", "bold")
        .attr("x",  function(d) { return (xBarScale(d.shelter)+xBarScale.bandwidth()/2)-22; })
        .attr("y", function(d) { return (yBarScale(d.percentage)-10); });

}

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
        .selectAll("text")
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

    // Add Thick Top Line - Bonus 6d
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", mydarkgreen)
        .attr("stroke-width", 8)
        .attr("d", d3.line()
            .x(d=> xScale(d.date))
            .y(d => yScale(d.population))
        );

    // Add Area Component
    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("fill", "url(#pop-gradient)")
        .attr("d", d3.area()
            .x(d => xScale(d.date))
            .y0(yScale(0))
            .y1(d => yScale(d.population)))

    const mytooltip = svg.append("g")
        .attr("class", "mytooltip")
        .style("display", "none");

    svg.append("linearGradient")
        .attr("id", "pop-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", yScale(maxCapacity))
        .attr("x2", 0).attr("y2", yScale(d3.max(data, d=>d.population)))
        .selectAll("stop")
        .data([
            {offset: "0%", color: mypale},
            {offset: "1%", color: myred},
            {offset: "100%", color: myred}
        ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    //would you believe it, I got this almost completely right on the first try. Just had to fiddle with the x values a bit.
    svg.append("line")
        .attr("class", "maxcapacity")
        .style("stroke", myred)
        .style("stroke-dasharray", "6,2")
        .style("opacity", 0.9)
        .attr("x1", padding)
        .attr("x2", xScale(d3.max(data, d=>d.date)))
        .attr("y1", yScale(maxCapacity)) //and here is where I remembered to change 100,000 to a variable, so it wouldn't be hardcoded as a magic number
        .attr("y2", yScale(maxCapacity));


    // append the rectangle to capture mouse
    svg.append("rect")
        .attr("width", width1)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { mytooltip.style("display", null); })
        .on("mouseout", function() { mytooltip.style("display", "none"); })
        .on("mousemove", mousemove);



    // append the x line
    mytooltip.append("line")
        .attr("class", "x")
        .style("stroke", mydarkgreen)
        .style("stroke-dasharray", "3,3")
        .style("stroke-width", "4")
        .style("opacity", 0.9)
        .attr("y1", 0)
        .attr("y2", height);

    // add the population
    mytooltip.append("text")
        .attr("class", "y1")
        .style("stroke", "white")
        .style("stroke-width", "5px")
        .style("opacity", 0.8)
        .style("z-index", "10000")
        .attr("dx", 8)
        .attr("dy", "-.3em");
    mytooltip.append("text")
        .attr("class", "y2")
        .style("z-index", "10000")
        .attr("dx", 8)
        .attr("dy", "-.3em");

    // add the date
    mytooltip.append("text")
        .attr("class", "y3")
        .style("stroke", "white")
        .style("stroke-width", "5px")
        .style("opacity", 0.8)
        .style("z-index", "10000")
        .attr("dx", 8)
        .attr("dy", "1em");
    mytooltip.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .style("z-index", "10000")
        .attr("dy", "1em");

    // debugging this was a bitch and a half.
    function mousemove(event){
        let x0 = xScale.invert(d3.pointer(event, this)[0]);
        let bisectDate = d3.bisector(d=> d.date).left;
        let i= bisectDate(data, x0);
        let d0 = data[i -1];
        let d1 = data[i];
        let d = x0-d0.date > d1.date - x0 ? d1: d0;
        console.log(d);
        let formatDate = d3.timeFormat("%d-%b");


        //replace translation height with 3*padding to maintain fixed height rather than changing
        mytooltip.select("text.y1")
            .attr("transform",
                "translate(" + xScale(d.date) + "," +
                yScale(d.population+20000) + ")")
            .text(d.population);

        mytooltip.select("text.y2")
            .attr("transform",
                "translate(" + xScale(d.date) + "," +
                yScale(d.population+20000) + ")")
            .text(d.population);

        mytooltip.select("text.y3")
            .attr("transform",
                "translate(" + xScale(d.date) + "," +
                yScale(d.population+20000) + ")")
            .text(formatDate(d.date));

        mytooltip.select("text.y4")
            .attr("transform",
                "translate(" + xScale(d.date) + "," +
                yScale(d.population+20000) + ")")
            .text(formatDate(d.date));

        mytooltip.select(".x")
            .attr("transform",
                "translate(" + xScale(d.date) + "," +
                yScale(d.population) + ")")
            .attr("y2", height-2*padding- yScale(d.population));
        

    }
}

