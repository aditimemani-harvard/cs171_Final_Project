let countyURL ='data/us_county.json'
let climateURL = 'data/climate_fips.csv'
console.log(d3)
console.log(topojson)
let countyData
let climateData


let canvasCounty = d3.select('#county-map').append('svg') // needs to match name in css file
let countyTooltip = d3.select('#county-tooltip')

let drawCountyMap = () => {
    var dataArray = [];
    for (var d = 0; d < climateData.length; d++) {
        dataArray.push(parseFloat(climateData[d].climate))
    }

    var minVal = d3.min(dataArray)
    console.log(minVal)
    var maxVal = d3.max(dataArray)
    var colorScale = d3.scaleLinear().domain([minVal,maxVal]).range(["#f7ebe8","#b2182b"])
    var projection = d3.geoAlbersUsa()
    canvasCounty.selectAll('path')
        .data(countyData.features)
        .enter()
        .append('path')
        //d3.geoPath() converts the array of lines in the topojson file into d lines to actually draw on the map
        .attr('d', d3.geoPath().projection(projection))
        .attr('class', 'county')
        //countyDataItem refers to the county level array object from the topojson file
        .attr('fill', (countyDataItem) => {
            //we're matching the topojson arrays to the corresponding climate data based on the FIPS code
            //id is an element in each array row that identifies the FIPS code for that county
            //now will match that fips id code with the fips id code for the climate data
            //find method find the first object where the boolean expression is true
            //county refers to the county level row for the climateData file
            //county is each data row in the climateData


            //want to find the fips code that matches the id of the topojson county specific array

            // now we need to pull the associated data that we want to color based upon
            let percentage = countyDataItem.properties.zone
            // creating color bins for each county based on associated value
             return colorScale(percentage)//more than 45
        })
    // stating that data-fips is now the id code from the topojson file
    //     .attr('data-fips', (countyDataItem)=> { return countyDataItem['id']})
    //     // stating that data-climate is now the value of a column that has the same fips code stated in the climateData
    //     .attr('data-climate', (countyDataItem)=> {
    //         //first pull id code from topojson arrays
    //         let id = countyDataItem['id']
    //         //next pull matching code from fips column in edudata
    //         let county = climateData.find((county) => {
    //             return +county['fips'] === id
    //             })
    //         //now pull data from corresponding column
    //         let percentage = +county['climate']
    //         //and return that corresponding value
    //         return percentage
    //         //double check that each d object in svg section in console has these new parameters
    //         //should show a bunch of d values and then 'data-fips','data-climate'
    //         })
        // ADDING TOOLTIP BASED ON  TOPOJSON FILE ARRAYS
        .on('mouseover', (countyDataItem)=>{
            //since default is hidden we're switching it to visible
            countyTooltip.transition()
                .style('visibility', 'visible')
            //same thing as before we're pulling the id from the arrays and the matching fips code from the eudcation data
            let id = countyDataItem['id']
            let county = climateData.find((county) => {
                return +county['fips'] === id
            })
            //now we're setting the text for the tooltip using just the climate data that corresponds to the id code of the topojson file
            // countyTooltip.text(countyDataItem.properties.code +
            //     '\n'+' Zone: ' + countyDataItem.properties.zone)
            countyTooltip
                .html(`<span >${countyDataItem.properties.code}</span>
                        <br>
                        <span>Zone: ${countyDataItem.properties.zone}</span>`)
                .attr('data-climate', countyDataItem.properties.zone)
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY - 28 + "px");
            // countyTooltip.text(county['AreaName'] + ', ' +
            //     county['code'] + ' : ' + county['climate'])
            //now we need to add the derived value for each county to the countyTooltip by geolocation
            // countyTooltip.attr('data-climate', county['climate'])
        })
        //now adding what happens once mouse is no longer there by hiding the countyTooltip
        .on('mouseout', (countyDataItem) => {
            countyTooltip.transition()
                .style('visibility', 'hidden')
        })
}

// promises to load the data as a javascript object
d3.json(countyURL).then(
    (topoData,error) => {
        if(error){
            console.log(error)
        }
        else{
            console.log(topoData)
            // countyData = topoData
            // need to convert topojson features into geojson so d3 can understand it
            //county data is id-ed by the FIPS code
            countyData = topoData//only want the feature portion of the array that have the geolines
            // need 2 arguments to do this
            // first argument: the name of the topojson argument when called in the promise i.e.topoData
            // second argument: the type of datat needed from the topojson data
            console.log('County Data')
            console.log(countyData)

            // now that the countyURL promise has been resolved we need to nest the climate data within
            d3.csv(climateURL).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }
                    else{
                        climateData = data
                        console.log('climate Data')
                        console.log(climateData)
                        //only run this method once all of the data is loaded
                        for (var i = 0; i <  climateData.length; i++) {

                            // Grab State Name
                            var dataState =  climateData[i].FIPS_state;
                            var dataCounty = climateData[i].FIPS_county;
                            var comboUS = dataState+dataCounty

                            // Grab data value
                            var dataValue =  +climateData[i].climate;
                            var dataCode =  climateData[i].AreaName;

                            // Find the corresponding state inside the GeoJSON
                            for (var j = 0; j < countyData.features.length; j++) {
                                var jsonCounty = countyData.features[j].properties.STATE+countyData.features[j].properties.COUNTY;

                                if (comboUS == jsonCounty) {

                                    // Copy the data value into the JSON
                                    countyData.features[j].properties.zone = dataValue;
                                    countyData.features[j].properties.code = dataCode;

                                    // Stop looking through the JSON
                                    break;
                                }
                            }
                        }
                        console.log('County Data')
                        console.log(countyData)
                        drawCountyMap()
                    }

                }

            )


        }
    }
)