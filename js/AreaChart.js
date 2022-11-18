/* * * * * * * * * * * * * *
*       AreaChart          *
* * * * * * * * * * * * * */


class AreaChart {

    constructor(_parentElement, _data, _title) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.title = _title;
        this.displayData = [];
        this.parseDate = d3.timeParse("%m/%d/%Y");

        // call method initVis
        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.displayData = vis.data;

        vis.margin = {top: 0, right: 200, bottom: 0, left: 200};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        // vis.svg = d3.selectAll(".areaChart-tooltip"+ ",#" + vis.parentElement).append("svg")
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // clip path
        vis.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // label the climate zones
        var label = vis.svg.append("g")
            .classed('label', true)
            .append('text')
            .text(vis.title)
            .attr("x", -10)
            .attr("y", vis.height-4)
            .attr('alignment-baseline','alphabetic')
            .attr('text-anchor','end')
            .attr('fill', 'rgb(255,255,255)');



        console.log("value: ", button_chart_value)

        // area chart
        // var x = d3.scaleBand()
        vis.x = d3.scalePoint()
            .domain(vis.displayData.map(d=>d.timestamp))
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            // .domain([0, 28269715.24063562])
            .range([vis.height, 0]);

        vis.area = d3.area();
        vis.chart = vis.svg.append("path");


        this.wrangleDataStatic();

    }
    wrangleDataStatic() {
        let vis = this;

        this.updateVis();
    }

    updateVis(){
        let vis = this;

        vis.y.domain([0, d3.max(vis.displayData, function(d) { return d[button_chart_value]; })])

        vis.area
            .x(function(d) { return vis.x(d.timestamp); })
            .y0(vis.height)
            .y1(function(d) { return vis.y(d[button_chart_value]); })
            .curve(d3.curveStep);

        vis.chart.datum(vis.displayData)
            .attr("class", "area")
            .attr("d", vis.area)
            .attr('fill', 'rgba(255,255,255,0.2)')


    }

}