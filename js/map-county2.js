let countyURL ='data/us_county.json'
let climateURL = 'data/climate_fips_sub_type.csv'
console.log(d3)
console.log(topojson)
let countyData
// let climateData
let colorCounty = ['#F8F9FA', '#CED4DA', '#6C757D', '#641220', '#85182A', '#A71E34', '#BD1F36', '#DA1E37'];

let imageScalePath = ['img/climate_type/cold.png','img/climate_type/dry.png', 'img/climate_type/hot.png', 'img/climate_type/humid.png', 'img/climate_type/marine.png',  'img/climate_type/subartic.png', 'img/climate_type/very_cold.png', 'img/climate_type/hot.png', 'img/climate_type/mixed.png', 'img/climate_type/mixed.png']
let imageScaleSrc = ['Cold','Dry', 'Hot', 'Humid', 'Marine', 'Subartic','Very Cold', 'Hot/Humid', 'Humid/Mixed', 'Mixed']
var imageScale = d3.scaleOrdinal().domain(imageScaleSrc).range(imageScalePath)

let canvasCounty = d3.select('#county-map').append('svg') // needs to match name in css file
let countyTooltip = d3.select('#county-tooltip')
let countyIcon = d3.select('#county-icon')


let drawCountyMap = () => {
    var dataArray = [];
    for (var d = 0; d < climateData.length; d++) {
        dataArray.push(parseFloat(climateData[d].climate))
    }

    var minVal = d3.min(dataArray)
    console.log(minVal)
    var maxVal = d3.max(dataArray)
    var colorScale = d3.scaleLinear().domain([minVal,maxVal]).range([ '#CED4DA',  '#641220'])
    var projection = d3.geoAlbersUsa()
    console.log(countyData.features)
    canvasCounty.selectAll('path')
        .data(countyData.features)
        .enter()
        .append('path')
        //d3.geoPath() converts the array of lines in the topojson file into d lines to actually draw on the map
        .attr('d', d3.geoPath().projection(projection))
        .attr('class', 'county')
        .attr('stroke-width', 0)
        // .style("opacity", 0.7)
        .attr("transform", "scale(0.7), translate(0,0)")
        //countyDataItem refers to the county level array object from the topojson file
        .attr('fill', (countyDataItem) => {
            //we're matching the topojson arrays to the corresponding climate data based on the FIPS code

            let percentage = countyDataItem.properties.zone
            // creating color bins for each county based on associated value
            return colorScale(percentage)//more than 45
        })

        // ADDING TOOLTIP BASED ON  TOPOJSON FILE ARRAYS
        .on('mouseover', function(event,countyDataItem){
            //since default is hidden we're switching it to visible

            d3.selectAll(".county").style("opacity", .2)

            d3.select(this)
                .style("stroke", "white")
                .style("opacity", 1)

            countyTooltip.transition()
                .style('visibility', 'visible')
            //same thing as before we're pulling the id from the arrays and the matching fips code from the eudcation data
            let id = countyDataItem['id']
            let county = climateData.find((county) => {
                return +county['fips'] === id
            })


            countyTooltip
                .html(`<img src=${countyDataItem.properties.picSrc} width="13%" height="auto">
                       <br><span style="font-family: 'Times New Roman'; 
                       font-size:20px">${countyDataItem.properties.code+ ", "+countyDataItem.properties.stateCode}</span>
                       <br><span><b>Zone: </b>${countyDataItem.properties.zone}</span>
                       <br><span><b>Sub-Zone: </b>${countyDataItem.properties.subZone}</span>
                       <br><span><b>Climate: </b>${countyDataItem.properties.zoneType}</span>
                      
                        
                  `)
                .style("left", (event.pageX-10)+ "px")
                .style("top", (event.pageY+20) + "px");



//             countyTooltip
//                 .attr("x", document.getElementById('county-map').getBoundingClientRect().width-100)
//                 .attr("y", 0)
//                 .html(`<div class="col">
// <div class="center">
//                   <span >${countyDataItem.properties.code}, ${countyDataItem.properties.stateCode}</span>
//                   </div>
//                         <div class="center">
//                      <span>Zone: ${countyDataItem.properties.zone}</span>
//                      </div>
//                     <div class="center">
//                      <span>Sub-Zone: ${countyDataItem.properties.subZone}</span>
//                      </div>
//                     <div class="center">
//                      <span>Climate: ${countyDataItem.properties.zoneType}</span>
//                      </div>
//                  <br>
//                  <div class="center">
//                  <img src=${countyDataItem.properties.picSrc} width="10%" height="auto"></div></div>`)
//                 .attr('data-climate', countyDataItem.properties.zone)
//                 .attr('data-subZone', countyDataItem.properties.subZone)
//                 .attr('data-climateType', countyDataItem.properties.zoneType)
//                 .attr('data-climatePic', countyDataItem.properties.picSrc)
//             // .style("left", (event.pageX-15)+ "px")
//             // .style("top", (event.pageY+5) + "px");
//             d3.select(this)
//                 .style("stroke", "white")
//                 .style("opacity", 1)
//             countyIcon.transition()
//                 .style('visibility', 'visible')

        })
        //now adding what happens once mouse is no longer there by hiding the countyTooltip
        .on('mouseout', function(event,countyDataItem){

            d3.selectAll(".county").style("opacity", 1)
                .style("stroke", "none")

            countyTooltip.transition()
                .style('visibility', 'hidden')
            d3.select(this)
                // style("opacity", 0.5)
                .style("stroke", "none")
                .style("opacity", "1.0");
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

            // need to convert topojson features into geojson so d3 can understand it

            countyData = topoData//only want the feature portion of the array that have the geolines
            console.log('County Data')
            console.log(countyData)

            // now that the countyURL promise has been resolved we need to nest the climate data within
            d3.csv('data/climate_fips_sub_type.csv').then(
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
                            var dataSubZone =  climateData[i].sub_zone;
                            var dataType =  climateData[i].climate_type;
                            var dataPicSrc = imageScale(climateData[i].climate_type);
                            var dataCode =  climateData[i].AreaName;
                            var dataStateCode =  climateData[i].code;

                            // Find the corresponding state inside the GeoJSON
                            for (var j = 0; j < countyData.features.length; j++) {
                                var jsonCounty = countyData.features[j].properties.STATE+countyData.features[j].properties.COUNTY;

                                if (comboUS == jsonCounty) {

                                    // Copy the data value into the JSON
                                    countyData.features[j].properties.zone = dataValue;
                                    countyData.features[j].properties.subZone = dataSubZone;
                                    countyData.features[j].properties.zoneType = dataType;
                                    countyData.features[j].properties.code = dataCode;
                                    countyData.features[j].properties.picSrc = dataPicSrc;
                                    countyData.features[j].properties.stateCode = dataStateCode;

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