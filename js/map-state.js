let stateURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let energyURL = 'data/incentive_energy_data.csv'
console.log(d3)
console.log(topojson)

let energyData
let stateData

let canvas = d3.select('#state-map').append('svg')
// .attr("width", 200)
// .attr("height", 200)

// needs to match name in css file
let stateTooltip = d3.select('#state-tooltip')

let colorState = ['rgba(248,249,250,0.8)', 'rgba(206,212,218,0.8)', 'rgba(108,117,125,0.8)',
    'rgba(100,18,32,0.8)', 'rgba(133,24,42,0.8)', 'rgba(167,30,52,0.8)', 'rgba(189,31,54,0.8)', 'rgba(218,30,55,0.8)'];
let formatDecimal = d3.format(",.2f");
let formatInteger = d3.format(",");

function format(number){
    return !(number % 1) ? formatInteger(number) : formatDecimal(number)
}
let drawMap = () => {
    var dataArray = [];
    for (var d = 0; d < energyData.length; d++) {
        dataArray.push(parseFloat(energyData[d].avg_energy))
    }

    var minVal = d3.min(dataArray)
    console.log(minVal)
    var maxVal = d3.max(dataArray)
    var colorScale = d3.scaleLinear().domain([minVal,maxVal]).range([ '#CED4DA',  '#641220'])

    console.log("stateData-features", stateData.features)
    canvas.selectAll('path')
        .data(stateData.features)
        .enter()
        .append('path')
        //d3.geoPath() converts the array of lines in the topojson file into d lines to actually draw on the map
        .attr('d', d3.geoPath())
        .attr('class', 'state')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        // .style("opacity", 0.5)
        .attr("transform", "scale(0.7), translate(0,0)")

        //stateDataItem refers to the state level array object from the topojson file
        .attr('fill', (stateDataItem) => {
            //we're matching the topojson arrays to the corresponding education data based on the FIPS code
            // now we need to pull the associated data that we want to color based upon
            let percentage = stateDataItem.properties.value
            return colorScale(percentage)
        })
        //stating that data-fips is now the id code from the topojson file
        // stating that data-education is now the value of a column that has the same fips code stated in the energyData

        // ADDING TOOLTIP BASED ON  TOPOJSON FILE ARRAYS
        .on('mouseover', function(event,stateDataItem){
            d3.selectAll(".state").style("opacity", .2)

            d3.select(this)
                .style("stroke", "black")
                .style("opacity", 1)

            //since default is hidden we're switching it to visible
            stateTooltip.transition()
                .style('visibility', 'visible')
            stateTooltip
                .html(`<span style="font-family: 'Times New Roman'; font-size:30px">${stateDataItem.properties.name}</span>
                        <br><span><b>Incentives: </b>${stateDataItem.properties.incentive}</span>
                        <br><span><b>Avg Energy Consumed: </b>${format(stateDataItem.properties.value)} kWh</span>`)
                .attr('data-energy', stateDataItem.properties.value)
                .attr('data-incentive', stateDataItem.properties.incentive)
                .style("left", (event.pageX-5)+ "px")
                .style("top", (event.pageY+5) + "px");
            //now we need to add the derived value for each state to the tooltip by geolocation

        })
        //now adding what happens once mouse is no longer there by hiding the tooltip
        .on('mouseout', function(event,stateDataItem) {

            d3.selectAll(".state").style("opacity", 1)
                .style("stroke", "none")

            d3.select(this)
                // style("opacity", 0.5)
                .style("stroke", "none")
                .style("opacity", "1.0");

            stateTooltip.transition()
                .style('visibility', 'hidden')
        })
}

// promises to load the data as a javascript object
d3.json(stateURL).then(
    (topoData,error) => {
        if(error){
            console.log(error)
        }
        else{
            console.log(topoData)
            // stateData = topoData
            // need to convert topojson features into geojson so d3 can understand it
            //state data is id-ed by the FIPS code
            // need 2 arguments to do this
            // first argument: the name of the topojson argument when called in the promise i.e.topoData
            // second argument: the type of datat needed from the topojson data
            stateData = topojson.feature(topoData, topoData.objects.states)
            // console.log('state Data')
            // console.log(stateData)
            console.log('State Data')
            console.log(stateData)
            // now that the stateURL promise has been resolved we need to nest the education data within
            d3.csv(energyURL).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }
                    else{
                        energyData = data
                        console.log('Energy Data')
                        console.log(energyData)
                        for (var i = 0; i <  energyData.length; i++) {

                            var dataState =  energyData[i].FIPS;
                            var dataName =  energyData[i].state;
                            var dataCode =  energyData[i].code;
                            var dataValue =  +energyData[i].avg_energy;
                            var dataIncentive = +energyData[i].incentive_count;
                            for (var j = 0; j < stateData.features.length; j++) {
                                var jsonState = stateData.features[j].id

                                if (dataState == jsonState) {

                                    // Copy the data value into the JSON
                                    stateData.features[j].properties.fips = dataState;
                                    stateData.features[j].properties.name = dataName;
                                    stateData.features[j].properties.value = dataValue;
                                    stateData.features[j].properties.incentive = dataIncentive;
                                    stateData.features[j].properties.stateCode = dataCode;

                                    // Stop looking through the JSON
                                    break;
                                }
                            }
                        }
                        console.log('State Data After Adding Vals')
                        console.log(stateData)

                        //only run this method once all of the data is loaded
                        drawMap()
                    }

                }

            )


        }
    }
)