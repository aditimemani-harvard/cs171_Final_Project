
class TotalStackedAreaChart {

// constructor method to initialize StackedAreaChart object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = Array.from(d3.group(this.data[0], d => d.Entity))[0][1]

        // console.log("Stacked Area Chart Data:", this.displayData)

        this.dataCategories = [];

        for (let k in this.displayData[0]) {

            if (k != "Year")
                this.dataCategories.push(k)
            if (k == "Year")
                continue
        }

    }

    /*
     * Method that initializes the visualization (static content, e.g. SVG area or axes)
     */
    initVis(){
        let vis = this;

        vis.margin = {top: 50, right: 0, bottom: 200, left: 30};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom

        // console.log(vis.width)
        // console.log(vis.height)

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right+70)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom+70)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // List of groups = header of the csv files
        vis.keys = vis.data[0].columns.slice(1)

        // Add X axis
        vis.x = d3.scaleTime()
            .domain(d3.extent(vis.data[0], function(d) { return d.Year; }))
            .range([ 0, vis.width ]);
        vis.y = d3.scaleLinear()
            .domain([0, 42])
            .range([ vis.height, 0 ]);

        // vis.svg.append("g")
        // 	.attr("transform", "translate(0," + vis.height*0.6 + ")")
        // 	.call(d3.axisBottom(vis.x).tickSize(- vis.height*.7).tickValues([1900, 1925, 1975, 2000]))
        // 	.select(".domain").remove()

        // Customization
        vis.svg.selectAll(".tick line").attr("stroke", "black")

        // Add X axis label:
        vis.svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", 120)
            .attr("y", vis.height + 50)
            .text("Time (Years)")
            .style('font-family', 'Helvetica')
            .style('font-size', '14px')
            .style('font-weight', 'bold').style('fill', 'white');

        // Add Y axis

        // console.log(vis.max_y)

        // vis.yAxis= svg.append("g")
        //     .call(d3.axisLeft(y))
        //     .style('color', 'white')
        //     .style('font-family', 'Helvetica')
        // vis.yAxis.select(".domain")
        //     .attr("stroke","black")
        //     .attr("stroke-width","6px")

        var customPalette = [ '#A71E34',
            '#bbbbbb',];


        // color palette
        vis.color = d3.scaleOrdinal()
            .domain(vis.keys)
            .range(customPalette)
        //.range(d3.schemeGreens[9]);

        //stack the data?
        vis.stackedData = d3.stack()
            // .offset(d3.stackOffsetSilhouette)
            .keys(vis.keys)
            (vis.data[0])

        // create a tooltip
        vis.Tooltip = vis.svg
            .append("text")
            .attr("x", width/3)
            .attr("y", 0)
            .style("opacity", 0)
            .style("font-size", 20)

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
            vis.Tooltip.style("opacity", 1)
            d3.selectAll(".myArea").style("opacity", .2)
            d3.select(this)
                .style("stroke", "white")
                .style("opacity", 1)
        }
        var mousemove = function(d,i) {
            vis.Tooltip.text('  Category '+i.key).style('font-size', 15).style('fill', 'white')
        }
        var mouseleave = function(d) {
            vis.Tooltip.style("opacity", 0)
            d3.selectAll(".myArea").style("opacity", 1)
                .style("stroke", "none")
                // .style("stroke", "black").style("stroke-width", 2)
        }

        // Area generator
        vis.area = d3.area()
            .x(function(d) { return vis.x(d.data.Year); })
            .y0(function(d) { return vis.y(d[0]); })
            .y1(function(d) { return vis.y(d[1]); })

        // Show the areas
        vis.svg
            .selectAll("mylayers")
            .data(vis.stackedData)
            .enter()
            .append("path")
            .attr("class", "myArea")
            // .style('stroke', 'black')
            // .style('stroke-width', '2px')
            .style("fill", function(d) { return vis.color(d.key); })
            .attr("d", vis.area)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);
        // vis.xAxis.select(".domain")
        //     .attr("stroke","black")
        //     .attr("stroke-width","6px")
        // Append x-axis
        vis.svg.append("g")
            .attr("class", "x-axis axis-stacked")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxis).style('color', 'white').style('font-size', 10).style('font-family', 'Helvetica');

        // Append y-axis
        vis.yAxis = d3.axisLeft()
            .scale(vis.y);
        // vis.yAxis.select(".domain")
        //     .attr("stroke","black")
        //     .attr("stroke-width","6px")


        vis.svg.append("g")
            .attr("class", "y-axis axis-stacked")
            // .attr("transform", "translate(0," + vis.height + ")")
            .call(vis.yAxis).style('color', 'white').style('font-size', 10).style('font-family', 'Helvetica');
        vis.svg.append("text")
            .attr("text-anchor", "end")
            .attr("y", 0-15)
            .attr("x", 0+10)
            .text("Value")
            .style('font-family', 'Helvetica')
            .style('font-size', '14px')
            .style('font-weight', 'bold').style('fill', 'white');


    }
}