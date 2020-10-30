/* * * * * * * * * * * * * *
*      class MatrixVis        *
* * * * * * * * * * * * * */
// remember to add to index.html



class MatrixVis {
    constructor(parentElement, familyData, marriageData, businessData){
        this.parentElement = parentElement;
        this.familyData = familyData;
        this.marriageData = marriageData;
        this.businessData = businessData;
        this.displayData = [];

        vis.cellHeight = 50;
        vis.cellPadding = 10;

        // console.log(this.businessData, this.businessData[6][3])

        this.initVis()
    }

    initVis(){
        let vis=this;

        // define margins
        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.width = $("#" + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("#" + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add left labels - family names
        // add top labels - family names in one-to-one
        // add tooltip








        vis.wrangleData()
    }

    wrangleData(){
        let vis = this;
        vis.marriageData.forEach((d, i)=>{
            // console.log(d)

            vis.displayData.push({
                index: i,
                name: vis.familyData[i].Family,
                allRelations: d3.sum(d),
                businessTies: d3.sum(vis.businessData[i]),
                businessValues:vis.businessData[i],
                marriageValues:d,
                numberPriorates: vis.familyData[i].Priorates,
                wealth: vis.familyData[i].Wealth
            })
        })

        console.log(vis.displayData);

        vis.updateVis()
    }

    updateVis(){
        let vis = this;

        // define row element, one per family

        vis.displayData.forEach(row=>{

            vis.svg.append("g")
                .attr("class", "matrix-row")
                .attr("transform", "translate(0,"+);


        })




        // let edgeCells = rows.selectAll(".matrix-cell-marriage")
        //     .data(function(d){
        //         console.log(d)
        //         return d.marriageValues
        //     });
        //
        // edgeCells.enter().append("path")
        //     .attr("class", "matrix-cell-marriage")
        //     .merge(edgeCells)
        //     .attr("d", function(d, index) {
        //         console.log("here")
        //         // Shift the triangles on the x-axis (columns)
        //         let x = (vis.cellWidth + vis.cellPadding) * index;
        //
        //
        //         let y = 0;
        //
        //         return 'M ' + x +' '+ y + ' l ' + vis.cellWidth + ' 0 l 0 ' + vis.cellHeight + ' z';
        //     })
        //     .attr("fill","blue")
        //
        //
        // edgeCells.exit().remove();

        console.log("here")
    }

}