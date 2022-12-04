/* * * * * * * * * * * * * *
*      AreaChartToolTip    *
* * * * * * * * * * * * * */

class AreaChartLegend {
    constructor(_parentElement) {
        this.parentElement = _parentElement;
        // this.parentElement_chart = _parentElement_chart;
        this.initVis();
    }

    initVis() {

        let vis = this;

        // setting the margin
        vis.margin = {top: 0, right: 200, bottom: 0, left: 200};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // scale the x-axis based on the 24 hour range in seconds
        var x = d3.scaleLinear()
            .domain([0, 86400])
            .range([0, vis.width]);

        // append time legend
        const data_test = d3.range(0,25,2);
        const data_time = [];

        // checking out the dataset
        console.log(data_test)

        // creating values for the time legend
        for (let i=0; i<data_test.length; i++){
            data_time[i] = data_test[i] * 3600
        }
        // console.log(data_test);
        console.log(data_time);


        // creating the lines for time legend
        var legend = vis.svg.selectAll(".line-legend")
            .data(data_time)
            .enter()
            .append("g")
            .classed('line-legend', true)

        // appending the lines for time legend
        legend.append("line")
            .style("stroke", 'rgba(255,255,255,0.5)')
            .attr("x1", function(d) {return x(d)})
            .attr("x2", function(d) {return x(d)})
            .style("stroke-width", 1.25)
            .attr("y1", 15)
            .attr("y2", 5);

        // creating the text for time legend
        var legend_text = vis.svg.selectAll(".text-legend")
            .data(data_test)
            .enter()
            .append("g")
            .classed('text-legend', true)

        // appending the text for time legend
        legend_text.append("text")
            .text(function(d) {return d + ":00"})
            .attr("x", function(d) {return x(d*3600)})
            .attr("y", 34)
            .attr('text-anchor','middle')
            // .attr('writing-mode','vertical-rl')
            // .attr('glyph-orientation-vertical','0')
            .attr('fill', 'rgba(255,255,255,0.5)');

    }
}