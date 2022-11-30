/* * * * * * * * * * * * * *
*      AreaChartToolTip    *
* * * * * * * * * * * * * */

class AreaChartTooltip {
    constructor(_parentElement, _parentElement_chart, _data) {
        this.parentElement = _parentElement;
        this.parentElement_chart = _parentElement_chart;
        this.data = _data;

        this.wrangleDataStatic();
    }

    wrangleDataStatic() {
        let vis = this;

        // console.log("tooltip data: ", vis.data[0])
        console.log("vis.displayData: ", vis.data)

        this.initVis();
        this.initVisTime();
    }

    initVis() {

        let vis = this;
        vis.buffer_current = 180;
        vis.buffer_pointer = 50;
        vis.offset_pointer = 25;

        vis.margin = {top: 0, right: 200, bottom: 0, left: 200};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.width_chart = document.getElementById(vis.parentElement_chart).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height_chart = document.getElementById(vis.parentElement_chart).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;


        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // append clip path
        vis.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // scale the x-axis based on the 24-hour range in seconds
        vis.x = d3.scaleLinear()
            .domain([0,86400])
            .range([0, vis.width]);


        // appending the empty tooltips
        vis.svg.append('g').append('line').classed('tooltip_line', true);
        vis.svg.append('g').append('circle').classed('tooltip_circle', true);
        vis.svg.append('g').append('circle').classed('tooltip_circle_chart', true);
        vis.svg.append('g').append('text').classed('tooltip_text', true);
        vis.svg.append('g').append('text').classed('tooltip_text_desc_min', true);
        vis.svg.append('g').append('text').classed('tooltip_text_desc_max', true);
        vis.svg.append('g').append('text').classed('tooltip_chart_text', true);


        // pointer
        d3.select("#" + vis.parentElement)
            .on("mousemove", function(event) {

            let mouse = d3.pointer(event);

            if (mouse[0] < vis.width+vis.margin.right && mouse[0] >vis.margin.left){
                // getting tooltip time
                let mouse_time = vis.x.invert(mouse[0]-vis.margin.left);
                var tooltip_hour = Math.floor(mouse_time / 3600);
                var tooltip_minute = Math.floor((mouse_time - tooltip_hour*3600) / 60);
                let tooltip_increment;
                // console.log("mouse_time", mouse_time)
                // console.log("mouse_time", tooltip_hour, tooltip_minute)

                // translating tooltip time into increment
                if (tooltip_minute <15 && tooltip_minute >=0){tooltip_increment = 0;}
                if (tooltip_minute <30 && tooltip_minute >=15 ){tooltip_increment = 15;}
                if (tooltip_minute <45 && tooltip_minute >=30 ){tooltip_increment = 30;}
                if (tooltip_minute <59 && tooltip_minute >=45 ){tooltip_increment = 45;}
                if (tooltip_minute >=59){tooltip_increment = 0;}

                timeStamp_tooltip = tooltip_hour*3600 + tooltip_increment*60;
                console.log(timeStamp_tooltip);

                let tooltip_obj = []

                for (let i=0; i<15; i++){
                    tooltip_obj.push(vis.data[i].find(o => o.sec === timeStamp_tooltip));
                }

                console.log("tooltip_obj: ", tooltip_obj);

                // calculating the minimum and maximum energy total
                let min_index = d3.minIndex(tooltip_obj, function(d) { return d[button_chart_value]; });
                let max_index = d3.maxIndex(tooltip_obj, function(d) { return d[button_chart_value]; });
                // console.log(min_index, max_index)


                // appending the tooltips
                vis.svg.selectAll('.tooltip_line')
                    .style("opacity", 1)
                    .style("stroke", 'rgba(255,255,255,1)')
                    .style("stroke-width", 1)
                    .attr("x1", mouse[0]-vis.margin.left)
                    .attr("x2", mouse[0]-vis.margin.left)
                    .attr("y1", 0)
                    .attr("y2", vis.height-vis.buffer_pointer);

                vis.svg.selectAll('.tooltip_circle')
                    .style("opacity", 1)
                    .style("stroke", 'rgba(255,255,255,1)')
                    .style("stroke-width", 1)
                    .attr('cx', mouse[0]-vis.margin.left)
                    .attr('cy', vis.height-vis.buffer_pointer)
                    .attr('r', 15)

                vis.svg.selectAll('.tooltip_text')
                    .style("opacity", 1)
                    .text(tooltip_hour + ":" + tooltip_minute)
                    .attr("x", mouse[0]-vis.margin.left+vis.offset_pointer)
                    .attr("y", vis.height-vis.buffer_pointer-80)

                vis.svg.selectAll('.tooltip_text_desc_min')
                    .style("opacity", 1)
                    .text("min: "+ dataList[min_index]+", "+ f(tooltip_obj[min_index][button_chart_value]))
                    .attr("x", mouse[0]-vis.margin.left+vis.offset_pointer)
                    .attr("y", vis.height-vis.buffer_pointer-55)

                vis.svg.selectAll('.tooltip_text_desc_max')
                    .style("opacity", 1)
                    .text("max: "+ dataList[max_index]+", "+ f(tooltip_obj[max_index][button_chart_value]))
                    .attr("x", mouse[0]-vis.margin.left+vis.offset_pointer)
                    .attr("y", vis.height-vis.buffer_pointer-40)


                if (mouse[1] > vis.height_chart*2 && mouse[1] < vis.height_chart*17){

                    climateZone_tooltip = Math.floor((mouse[1]-vis.height_chart*2)/vis.height_chart);
                    // console.log("climate zone: ", dataList[climateZone_tooltip]);

                    vis.svg.selectAll('.tooltip_circle_chart')
                        .style("opacity", 1)
                        .style("stroke", 'rgba(255,255,255,1)')
                        .style("stroke-width", 1)
                        .attr('cx', mouse[0]-vis.margin.left)
                        .attr('cy', mouse[1]-vis.height_chart)
                        .attr('r', 10)

                    vis.svg.selectAll('.tooltip_chart_text')
                        .style("opacity", 1)
                        .text(dataList[climateZone_tooltip]+": "+ f(tooltip_obj[climateZone_tooltip][button_chart_value]))
                        .attr("x", mouse[0]-vis.margin.left + vis.offset_pointer)
                        .attr("y", mouse[1]-vis.height_chart)
                        .attr('alignment-baseline','middle')

                    console.log(climateZone_tooltip)
                    // return climateZone_tooltip;

                }
                else{
                    vis.svg.selectAll('.tooltip_circle_chart').style("opacity", 0);
                    vis.svg.selectAll('.tooltip_chart_text').style("opacity", 0);
                }
            }else{
                vis.svg.selectAll('.tooltip_circle').style("opacity", 0);
                vis.svg.selectAll('.tooltip_line').style("opacity", 0);
                vis.svg.selectAll('.tooltip_circle_chart').style("opacity", 0);
                vis.svg.selectAll('.tooltip_text').style("opacity", 0);
                vis.svg.selectAll('.tooltip_text_desc_max').style("opacity", 0);
                vis.svg.selectAll('.tooltip_text_desc_min').style("opacity", 0);
                vis.svg.selectAll('.tooltip_chart_text').style("opacity", 0);
            }
            })
            // .on('mouseover', function(event){
            //     // console.log("mouseover: ",event)
            //     d3.select("#"+charts[climateZone_tooltip]).select(".area")
            //         .attr('stroke-width', '2px')
            //         .attr('stroke', 'black')
            //         .style('fill', 'rgb(255,255,255,0.8)')
            // })
            // .on('mouseout', function(event) {
            //     d3.select("#"+charts[climateZone_tooltip]).select(".area")
            //         .attr('stroke-width', '2px')
            //         .attr('stroke', 'black')
            //         .style('fill', 'rgb(255,255,255,0.2)')
            // })

    }

