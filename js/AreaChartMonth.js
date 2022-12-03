/* * * * * * * * * * * * * *
*       AreaChart          *
* * * * * * * * * * * * * */


class AreaChartMonth {

    constructor(_parentElement, _data, _title, _number) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.title = _title;
        this.number = _number;
        this.displayData = [];
        this.parseDate = d3.timeParse("%m/%d/%Y");

        // call method initVis
        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.displayData = vis.data;

        vis.margin = {top: 0, right: 0.5, bottom: 50, left: 0.5};
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

        vis.svg.append('g').append('text').classed('tooltip_chart_text', true);
        vis.month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']


        // console.log("value: ", button_chart_value)

        // area chart
        // var x = d3.scaleBand()
        vis.x = d3.scalePoint()
            .domain(vis.displayData.map(d=>d.timestamp))
            .range([0, vis.width]);

        vis.x2 = d3.scaleOrdinal()
            .domain(vis.month)
            .range([0, vis.width]);

        vis.inverseModeScale = d3.scaleQuantize()
            .domain(vis.x2.range())
            .range(vis.x2.domain());

        vis.y = d3.scaleLinear()
            // .domain([0, 28269715.24063562])
            .range([vis.height, 0]);

        vis.area = d3.area();
        vis.chart = vis.svg.append("path");

        // label the climate zones
        var label = vis.svg.append("g")
            .classed('label', true)
            .append('text')
            .text(vis.title)
            .attr("x", 15)
            .attr("y", vis.height+15)
            .attr('alignment-baseline','alphabetic')
            .attr('text-anchor','end')
            .attr('fill', 'rgb(255,255,255)');


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
            .attr('fill', '#999999')
            .on('mouseover', function(event, d) {
                // console.log("d: ", d);
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .style('fill', 'rgb(255,255,255,0.8)')
                // console.log("button chart value: ", button_chart_value)

            })
            .on('mousemove', function(event, d) {
                let mouse = d3.pointer(event);
                if (mouse[0] < vis.width+vis.margin.right && mouse[0] >vis.margin.left) {
                    let mouse_value = vis.y.invert(mouse[1]);
                    let mouse_time = vis.inverseModeScale(mouse[0]);
                    // console.log("mouse_time: ", mouse_time)

                    vis.svg.selectAll('.tooltip_chart_text')
                        .data(vis.data)
                        .style("opacity", 1)
                        .text(mouse_time + ": " + f(mouse_value) + " kwh")
                        .attr("x", 30)
                        .attr("y", vis.height + 15)
                        .attr('alignment-baseline', 'alphabetic')
                        // .attr('text-anchor','end')
                        .attr('fill', 'rgb(255,255,255)')
                }
            })
            .on('mouseout', function(event, d) {
                // console.log("d: ", d);
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .style('fill', '#999999')

                vis.svg.selectAll('.tooltip_chart_text')
                    .style("opacity", 0)
            })


    }

}