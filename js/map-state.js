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
        dataArray.push(parseFloat(energyData[d].elec_total_kwh_mean))
    }

    var minVal = d3.min(dataArray)
    console.log(minVal)
    var maxVal = d3.max(dataArray)
    var colorScale = d3.scaleLinear().domain([minVal,maxVal]).range([ 'rgba(206,212,218,1.0)',  'rgba(100,18,32,1.0)'])

    console.log("canvas", canvas)
    canvas.selectAll('path')
        .data(stateData)
        .enter()
        .append('path')
        //d3.geoPath() converts the array of lines in the topojson file into d lines to actually draw on the map
        .attr('d', d3.geoPath())
        .attr('class', 'state')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        // .style("opacity", 0.7)
        .attr("transform", "scale(0.7), translate(0,0)")

        //stateDataItem refers to the state level array object from the topojson file
        .attr('fill', (stateDataItem) => {
            //we're matching the topojson arrays to the corresponding education data based on the FIPS code
            let id = stateDataItem['id'] //id is an element in each array row that identifies the FIPS code for that state
            //now will match that fips id code with the fips id code for the education data
            //find method find the first object where the boolean expression is true
            //state refers to the state level row for the energyData file
            let state = energyData.find((state) => { //state is each data row in the energyData
                return state['fips'] === id
                //want to find the fips code that matches the id of the topojson state specific array
            })
            // now we need to pull the associated data that we want to color based upon
            let percentage = state['elec_total_kwh_mean']

            // creating color bins for each state based on associated value
            // if (percentage <= 8970.633){return '#fbe2e5'}
            // else if (percentage <= 12678.206){return '#f29ca7'}
            // else if (percentage <= 14175.771){return '#eb6979'}
            // else {return '#b2182b'} //more than 45
            return colorScale(percentage)
        })
        //stating that data-fips is now the id code from the topojson file
        .attr('data-fips', (stateDataItem)=> { return stateDataItem['id']})
        // stating that data-education is now the value of a column that has the same fips code stated in the energyData
        .attr('data-energy', (stateDataItem)=> {
            //first pull id code from topojson arrays
            let id = stateDataItem['id']
            //next pull matching code from fips column in edudata
            let state = energyData.find((state) => {
                return state['fips'] === id
            })

            //now pull data from corresponding column
            let avg_energy = state['elec_total_kwh_mean']
            //and return that corresponding value
            return format(avg_energy)
            //double check that each d object in svg section in console has these new parameters
            //should show a bunch of d values and then 'data-fips','data-education'
        })
        .attr('data-incentive', (stateDataItem)=> {
            //first pull id code from topojson arrays
            let id = stateDataItem['id']
            //next pull matching code from fips column in edudata
            let state = energyData.find((state) => {
                return state['fips'] === id
            })

            //now pull data from corresponding column
            let incentive_count = state['incentive_count']
            //and return that corresponding value
            return incentive_count
            //double check that each d object in svg section in console has these new parameters
            //should show a bunch of d values and then 'data-fips','data-education'
        })
        // ADDING TOOLTIP BASED ON  TOPOJSON FILE ARRAYS
        .on('mouseover', function(event,stateDataItem){

            d3.selectAll(".state").style("opacity", .2)

            d3.select(this)
                .attr('stroke-width', 2)
                .style("opacity", 1.0)

            //since default is hidden we're switching it to visible
            stateTooltip.transition()
                .style('visibility', 'visible')
            //same thing as before we're pulling the id from the arrays and the matching fips code from the eudcation data
            let id = stateDataItem['id']
            let state = energyData.find((state) => {
                return state['fips'] === id
            })
            stateTooltip
                .html(`<span style="font-family: 'Times New Roman'; font-size:30px">${state['state']}</span>
                        <br><span><b>Incentives: </b>${state['incentive_count']}</span>
                        <br><span><b>Avg Energy Consumed: </b>${format(state['elec_total_kwh_mean'])} kWh</span>`)
                .attr('data-energy', state['elec_total_kwh_mean'])
                .attr('data-incentive', state['incentive_count'])
                .style("left", (event.pageX-5)+ "px")
                .style("top", (event.pageY+5) + "px");
            //now we need to add the derived value for each state to the tooltip by geolocation


        })
        //now adding what happens once mouse is no longer there by hiding the tooltip
        .on('mouseout', function(event,stateDataItem) {

            d3.selectAll(".state").style("opacity", 1)
                .style("stroke", "none")

            d3.select(this)
                .attr('stroke-width', 0.5)
                .style("opacity", 1.0)

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
            stateData = topojson.feature(topoData, topoData.objects.states).features
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
                        //only run this method once all of the data is loaded
                        drawMap()
                    }

                }

            )


        }
    }
)