// set the dimensions and margins of the graph



// append the svg object to the body of the page

let dataURLOne = "data/window_energy_normalized.csv";
let max_valOne = 1*5;
let domOne = 'stacked-barOne';
let dataURLTwo = "data/lighting_energy.csv";
let max_valTwo = 7*2;
let domTwo = 'stacked-barTwo';
let dataURLThree = "data/appliance_energy.csv";
let max_valThree = 4.5*2;
let domThree = 'stacked-barThree'

// Parse the Data
function UpdateChart(dom, dataURL, max_val) {
    var margin = {top: 10, right: 30, bottom: 20, left: 50},
        width = document.getElementById(dom).getBoundingClientRect().width - margin.left - margin.right,
        height = document.getElementById(dom).getBoundingClientRect().height - margin.top - margin.bottom;
    var svgBar = d3.select("#"+dom)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",`translate(${margin.left},${margin.top})`);
    d3.csv(dataURL).then(function (data) {

        // List of subgroups = header of the csv files = soil condition here
        var subgroups = data.columns.slice(1)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = data.map(d => d.group)

        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svgBar.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .style('color', 'white').style('font-size', 10).style('font-family', 'Helvetica');
        ;

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, max_val])
            .range([height, 0]);
        svgBar.append("g")
            .call(d3.axisLeft(y))
            .style('color', 'white').style('font-size', 10).style('font-family', 'Helvetica');
        ;

        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(['#F8F9FA',
                '#CED4DA',
                '#6C757D',
                '#641220',
                '#85182A',
                '#A71E34',
                '#BD1F36',
                '#DA1E37'])

        //stack the data? --> stack per subgroup
        var stackedData = d3.stack()
            .keys(subgroups)
            (data)


        // ----------------
        // Create a tooltipBar
        // ----------------
        var tooltipBar = d3.select("#"+dom)
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltipBar")
            // .style("position", "absolute")
            // .style("background-color", "white")
            // .style("border", "solid")
            // .style("border-width", "1px")
            // .style("border-radius", "5px")
            // .style("padding", "10px")
            // .style("left", "100px")
            .attr("x", 0)
            .attr("y", -100)

        // Three function that change the tooltipBar when user hover / move / leave a cell
        var mouseover = function (event, d) {
            var subgroupName = d3.select(this.parentNode).datum().key;
            var subgroupValue = d.data[subgroupName];
            tooltipBar
                // .text('  Category '+subgroupName + "Value: "+ subgroupValue)

                .html('<br>'+subgroupName +'<br>' +" Value: " + subgroupValue)
                .style("opacity", 1)
                .style('font-size', 4).style('fill', 'white')

        }
        var mousemove = function (event, d) {
            tooltipBar
                .style("transform","translateY(55)")
                .style("transform","translateX(-455)")
                // .style("left", (event.pageX - 5) + "px")
                // .style("top", (event.pageY - 5) + "px");
        }
        var mouseleave = function (event, d) {
            tooltipBar
                .style("opacity", 0)
        }

        // Show the bars
        svgBar.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .join("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(d => d)
            .join("rect")
            .attr("x", d => x(d.data.group))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .attr("stroke", "grey")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

    })

}
UpdateChart(domOne, dataURLOne, max_valOne)
UpdateChart(domTwo, dataURLTwo, max_valTwo)
UpdateChart(domThree, dataURLThree, max_valThree)