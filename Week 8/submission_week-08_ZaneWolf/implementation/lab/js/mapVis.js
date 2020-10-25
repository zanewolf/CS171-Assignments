/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */


class MapVis {

    constructor(parentElement, airportData, geoData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.airportData = airportData;

        // define colors
        this.colors = ['#fddbc7','#f4a582','#d6604d','#b2182b']

        this.initVis()
    }

    initVis() {
        let vis = this;


        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title map-title')
            .append('text')
            .text('Airport Densities by Country')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        vis.projection = d3.geoOrthographic()
            //d3.geoStereographic()//
            // .scale(280
            .translate([vis.width / 2, vis.height / 2.05])
            // .clipAngle(90);

        vis.path = d3.geoPath()
            .projection(vis.projection)
            .pointRadius(d=> d.radius);

        vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries).features;
        console.log(vis.world);


        // sphere
        vis.svg.append("path")
            .datum({type: "Sphere"})
            .attr("class", "graticule")
            .attr('fill', '#ADDEFF')
            .attr("stroke","rgba(129,129,129,0.35)")
            .attr("d", vis.path);


        //countries
        vis.countries = vis.svg.selectAll(".country")
            .data(vis.world)
            .enter().append("path")
            .attr('class', 'country')
            .attr("d", vis.path);

        // plot the airports
        vis.airports = vis.svg.selectAll(".circle")
            .data(vis.airportData.nodes)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("cx", function(d) {
                return vis.projection([d.longitude, d.latitude])[0];
            })
            .attr("cy", function(d) {
                return vis.projection([d.longitude, d.latitude])[1];
            })
        // so, plotting the airports, and more specifically getting the ones on the other side of the world to disappear was a huge pain in the ass. The legend suffered for it. :/

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip');



        // create legend item
        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('id', 'legend')
            .attr('transform', `translate(${vis.width / 3}, ${vis.height - 50})`)


        vis.legend.selectAll(".box")
            .data(vis.colors)
            .enter()
            // .append("text")
            // .text("0")
            .append("rect")
            .attr("class", "box")
            .attr("width", 50)
            .attr("height", 25)
            // .attr("x", vis.width - 200)
            .attr("x", function(d, i) {
                return i * 50;
            })
            .attr("fill", function(d,i){return vis.colors[i]});

        // Yes, this is brute force. Yes, it is ugly. Yes, I could have done it better.
        // But no, I'm done with this lab, and I'm not going to. :/
        vis.legend
            .append("text")
            .attr("class", "text")
            .attr("x", 0)
            .attr("y", -5)
            .text("0")
            .style("text-anchor", "middle");

        vis.legend
            .append("text")
            .attr("class", "text")
            .attr("x", 200)
            .attr("y", -5)
            .text("100")
            .style("text-anchor", "middle");


        let m0,
            o0;

        vis.svg.call(
            d3.drag()
                .on("start", function (event) {

                    let lastRotationParams = vis.projection.rotate();
                    m0 = [event.x, event.y];
                    o0 = [-lastRotationParams[0], -lastRotationParams[1]];
                })
                .on("drag", function (event) {
                    if (m0) {
                        let m1 = [event.x, event.y],
                            o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
                        vis.projection.rotate([-o1[0], -o1[1]]);
                    }

                    // Update the map
                    vis.path = d3.geoPath().projection(vis.projection);
                    d3.selectAll(".country").attr("d", vis.path)
                    d3.selectAll(".graticule").attr("d", vis.path)
                    d3.selectAll(".circle")
                        .attr("cx", function(d) {
                        return vis.projection([d.longitude, d.latitude])[0];
                         })
                        .attr("cy", function(d) {
                            return vis.projection([d.longitude, d.latitude])[1];
                        })
                        //Funnily enough, these two solutions (changing opacity and style display) both achieve the exact same thing. Weird selection of appearing and disappearing cities. Like, take a look at the US. All four airports should be visible as long as the US is visible. And yet? Sporadic display.  ¯\_(ツ)_/¯
                        // .attr("opacity", function(d) {
                        //     const visible = vis.path(
                        //         {type: 'Point', coordinates: vis.projection([d.longitude, d.latitude])});
                        //     return visible ? '1.0' : '0';
                        // })
                        .style("display", function(d) {

                            var circle = vis.projection([d.longitude, d.latitude]);
                            var rotate = vis.projection.rotate(); // antipode of actual rotational center.
                            // console.log(circle);
                            // console.log(rotate)
                            var center = [-rotate[0], -rotate[1]]

                            var distance = d3.geoDistance(circle,center);
                            // console.log(distance);
                            return (distance > Math.PI/2 ) ? 'none' : 'inline';
                        });

                })
        )


        vis.wrangleData()

    }

    wrangleData(){
        let vis = this;

        // create random data structure with information for each land
        vis.countryInfo = {};
        vis.geoData.objects.countries.geometries.forEach( d => {
            let randomCountryValue = Math.random() * 4
            vis.countryInfo[d.properties.name] = {
                name: d.properties.name,
                category: 'category_' + Math.floor(randomCountryValue),
                color: vis.colors[Math.floor(randomCountryValue)],
                value: randomCountryValue/4 * 100
            }
        });

        console.log(vis.countryInfo);

        vis.updateVis()
    }



    updateVis(){
        let vis = this;



        vis.countries
            .attr("fill", d=>vis.countryInfo[d.properties.name].color)
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'purple')


                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    // .text("Herllo ourt there")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                             <h3>${d.properties.name}<h3>
                             <h4> Value: ${vis.countryInfo[d.properties.name].value}</h4>
                             <h4> Category: ${vis.countryInfo[d.properties.name].category}</h4>

                         </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", vis.countryInfo[d.properties.name].color)

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

            vis.airports
                .attr("r", 5)
                .style("fill", "yellow")
                .style("stroke", "gray")
                .style("stroke-width", 0.1)
                .append("title")//Simple tooltip
                .text(function(d) {
                    return d.country + ": " + d.name;
                })

    }
}
