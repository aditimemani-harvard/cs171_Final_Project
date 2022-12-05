

d3.csv("data/comm_all.csv").then( function(data) {
    var margin = {top: 60, right: 230, bottom: 50, left: 50},
        width = 660 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    let imageScalePath = ['img/stacked_chart/commercial/DeliveredEnergy.jpeg',
        'img/stacked_chart/commercial/DistillateFuelOil.jpg',
        'img/stacked_chart/commercial/EnergyRelatedLosses.jpeg',
        'img/stacked_chart/commercial/NaturalGas.jpg',
        'img/stacked_chart/commercial/Petroleum.jpg',
        'img/stacked_chart/commercial/PurchasedElectricity.jpg']


    let imageScaleSrc = ['  Delivered Energy',' Distillate Fuel Oil', ' Electricity Related Losses',
        '   Natural Gas', ' Petroleum and Other Liquids Subtotal', '    Purchased Electricity']
    var imageScale = d3.scaleOrdinal().domain(imageScaleSrc).range(imageScalePath)



    let commTooltip = d3.select('#comm-tooltip')

    var svg = d3.select("#comm-stacked-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // List of groups = header of the csv files
    var keys = data.columns.slice(1)

    // color palette
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
    var color = d3.scaleOrdinal()
        .domain(keys)
        .range(customPalette);


    var stackedData = d3.stack()
        .keys(keys)
        (data)




    // Add X axis
    var x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) {
            return d.Year;
        }))
        .range([0, width]);
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5))
        .style('color', 'rgba(255, 255, 255, 0.75)').style('font-size', 8)
        .call(g => g.select(".domain").remove())

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 40)
        .text("Time (year)")
        .style('font-family', 'Roboto')
        .style('font-size', '10px')
        .style('fill', 'white');

    // Add Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -40)
        .text("kWh")
        .attr("text-anchor", "start")
        .style('font-family', 'Roboto')
        .style('font-size', '10px')
        .style('fill', 'white');

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 35])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5))
        .style('color', 'rgba(255, 255, 255, 0.75)').style('font-size', 8)
        .call(g => g.select(".domain").remove())



    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

    var areaChart = svg.append('g')
        .attr("clip-path", "url(#clip)")

    // Area generator
    var area = d3.area()
        .x(function (d) {
            return x(d.data.Year);
        })
        .y0(function (d) {
            return y(d[0]);
        })
        .y1(function (d) {
            return y(d[1]);
        })
    var highlight = function (event, d, i) {
        console.log(d)
        // reduce opacity of all groups
        d3.selectAll(".myArea").style("opacity", .2)
        // expect the one that is hovered
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)
        commTooltip
            .style("opacity", 1)
            .html(`    
                      <span style="font-family: 'Times New Roman';
                       font-size:15px">&ensp;Category: ${d.key}</span>
      
                       <br>
                       <div class='center'>
                       <img src=${imageScale(d.key)} width="100%" height="auto">
                       </div>
                  `)
            .style("left", (event.pageX - 10) + "px")
            .style("top", (event.pageY + 20) + "px")

    }

    // And when it is not hovered anymore
    var noHighlight = function (event, d, i) {
        d3.selectAll(".myArea").style("opacity", 1)
        commTooltip.style("opacity", 0)

    }
    // Show the areas
    areaChart
        .selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("stroke-width", 0)
        .attr("class", function (d) {
            return "myArea " + d.key
        })
        .style("fill", function (d) {
            return color(d.key);
        })
        .attr("d", area)
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
})

