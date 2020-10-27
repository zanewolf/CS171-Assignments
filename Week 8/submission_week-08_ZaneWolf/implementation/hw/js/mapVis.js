/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */



class MapVis {

    constructor(parentElement, mapData, covidData, usaData) {
        this.parentElement = parentElement;
        this.covidData = covidData;
        this.usaData = usaData;
        this.mapData = mapData;
        this.displayData = [];

        // parse date method
        this.parseDate = d3.timeParse("%m/%d/%Y");

        this.initVis()
    }

    initVis(){

        let vis = this;
        vis.selectedCategory = 'absCases';

        // set up margin conventions
        vis.margin = {top: 50, right: 20, bottom: 20, left: 20};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // draw svg area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);


        // don't need .projection because we are using the pre-projected data
        // vis.projection = d3.geoAlbersUsa()
        //     .translate([vis.width / 2, vis.height / 2]);

        // define path
        vis.path = d3.geoPath();
            // .projection(vis.projection);

        // shoutout to robert r.
        vis.viewpoint = {'width':975, 'height': 1000};
        vis.zoom = vis.width/vis.viewpoint.width;

        vis.map = vis.svg.append("g")
            .attr("class", "statesGroup")
            .attr('transform', `scale(${vis.zoom} ${vis.zoom})`);

        // this does something. Idk what exactly.
        let optimized = topojson.feature(vis.mapData, vis.mapData.objects.states).features

        // draw the map
        vis.states = vis.map.selectAll(".state").data(optimized)
            .enter()
            .append("path")
            .attr("class", "state")
            .attr("fill", "transparent")
            .attr("d", vis.path)

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip');

        // append legend
        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('id', 'legend')
            .attr('transform', `translate(${vis.margin.left}, ${vis.height - 80})`)


        this.wrangleData(vis.selectedCategory)
    }

    wrangleData(selectedCategory){
        let vis = this;
        vis.selectedCategory = selectedCategory;


        let filteredData = [];

        // if there is a region selected
        if (selectedTimeRange.length !== 0){
            //console.log('region selected', vis.selectedTimeRange, vis.selectedTimeRange[0].getTime() )

            // iterate over all rows the csv (dataFill)
            vis.covidData.forEach( row => {
                // and push rows with proper dates into filteredData
                if (selectedTimeRange[0].getTime() <= vis.parseDate(row.submission_date).getTime() && vis.parseDate(row.submission_date).getTime() <= selectedTimeRange[1].getTime() ){
                    filteredData.push(row);
                }
            });
        } else {
            filteredData = vis.covidData;
        }

        // console.log(filteredData)

        // prepare covid data by grouping all rows by state
        let covidDataByState = Array.from(d3.group(filteredData, d =>d.state), ([key, value]) => ({key, value}))

        // have a look
        // console.log(covidDataByState)

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

        vis.updateVis()
    }

    updateVis(){
        let vis = this;

        // set up the Legend
        // I wasted so much time getting this legend *just so*.

        // remove the old legend because enter/append/update doesn't seem to want to work on this thing
        vis.svg.select('.legend').select('g').remove();

        // added a cushion to the scale, don't mind the ugliness.
        vis.colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateGnBu)
            .domain([d3.min(vis.stateInfo, d=>d[vis.selectedCategory])-d3.min(vis.stateInfo, d=>d[vis.selectedCategory])*0.05,d3.max(vis.stateInfo, d=>d[vis.selectedCategory])+d3.max(vis.stateInfo, d=>d[vis.selectedCategory])*0.15])

        // *just so*
        vis.colorLegend = d3.legendColor()
            .scale(vis.colorScale)
            .orient("horizontal")
            .cells(10)
            .shapePadding(20)
            .shapeWidth(60)
            .shapeHeight(20)
            .labelOffset(15)

        // *just so intensifies*
        if (vis.selectedCategory==="absCases"){
            vis.colorLegend.labelFormat('.2s')
        } else if (vis.selectedCategory ==="absDeaths"){
            vis.colorLegend.labelFormat(',.2r')
        } else if (vis.selectedCategory ==="relCases"){
            vis.colorLegend.labelFormat('.2')
            // wanted to add "%" to each of these, but couldn't find a simplistic way to do it. *JUST SOOOOO*
        } else {
            vis.colorLegend.labelFormat('.2')
            // ditto
        }

        vis.legend
            .call(vis.colorLegend)

        // a second way to make a legend.
        // it's continuous, but only vertical and requires legend2.js. Wasn't worth the hassle of making sure it was placed right, so bewarned if you uncomment. O.o
        // continuous("#mapDiv", vis.colorScale)



        // making a map
        vis.states
            .attr("fill", function(d){
                // console.log(d)
                let myState = d.properties.name;
                let color = ""
                // Robert suggested making a lookup table. With a bigger data set, I would. But for this, I'm fine being a brute.
                vis.stateInfo.forEach(state=> {
                    if (state.state === myState) {
                        color =  vis.colorScale(state[vis.selectedCategory])
                    }

                })
                return color;
            })
            .on('mouseover', function(event, d){
                // console.log(d)
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'grey')

                let myState = d.properties.name
                let myStateInfo = vis.stateInfo.filter(function(d){
                    return d.state == myState;
                })

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    // .text("Herllo ourt thheeerrr")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                             <h3>${d.properties.name}<h3>
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
                        let myState = d.properties.name
                        let myStateInfo = vis.stateInfo.filter(function(d){
                            return d.state == myState;
                        })

                        return vis.colorScale(myStateInfo[0][vis.selectedCategory])
                    })

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });
    }

}
