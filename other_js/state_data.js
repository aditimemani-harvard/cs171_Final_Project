let stateURL ='data/us_county.json'
let energyURL = 'data/incentive_energy_data.csv'
console.log(d3)
console.log(topojson)
let countyData
// let energyData
let colors = ['#F8F9FA', '#CED4DA', '#6C757D', '#641220', '#85182A', '#A71E34', '#BD1F36', '#DA1E37'];


let canvasstate = d3.select('#state-map').append('svg') // needs to match name in css file
let stateTooltip = d3.select('#state-tooltip')

let drawstateMap = () => {
    var dataArray = [];
    for (var d = 0; d < energyData.length; d++) {
        dataArray.push(parseFloat(energyData[d].elec_total_kwh_mean))
    }

    var minVal = d3.min(dataArray)
    console.log(minVal)
    var maxVal = d3.max(dataArray)
    var colorScale = d3.scaleLinear().domain([minVal,maxVal]).range([ '#CED4DA',  '#641220'])
    var projection = d3.geoAlbersUsa()
    canvasstate.selectAll('path')
        .data(stateData.features)
        .enter()
        .append('path')
        //d3.geoPath() converts the array of lines in the topojson file into d lines to actually draw on the map
        .attr('d', d3.geoPath().projection(projection))
        .attr('class', 'state')
        //stateDataItem refers to the state level array object from the topojson file
        .attr('fill', (stateDataItem) => {
            //we're matching the topojson arrays to the corresponding energy data based on the FIPS code
            //id is an element in each array row that identifies the FIPS code for that state
            //now will match that fips id code with the fips id code for the energy data
            //find method find the first object where the boolean expression is true
            //state refers to the state level row for the energyData file
            //state is each data row in the energyData


            //want to find the fips code that matches the id of the topojson state specific array

            // now we need to pull the associated data that we want to color based upon
            let percentage = stateDataItem.properties.zone
            // creating color bins for each state based on associated value
            return colorScale(percentage)//more than 45
        })
        // stating that data-fips is now the id code from the topojson file
        //     .attr('data-fips', (stateDataItem)=> { return stateDataItem['id']})
        //     // stating that data-energy is now the value of a column that has the same fips code stated in the energyData
        //     .attr('data-energy', (stateDataItem)=> {
        //         //first pull id code from topojson arrays
        //         let id = stateDataItem['id']
        //         //next pull matching code from fips column in edudata
        //         let state = energyData.find((state) => {
        //             return +state['fips'] === id
        //             })
        //         //now pull data from corresponding column
        //         let percentage = +state['energy']
        //         //and return that corresponding value
        //         return percentage
        //         //double check that each d object in svg section in console has these new parameters
        //         //should show a bunch of d values and then 'data-fips','data-energy'
        //         })
        // ADDING TOOLTIP BASED ON  TOPOJSON FILE ARRAYS
        .on('mouseover', function(event,stateDataItem){
            //since default is hidden we're switching it to visible
            stateTooltip.transition()
                .style('visibility', 'visible')
            //same thing as before we're pulling the id from the arrays and the matching fips code from the eudcation data
            let id = stateDataItem['id']
            let state = energyData.find((state) => {
                return +state['fips'] === id
            })
            stateTooltip
                .html(`
                  <span >${stateDataItem.properties.code}, ${stateDataItem.properties.stateCode}</span>
                        <br>
                     <span>Zone: ${stateDataItem.properties.zone}</span>`)
                .attr('data-energy', stateDataItem.properties.zone)
                .style("left", (event.pageX-15)+ "px")
                .style("top", (event.pageY+5) + "px");

        })
        //now adding what happens once mouse is no longer there by hiding the stateTooltip
        .on('mouseout', function(event,stateDataItem){
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
            stateData = stateData = topojson.feature(topoData, topoData.objects.states)//only want the feature portion of the array that have the geolines
            // need 2 arguments to do this
            // first argument: the name of the topojson argument when called in the promise i.e.topoData
            // second argument: the type of datat needed from the topojson data
            console.log('state Data')
            console.log(stateData)

            // now that the stateURL promise has been resolved we need to nest the energy data within
            d3.csv(energyURL).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }
                    else{
                        energyData = data
                        console.log('energy Data')
                        console.log(energyData)
                        //only run this method once all of the data is loaded
                        for (var i = 0; i <  energyData.length; i++) {

                            // Grab State Name
                            var dataState =  energyData[i].fips;


                            // Grab data value
                            var dataValue =  +energyData[i].elec_total_kwh_mean;
                            var dataIncentive =  energyData[i].incentive_count;
                            var dataStateCode =  energyData[i].code;

                            // Find the corresponding state inside the GeoJSON
                            for (var j = 0; j < stateData.features.length; j++) {
                                var jsonstate = stateData.features[j].properties.STATE;

                                if (dataState == jsonstate) {

                                    // Copy the data value into the JSON
                                    stateData.features[j].properties.value = dataValue;
                                    stateData.features[j].properties.incentive_count = dataIncentive;
                                    stateData.features[j].properties.code = dataStateCode;

                                    // Stop looking through the JSON
                                    break;
                                }
                            }
                        }
                        console.log('state Data')
                        console.log(stateData)
                        drawstateMap()
                    }

                }

            )


        }
    }
)