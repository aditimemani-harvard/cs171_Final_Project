/* * * * * * * * * * * * * *
*      Introduction        *
* * * * * * * * * * * * * */


let introData_C02;
loadIntroData();

var country_list = [];

// loading the dataset 1
d3.csv("data/other/country_list.csv", function(data) {
    country_list.push(data);
})
console.log("country_list: ", country_list)

var country_temp = [];

d3.csv("data/other/country_temp.csv", function(data) {
    country_temp.push(data);
})
console.log("country_temp: ", country_temp)



// loading the dataset 2
function loadIntroData() {
    d3.csv('data/other/country_level_co2_yearly_data.csv', row => {

        row['co2'] = +row['co2'];
        row['cumulative_co2'] = +row['cumulative_co2'];
        row['year'] = +row['year']

        return row
    }).then(csv => {

        // Store csv data in global variable
        introData_C02 = csv;
        introCurves(introData_C02);
        // console.log("introData_C02: ", introData_C02);
    });
}


function introCurves(data){

    // setting up the margin
    const margin = {top: 0, right: 10, bottom: 10, left: 10};
    const width = document.getElementById('introduction').getBoundingClientRect().width - margin.left - margin.right;
    const height = document.getElementById('introduction').getBoundingClientRect().height - margin.top - margin.bottom;

    // SVG drawing area
    const svg = d3.select('#introduction').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // append clip path
    svg.append("defs").append("clipPath").attr("id", "clip")
        .append("rect").attr("width", width).attr("height", height);


    // gettint length of the data
    const len = data.length;
    // console.log("introData_C02: ", data[0]);
    // console.log("introData_C02 len: ", len )


    // title
    svg.append('text')
        .classed('intro_title', true)
        .text("energy")
        .attr("x", width-100)
        .attr("y", 100)


    // VISUALIZATION
    // temperature
    // console.log("country temp: ", country_temp)
    // console.log("test: ", country_temp[0], country_temp.length, country_temp[0].length)

    // adding padding for visualization
    const padding_v = 0;
    const padding_h = 400;
    const buffer_current = 180;
    const buffer_pointer = 50;
    const offset_pointer = 25;
    const legend_padding = 160;

    // append temperature line
    const temp_line = svg.append('g').classed('intro_temp_line', true);

    // scales for x and y axis
    var xScale_temp = d3.scaleLinear().domain([1961,2021]).range([0,width-padding_v]);
    var yScale_temp = d3.scaleLinear().domain([-1.5,2.5]).range([0,height-padding_h]);

    var line_temp = d3.line()
        .x((d) => xScale_temp(d.y))
        .y((d) => yScale_temp(d.x))
        .curve(d3.curveStep)

    // create a new dataset for visualization (top chart)
    for (var j=0; j<country_temp.length; j++){
        var arr_temp = [];
        for (var k=1; k<62; k++){

            var n = 'F'
            var n2 = 1960+k
            var name = n+n2

            arr_temp.push({
                key: country_temp[j]['Country'],
                x: country_temp[j][name],
                y: 1960+k
            })
        }

        // filter out the null values
        var line_notdashed = d3.line().defined(function (d) { return d.x !== ''; });
        var filteredData_notdashed = arr_temp.filter(line_notdashed.defined());

        // TOP CHART
        // console.log("testtest: ",filteredData_notdashed)
        temp_line.append("path")
            .attr("d", line_temp(filteredData_notdashed))
            .attr("fill", "none")
            .attr("alpha", "0")
            .attr("stroke", "rgb(255,255,255,0.2)")
            .attr('stroke-width', '0.25px')

    }

    // create a list for the legend (x-axis)
    var legend_year = ['1965','1970','1975' ,'1980', '1985', '1990', '1995' ,'2000', '2005', '2010', '2015', '2020']

    svg.selectAll('.intro_text-legend-year')
        .data(legend_year).enter()
        .append("g").append("text")
        .classed('intro_text-legend-year', true)
        .attr("y", height-legend_padding-18)
        .attr("x", function(d,i) {
            return xScale_temp(d);
        })
        .text(function(d) { return d; })
        .attr('fill', 'rgb(255,255,255)')
        .attr('text-anchor', 'middle');

    // adding the legend line (x-axis)
    svg.selectAll('.intro_text-legend-line')
        .data(legend_year).enter()
        .append("g").append("line")
        .classed('intro_text-legend-line', true)
        .attr("y1", height-legend_padding-32)
        .attr("y2", height-legend_padding-42)
        .attr("x1", function(d) {return xScale_temp(d)})
        .attr("x2", function(d) {return xScale_temp(d)})
        .style("stroke-width", 1.25)
        .style("stroke", 'rgb(255,255,255)');

    // create a list for the legend (y-axis)
    var legend_temp = ['-1', '-0.5', '0', '0.5', '1','1.5','2','2.5','3']
    svg.selectAll('.intro_text-legend-temp')
        .data(legend_temp)
        .enter()
        .append("g")
        .append("text")
        .classed('intro_text-legend-temp', true)
        .attr("y", function(d,i) {
            return yScale_temp(d);
        })
        .attr("x", width-32)
        .text(function(d) { return d; })
        .attr('fill', 'rgba(255,255,255,1.0)')
        .attr('alignment-baseline', 'central')
        .attr('text-achor', 'end');

    // adding the legend line (7-axis)
    svg.selectAll('.intro_text-legend-line-v')
        .data(legend_temp).enter()
        .append("g")
        .append("line")
        .classed('intro_text-legend-line-v', true)
        .attr("y1", function(d) {return yScale_temp(d)})
        .attr("y2", function(d) {return yScale_temp(d)})
        .attr("x1", width)
        .attr("x2", width-10)
        .style("stroke-width", 1.25)
        .style("stroke", 'rgb(255,255,255)');


    // appending the empty tooltips
    svg.append('g').append('line').classed('intro_tooltip_line', true);
    svg.append('g').append('circle').classed('intro_tooltip_circle', true);
    svg.append('g').append('circle').classed('intro_tooltip_circle_chart', true);
    svg.append('g').append('text').classed('intro_tooltip_circle_chart_text', true);
    svg.append('g').append('text').classed('intro_tooltip_circle_text', true);
    svg.append('g').append('text').classed('intro_legend_country_text', true);

    // create tooltips when mouse is moving
    d3.select("#introduction")
        .on("mousemove", function(event) {
            let mouse = d3.pointer(event);
            // console.log(mouse)

            // setting up the range for the mouse
            if (mouse[0] < width && mouse[0] > 0 &&
                mouse[1] < height-padding_h && mouse[1] > 0){

                let mouse_year = parseInt(xScale_temp.invert(mouse[0]));
                let mouse_temp = yScale_temp.invert(mouse[1]);
                var n = 'F'
                var n2 = mouse_year
                var mouse_year_update = n+n2

                // console.log("mouse_time: ", mouse_year_update, mouse_temp)

                // VISUALIZATION (BOTTOM CHART)
                // create a new dataset for visualization (bottom chart)
                const arr_display = [];
                for (var j=0; j<country_temp.length; j++) {

                    arr_display.push({
                        key: country_temp[j]['Country'],
                        temp: country_temp[j][mouse_year_update],
                    })
                }
                // console.log("arr_display: ", arr_display)

                // const arr_display_sorted = arr_display;
                // arr_display_sorted.sort((a, b) => d3.descending(a.temp, b.temp))
                // console.log("arr_display_sorted", arr_display_sorted);


                // calculate the selected country when the mouse is moving
                let bar_country = width/arr_display.length
                let mouse_country = Math.floor(mouse[0] /bar_country)
                console.log("mouse_country: ", mouse_country)


                // adding individual ines for each country
                var legend_dash = svg.select("g").selectAll(".intro_text-legend-dash").data(arr_display);

                legend_dash.exit().remove();
                legend_dash.enter().append("line")
                    .style("opacity", 1)
                    .classed('intro_text-legend-dash', true)
                    .merge(legend_dash)
                    .attr("y1", height-150)
                    .attr("y2", height-70)
                    .attr("x1", function(d,i) {
                        return i*(width/arr_display.length)+(width/arr_display.length);
                    })
                    .attr("x2",function(d,i) {
                        return i*(width/arr_display.length)+(width/arr_display.length);
                    })
                    .attr('stroke-width', '1')
                    .style('stroke', function(d,i) {
                        if( d.temp<=0 ){ return 'rgba(255,255,255,0.2)' }
                        if( d.temp>0 && d.temp<=1.0 ){ return 'rgba(255,255,255,0.4)' }
                        if( d.temp>1.0 && d.temp<=2.0 ){return 'rgba(219,52,52,0.6)' }
                        if( d.temp>2.0 && d.temp<=3.0 ){ return 'rgba(219,52,52,1.0)' }
                        if( d.temp>3.0){ return 'rgba(219,52,52,1.0)' }
                    })
                    .attr('alignment-baseline', 'central');


                // adding temperature information for each country
                var legend = svg.select("g").selectAll(".intro_text-legend-display").data(arr_display);

                legend.exit().remove();//remove unneeded circles
                legend.enter().append("text")
                    .style("opacity", 1)
                    .classed('intro_text-legend-display', true)
                    .merge(legend)
                    .attr("y", height-60)
                    .attr("x", function(d,i) {
                        return i*(width/arr_display.length)+(width/arr_display.length);
                    })
                    .text(function(d) { return d.temp; })
                    .attr('fill', function(d,i) {
                        if( d.temp<=0 ){ return 'rgba(255,255,255,0.2)' }
                        if( d.temp>0 && d.temp<=1.0 ){ return 'rgba(255,255,255,0.2)' }
                        if( d.temp>1.0 && d.temp<=2.0 ){return 'rgba(219,52,52,0.3)' }
                        if( d.temp>2.0 && d.temp<=3.0 ){ return 'rgba(219,52,52,0.4)' }
                        if( d.temp>3.0){ return 'rgba(219,52,52,0.5)' }
                    })
                    .attr('alignment-baseline', 'central')
                    .attr('writing-mode','vertical-rl')
                    .attr('glyph-orientation-vertical','0');


                // adding individual texts to label each country
                var legend_country = svg.select("g").selectAll(".intro_text-legend-country").data(arr_display);

                legend_country.exit().remove();//remove unneeded circles
                legend_country.enter().append("text")
                    .style("opacity", 1)
                    .classed('intro_text-legend-country', true)
                    .merge(legend_country)
                    .attr("y", height-45)
                    .attr("x", function(d,i) {
                        return i*(width/arr_display.length)+(width/arr_display.length);
                    })
                    .text(function(d) { return d.key; })
                    // .attr('fill', 'rgba(255,255,255,0.3)')
                    .attr('fill', function(d,i) {
                        if( d.temp<=0 ){ return 'rgba(255,255,255,0.2)' }
                        if( d.temp>0 && d.temp<=1.0 ){ return 'rgba(255,255,255,0.4)' }
                        if( d.temp>1.0 && d.temp<=2.0 ){return 'rgba(219,52,52,0.6)' }
                        if( d.temp>2.0 && d.temp<=3.0 ){ return 'rgba(219,52,52,1.0)' }
                        if( d.temp>3.0){ return 'rgba(219,52,52,1.0)' }
                    })
                    .attr('alignment-baseline', 'central')
                    .attr('writing-mode','vertical-rl')
                    .attr('glyph-orientation-vertical','0');


                // Adding tooltip line
                var legend_line = svg.select("g").selectAll(".intro_text-legend-line").data(arr_display);

                legend_line.exit().remove();//remove unneeded circles
                legend_line.enter().append("line")
                    .style("opacity", 1)
                    .classed('intro_text-legend-line', true)
                    .merge(legend_line)
                    .attr("y1", height-430)
                    .attr("y2", height-150)
                    .attr("x2", function(d,i) {
                        return i*(width/arr_display.length)+(width/arr_display.length);
                    })
                    .attr("x1", mouse[0])
                    .style("stroke-width", 0.15)
                    .style('stroke', function(d,i) {
                        if( d.temp<=0 ){ return 'rgba(255,255,255,0.2)' }
                        if( d.temp>0 && d.temp<=1.0 ){ return 'rgba(255,255,255,0.4)' }
                        if( d.temp>1.0 && d.temp<=2.0 ){return 'rgba(219,52,52,0.6)' }
                        if( d.temp>2.0 && d.temp<=3.0 ){ return 'rgba(219,52,52,1.0)' }
                        if( d.temp>3.0){ return 'rgba(219,52,52,1.0)' }
                    });


                // appending the tooltips
                svg.selectAll('.intro_tooltip_line')
                    .style("opacity", 1)
                    .style("stroke", 'rgba(255,255,255,1)')
                    .style("stroke-width", 0.75)
                    .attr("y1", 0)
                    .attr("y2", height)
                    .attr("x1", mouse[0])
                    .attr("x2", mouse[0])
                    .style("stroke-dasharray", ("2,4"));

                // appending circle on tooltips
                svg.selectAll('.intro_tooltip_circle_chart')
                    .style("opacity", 1)
                    .style("stroke", 'rgba(255,255,255,1)')
                    .style("stroke-width", 0.75)
                    .attr('cx', mouse[0])
                    .attr('cy', mouse[1])
                    .attr('r', 10)
                    .style("stroke-dasharray", ("2,4"));

                // appending text about temperature on tooltip circle
                svg.selectAll('.intro_tooltip_circle_chart_text')
                    .style("opacity", 1)
                    .text(f(mouse_temp)+"°c")
                    .attr("x", mouse[0]+offset_pointer)
                    .attr("y", mouse[1])
                    .attr("alignment-baseline", "central");

                // adding another tooltip circle
                svg.selectAll('.intro_tooltip_circle')
                    .style("opacity", 1)
                    .style("stroke", 'rgba(255,255,255,1)')
                    .style("stroke-width", 0.75)
                    .attr('cx', mouse[0])
                    .attr('cy', height-450)
                    .attr('r', 15)
                    .style("stroke-dasharray", ("2,4"));

                // appending text about year on tooltip circle
                svg.selectAll('.intro_tooltip_circle_text')
                    .style("opacity", 1)
                    .text(mouse_year)
                    .attr("x", mouse[0]+offset_pointer)
                    .attr("y", height-450)
                    .attr("alignment-baseline", "central");


                // appending tooltip text about country and temperature when hover
                svg.selectAll('.intro_legend_country_text')
                    .style("opacity", 1)
                    .text(arr_display[mouse_country].key + " :  " + arr_display[mouse_country].temp + "°c" )
                    .attr("x", mouse[0]+2)
                    .attr("y", height-320)
                    .attr("alignment-baseline", "ideographic")
                    .attr('writing-mode','vertical-rl')
                    .attr('glyph-orientation-vertical','180');


                d3.select(".intro_temp_line").select("line")




            }
            else{
                // removing the opacity when the mouse is not in range
                svg.selectAll('.intro_tooltip_circle').style("opacity", 0);
                svg.selectAll('.intro_tooltip_line').style("opacity", 0);
                // svg.selectAll('.intro_text-legend-country').style("opacity", 0);
                // svg.selectAll('.intro_text-legend-display').style("opacity", 0);
                svg.selectAll('.intro_tooltip_circle_chart').style("opacity", 0);
                svg.selectAll('.intro_tooltip_circle_text').style("opacity", 0);
                svg.selectAll('.intro_text-legend-year').style("opacity", 0);
            }})

}