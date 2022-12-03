
class COMMStackedAreaChart {

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

        vis.margin = {top: 30, right: 30, bottom: 20, left: 30};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom

        // console.log(vis.width)
        // console.log(vis.height)


        // Image tooltip
        let commTooltip = d3.select('#image-tooltip')
        let imageScalePath = ['img/stacked_chart/commercial/Delivered Energy.png',
            'img/stacked_chart/commercial/Distillate Fuel Oil.jpg',
            'img/stacked_chart/commercial/Energy Related Losses.jpg',
            'img/stacked_chart/commercial/Natural Gas.jpg',
            'img/stacked_chart/commercial/Petroleum and Other Liquids Subtotal.jpg',
            'img/stacked_chart/commercial/Purchased Electricity.jpg']

        // let imageScalePath = ['img/climate_type/cold.png','img/climate_type/dry.png', 'img/climate_type/hot.png', 'img/climate_type/humid.png', 'img/climate_type/marine.png',  'img/climate_type/subartic.png', 'img/climate_type/very_cold.png', 'img/climate_type/hot.png', 'img/climate_type/mixed.png', 'img/climate_type/mixed.png']
        let imageScaleSrc = ['Delivered Energy','Distillate Fuel Oil', 'Energy Related Losses',
            'Natural Gas', 'Petroleum and Other Liquids Subtotal', 'Purchased Electricity']
        var imageScale = d3.scaleOrdinal().domain(imageScaleSrc).range(imageScalePath)


        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom + 60)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // List of groups = header of the csv files
        vis.keys = vis.data[0].columns.slice(1)

        // Add X axis
        vis.x = d3.scaleTime()
            .domain(d3.extent(vis.data[0], function(d) { return d.Year; }))
            .range([ 0, vis.width ]);
        vis.y = d3.scaleLinear()
            .domain([0, 30])
            .range([ vis.height, 0 ]);

        // Customization
        vis.svg.selectAll(".tick line").attr("stroke", "black")

        // Add X axis label:
        vis.svg.append("text")
            // .attr("class", "text-legend")
            .attr("text-anchor", "end")
            .attr("x", vis.width)
            .attr("y", vis.height + 40)
            .text("Time (Years)")
            .style('font-family', 'Roboto')
            .style('font-size', '10px')
            .style('fill', 'white');

        var customPalette = ['#eeeeee',
            '#dddddd',
            '#feedcf',
            '#333333',
            '#555555',
            '#777777',
            '#CCCCCC',
            '#bbbbbb',
            '#444444',
            '#555555'];


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
            .attr("x", vis.width/2)
            .attr("y", -19)
            .style("opacity", 0)
            .style("font-size", 20)
            .attr("text-anchor", "middle")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d,i) {
            vis.Tooltip.style("opacity", 1)
            d3.selectAll(".myArea").style("opacity", .2)
            d3.select(this)
                .style("stroke", "white")
                .style("opacity", 1)

            commTooltip
                .html(`<img src=${imageScale(i.key)} width="100%" height="auto">
                  `)
                .style("left", (event.pageX-50)+ "px")
                .style("top", (event.pageY-50) + "px");

        }
        var mousemove = function(d,i) {
            vis.Tooltip.text('  Commercial: '+i.key)
                .style('fill', 'white')
                .style('font-family', 'Roboto')
                .style('font-size', '12px')
                .style('fill', 'white');

        }
        var mouseleave = function(d) {
            // commTooltip.transition()
            //     .style('visibility', 'hidden')
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
            // .on('mouseout', function(event,countyDataItem){
            //     commTooltip.transition()
            //         .style('visibility', 'hidden')
            // })

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .ticks(5);

        vis.svg.append("g")
            .attr("class", "x-axis axis-stacked")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxis).style('color', 'rgba(255, 255, 255, 0.75)').style('font-size', 8).style('font-family', 'Roboto')
            .call(g => g.select(".domain").remove())


        // Append y-axis
        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .ticks(5);


        vis.svg.append("g")
            .attr("class", "y-axis axis-stacked")
            // .attr("transform", "translate(0," + vis.height + ")")
            .call(vis.yAxis).style('color', 'rgba(255, 255, 255, 0.75)').style('font-size', 8).style('font-family', 'Roboto')
            .call(g => g.select(".domain").remove())

        vis.svg.append("text")
            .attr("text-anchor", "end")
            .attr("y", 0-15)
            .attr("x", 0+10)
            .text("Value")
            .style('font-family', 'Roboto')
            .style('font-size', '10px')
            .style('fill', 'white');


    }
}