    initVisTime(){
        let vis = this;

        // append current time line
        const formatSecond = d3.timeFormat("%S");
        const formatMin = d3.timeFormat("%M");
        const formatHr = d3.timeFormat("%H");

        const sec = parseInt(formatSecond(d3.timeSecond()));
        const min = parseInt(formatMin(d3.timeSecond()));
        const hr = parseInt(formatHr(d3.timeSecond()));

        const originalTime = hr*60*60 + min*60 + sec;
        // console.log("original time: ", originalTime);


        // display current time
        const line_current = vis.svg.append('g')
        line_current.append('line')
            .classed('line', true)
            .style("stroke",  'white')
            .style("stroke-width", 0.5)
            // .attr("x1", x(originalTime))
            // .attr("x2", x(originalTime))
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", vis.height-vis.buffer_current);

        // display current time label
        const line_current_label= vis.svg.append('g')
            .classed('label', true)
            .append('text')
            .text('Current')
            .attr("x", -5)
            .attr("y", vis.height-vis.buffer_current)
            .attr('alignment-baseline','alphabetic')
            .attr('text-anchor','end')
            .attr('fill',  'white');


        // translate the time by every second
        function everyTime() {
            // get current time
            const secInt = parseInt(formatSecond(d3.timeSecond()));
            const minInt = parseInt(formatMin(d3.timeSecond()));
            const hrInt = parseInt(formatHr(d3.timeSecond()));
            const currentTime = hrInt*60*60 + minInt*60 + secInt;

            line_current
                .transition()
                .duration(1000)
                .attr('transform', 'translate('+vis.x(currentTime)+',0)')

            line_current_label
                .transition()
                .duration(1000)
                .attr('transform', 'translate('+(vis.x(currentTime)-1)+',0)')
        }

        var myInterval = setInterval(everyTime, 1000);
    }
}