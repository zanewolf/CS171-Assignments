/* * * * * * * * * * * * * *
*      class BarVis        *
* * * * * * * * * * * * * */


class BarVis {

    constructor(parentElement, covidData, usaData, toBe, barTitle){
        this.parentElement = parentElement;
        this.covidData = covidData;
        this.usaData = usaData;
        this.toBe = toBe;
        this.barTitle = barTitle;

        console.log(this.toBe)
        // if toBe is true, get top ten. if not toBe, then get bottom ten.
        // parse date method
        this.parseDate = d3.timeParse("%m/%d/%Y");

        this.initVis()
    }

    initVis(){
        let vis = this;
        vis.selectedCategory = 'absCases';

        vis.margin = {top: 20, right: 20, bottom: 40, left: 40};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title bar-title')
            .append('text')
            .text(vis.barTitle)
            .attr('transform', `translate(${vis.width / 2}, 10)`)
            .attr('text-anchor', 'middle');

        // add scales and axes

        //y
        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale)

        vis.svg.append("g")
            .attr("class", "y-axis axis")

        // x
        // or y not
        vis.xScale=d3.scaleBand()
            .range([10, vis.width])
            .paddingInner(0.2);

        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale)

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0,"+vis.height+")");

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip');


        this.wrangleData(vis.selectedCategory);
    }

    wrangleData(selectedCategory){
        let vis = this
        vis.selectedCategory = selectedCategory


        // first, filter according to selectedTimeRange, init empty array
        let filteredData = [];

        // if there is a region selected
        if (selectedTimeRange.length !== 0){
            //console.log('region selected', vis.selectedTimeRange, vis.selectedTimeRange[0].getTime() )

            // iterate over all rows the csv (dataFill)
            vis.covidData.forEach( row => {
                // and push rows with proper dates into filteredData
                if (selectedTimeRange[0].getTime() <= vis.parseDate(row.submission_date).getTime() && vis.parseDate(row.submission_date).getTime() <= selectedTimeRange[1].getTime() ){
                    filteredData.push(row);
                    console.log("time shift");
                }
            });
        } else {
            filteredData = vis.covidData;
        }

        // prepare covid data by grouping all rows by state
        let covidDataByState = Array.from(d3.group(filteredData, d =>d.state), ([key, value]) => ({key, value}))

        // init final data structure in which both data sets will be merged into
        vis.stateInfo = []

        // merge
        covidDataByState.forEach( state => {

            // get full state name
            let stateName = nameConverter.getFullName(state.key)

            // init counters
            let newCasesSum = 0;
            let newDeathsSum = 0;
            let population = 0;

            // look up population for the state in the census data set
            vis.usaData.forEach( row => {
                if(row.state === stateName){
                    population += +row["2019"].replaceAll(',', '');
                }
            })

            // calculate new cases by summing up all the entries for each state
            state.value.forEach( entry => {
                newCasesSum += +entry['new_case'];
                newDeathsSum += +entry['new_death'];
            });

            // populate the final data structure
            vis.stateInfo.push(
                {
                    state: stateName,
                    population: population,
                    absCases: newCasesSum,
                    absDeaths: newDeathsSum,
                    relCases: (newCasesSum/population*100),
                    relDeaths: (newDeathsSum/population*100)
                }
            )
        })

        if (vis.toBe){
            vis.stateInfo.sort((a,b) => {return b[vis.selectedCategory] - a[vis.selectedCategory]})
        } else {
            vis.stateInfo.sort((a,b) => {return a[vis.selectedCategory] - b[vis.selectedCategory]})
        }

        // console.log('final data structure', vis.stateInfo);

        vis.topTenData = vis.stateInfo.slice(0, 10)

        // console.log('final data structure', vis.topTenData);

        vis.updateVis()

    }

    updateVis(){
        let vis = this;

        // define color scale so that bars match the map
        vis.colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateYlOrRd)
            .domain([d3.min(vis.stateInfo, d=>d[vis.selectedCategory])-d3.min(vis.stateInfo, d=>d[vis.selectedCategory])*0.05,d3.max(vis.stateInfo, d=>d[vis.selectedCategory])+d3.max(vis.stateInfo, d=>d[vis.selectedCategory])*0.15])

        // update the axes
        vis.xScale.domain(vis.topTenData.map(d=>d.state))
        vis.yScale.domain([0,d3.max(vis.topTenData, d=>d[vis.selectedCategory])])
        vis.svg.select(".x-axis")
            .call(vis.xAxis)
            .selectAll("text")
            .attr("dx", "-2em")
            .attr("dy", "1em")
            .attr("transform", "rotate(-10)");


        //*just so v2*
        if (vis.selectedCategory==="absCases"){
            vis.svg.select(".y-axis").call(vis.yAxis.tickFormat(d3.format('.2s')));
        } else if (vis.selectedCategory ==="absDeaths"){
            vis.svg.select(".y-axis").call(vis.yAxis.tickFormat(d3.format(',.2r')));
        } else if (vis.selectedCategory ==="relCases"){
            vis.svg.select(".y-axis").call(vis.yAxis.tickFormat(d3.format('.2')));
            // wanted to add "%" to each of these, but couldn't find a simplistic way to do it. *JUST SOOOOO*
        } else {
            vis.svg.select(".y-axis").call(vis.yAxis.tickFormat(d3.format('.2')));
            // ditto
        }


        // make rectangles
        vis.bar = vis.svg.selectAll("rect")
            .data(vis.topTenData);

        // enter and update
        vis.bar.enter().append("rect")
            .merge(vis.bar)
            .transition()
            .duration(500)
            .attr("class", "bar")
            .attr("x", function (d) { return vis.xScale(d.state);} )
            .attr("y", function(d) { return vis.yScale(d[vis.selectedCategory]); })
            .attr("height", function(d) { return (vis.height-vis.yScale(d[vis.selectedCategory])); })
            .attr("width", vis.xScale.bandwidth() )
            .attr("fill", d=> vis.colorScale(d[vis.selectedCategory]))
            .attr("stroke-width", "4");

        //add tooltip functions
        vis.bar
            .on('mouseover', function(event, d){
            console.log(d)
            d3.select(this)
                .attr('stroke-width', '2px')
                .attr('stroke', 'black')
                .attr('fill', 'grey')

            let myState = d.state
            let myStateInfo = vis.topTenData.filter(function(d){
                return d.state == myState;
            })

            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                // .text("Herllo ourt thheeerrr")
                .html(`
                     <div style="border: thin solid grey; border-radius: 5px; background: darkgrey; padding: 20px">
                         <h3>${d.state}<h3>
                         <p> <strong> Population </strong>: ${myStateInfo[0].population}</p>  
                         <p> <strong>Absolute Cases: </strong>${myStateInfo[0].absCases}</p>
                         <p> <strong>Absolute Deaths: </strong>${myStateInfo[0].absDeaths}</p>
                         <p> <strong>Relative Cases: </strong>${myStateInfo[0].relCases.toFixed(2)}%</p>
                         <p> <strong>Relative Deaths: </strong>${myStateInfo[0].relDeaths.toFixed(3)}%</p>    
                     </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", function(d){
                        console.log(d)
                        let myState = d.state
                        let myStateInfo = vis.stateInfo.filter(function(d){
                            return d.state == myState;
                        })

                        return vis.colorScale(vis.stateInfo[0][vis.selectedCategory])
                    })

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

        vis.bar.exit().remove();

    }



}