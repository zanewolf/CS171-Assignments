/* * * * * * * * * * * * * *
*      class MatrixVis        *
* * * * * * * * * * * * * */
// remember to add to index.html

// for the record, this was a LOT of work for 1 point.

class MatrixVis {
    constructor(parentElement, familyData, marriageData, businessData){
        this.parentElement = parentElement;
        this.familyData = familyData;
        this.marriageData = marriageData;
        this.businessData = businessData;

        this.cellHeight = 35;
        this.cellPadding = 5;

        // console.log(this.businessData, this.businessData[6][3])

        this.initVis()
    }

    initVis(){
        let vis=this;

        // define margins
        vis.margin = {top: 100, right: 20, bottom: 0, left: 250};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;

        // console.log($('#'+vis.parentElement).width())
        // vis.width = 1600 - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // init rectangles
        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('id', 'legend')
            .attr('transform', `translate(${vis.width-vis.width/4}, ${vis.height/4})`)

        vis.colors=[color2, color1];
        console.log(vis.colors);

        vis.legend.selectAll(".box")
            .data(vis.colors)
            .enter()
            // .append("text")
            // .text("0")
            .append("rect")
            .attr("class", "box")
            .attr("width", 20)
            .attr("height", 20)
            // .attr("y", vis.width - 200)
            .attr("y", function(d, i) {
                return i * 150;
            })
            .attr("fill", d=>d)

        // brute force legend again. Woohoo.
        vis.legend
            .append("text")
            .attr("class", "text")
            .attr("x", 5)
            .attr("y", -20)
            .text("Marriages")
            .style("text-anchor", "middle");

        vis.legend
            .append("text")
            .attr("class", "text")
            .attr("x", 5)
            .attr("y", 130)
            .text("Business")
            .style("text-anchor", "middle");




        vis.wrangleData()
    }

    wrangleData(){
        let vis = this;

        // define displayData here otherwise every update simply adds to the existing displayData object.
        vis.displayData=[];

        vis.marriageData.forEach((d, i)=>{
            // console.log(d)
            let numM = d3.sum(d);
            let numB = d3.sum(vis.businessData[i]);
            let numAll = numM + numB;

            vis.displayData.push({
                index: i,
                name: vis.familyData[i].Family,
                allRelations: numAll,
                businessTies: numB,
                businessValues: vis.businessData[i],
                marriageTies: numM,
                marriageValues: d,
                numberPriorates: vis.familyData[i].Priorates,
                wealth: vis.familyData[i].Wealth
            })
        })

        vis.names = [];

        vis.displayData.forEach((d,i)=> {vis.names[i]=d.name})

        // grab filter value
        vis.filterVal = $('#filterOrder').val()

        // sort based on filter value
        if (vis.filterVal !== "default"){
            vis.displayData.sort((a,b)=>{
                return b[vis.filterVal]-a[vis.filterVal];
            })
        }

        vis.updateVis()
    }

    updateVis(){
        let vis = this;

        vis.row = vis.svg.selectAll("g.matrix-row")
            .data(vis.displayData, d=>d.name);

        // define row groups
        vis.rowGroups = vis.row
            .enter()
            .append("g")
            .attr("class", "matrix-row")
            .attr("id", d=>d.id)
            .attr("transform", (d,i)=> "translate(0,"+(vis.cellHeight+vis.cellPadding)*i+")")
            .merge(vis.row);

        // remove previous labels
        vis.row.selectAll(".row-label").remove()


        // define triangles
        vis.triangles = vis.rowGroups.append("g")
            .attr("class", "triangles")
            .attr("id", d=>d.id)

        // upper triangle
        vis.triangles.selectAll(".marriage-tri")
            .data(d=>d.marriageValues)
            .enter()
            .append("path")
            .attr("class", "marriage-tri")
            .merge(vis.triangles)
            .attr("d", function(d,i){
                let x = (vis.cellHeight + vis.cellPadding) * i;
                let y = 0;

                return 'M ' + x +' '+ y + ' l ' + vis.cellHeight + ' 0 l 0 ' + vis.cellHeight + ' z';

            })
            .attr("fill", d=> (d===1)? color2: color4);

        // lower triangle
        vis.triangles.selectAll(".business-tri")
            .data(d=>d.businessValues)
            .enter()
            .append("path")
            .attr("class", "business-tri")
            .merge(vis.triangles)
            .attr("d", function(d,i){
                let x = (vis.cellHeight + vis.cellPadding) * i;
                let y = 0;

                return 'M ' + x +' '+ y + ' l 0 ' + vis.cellHeight + ' l ' + vis.cellHeight + ' 0 z';

            })
            .attr("fill", d=> (d===1)? color1: color4);

        vis.triangles.exit().remove();

        // add row labels
        vis.rowGroups
            .append("text")
            .attr("class", "row-label")
            .attr("transform", (d,i)=>"translate("+-10+","+(vis.cellHeight+vis.cellPadding)/2+")")
            .attr("text-anchor", "end")
            .text(d=>d.name)

        vis.rowGroups.merge(vis.rowGroups).transition().duration(1000);


        // exit
        vis.row.exit().remove();


        // column labels
        vis.colGroups = vis.svg.selectAll("g.matrix-row")
            .data(vis.names);

        vis.colGroups
            .append("text")
            .attr("class", "col-label")
            .attr("transform", (d,i)=>"translate("+(((vis.cellHeight+vis.cellPadding)*i)+10)+","+((-(vis.cellHeight+vis.cellPadding)*i)-5)+") rotate(-45)")
            // .attr("transform", "rotate(45)")
            // .attr("text-anchor", "end")
            .text(d=>d)


        //append legend




    }

}