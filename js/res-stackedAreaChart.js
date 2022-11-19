
/*
 * ResStackedAreaChart - ES6 Class
 * @param  parentElement 	-- the HTML element in which to draw the visualization
 * @param  data             -- the data the that's provided initially
 * @param  displayData      -- the data that will be used finally (which might vary based on the selection)
 *
 * @param  focus            -- a switch that indicates the current mode (focus or stacked overview)
 * @param  selectedIndex    -- a global 'variable' inside the class that keeps track of the index of the selected area
 */
let formatDate = d3.timeFormat("%Y");
let resTooltip = d3.select("#res-stacked-tooltip")
class ResStackedAreaChart {

// constructor method to initialize ResStackedAreaChart object
constructor(parentElement, data) {
    this.parentElement = parentElement;
    this.data = data;
    this.displayData = [];


	// let colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00'];
	//let colors = ['#641220','#85182A','#A71E34','#BD1F36','#DA1E37','#6C757D','#CED4DA','#F8F9FA'];
	let colors = ['#F8F9FA', '#CED4DA', '#6C757D', '#641220', '#85182A', '#A71E34', '#BD1F36', '#DA1E37'];

    // grab all the keys from the key value pairs in data (filter out 'year' ) to get a list of categories
    this.dataCategories = Object.keys(this.data[0]).filter(d=>d !== "Year")
	console.log('dataCategories', this.dataCategories);

    // prepare colors for range
    let colorArray = this.dataCategories.map( (d,i) => {
        return colors[i]
    })

    // Set ordinal color scale
    this.colorScale = d3.scaleOrdinal()
        .domain(this.dataCategories)
        .range(colorArray);
}

	/*
	 * Method that initializes the visualization (static content, e.g. SVG area or axes)
 	*/

	initVis(){
		let vis = this;

		vis.margin = {top: 40, right: 40, bottom: 60, left: 40};

		vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		// Overlay with path clipping
		vis.svg.append("defs").append("clipPath")
			.attr("id", "clip")

			.append("rect")
			.attr("width", vis.width)
			.attr("height", vis.height);

		// Scales and axes
		vis.x = d3.scaleTime()
			.range([0, vis.width])
			// //Update the x domain every time the brushed event gets triggered
			.domain(d3.extent(vis.data, function(d) { return d.Year; }));

		console.log('vis.x', vis.x);

		vis.y = d3.scaleLinear()
			.range([vis.height, 0]);

		vis.xAxis = d3.axisBottom()
			.scale(vis.x);

		vis.yAxis = d3.axisLeft()
			.scale(vis.y);

		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")");

		vis.svg.append("g")
			.attr("class", "y-axis axis");


		// Initialize stack layout
		vis.stack = d3.stack().keys(vis.dataCategories);

		//Stack data
		vis.stackedData = vis.stack(vis.data);

		console.log('check', vis.data[0]);

		// Stacked area layout
		vis.area = d3.area()
			.curve(d3.curveCardinal)
			.x(d => vis.x(d.data.Year))
			.y0(d => vis.y(d[0]))
			.y1(d => vis.y(d[1]));

		vis.svg.append('path')
			.datum(this.data);


		// tooltip
		// vis.tooltip = d3.select("body").append('div')
		// 	.attr('class', "tooltip")
		// 	.attr('id', 'areaTooltip')


		// TO-DO: (Filter, aggregate, modify data)
		vis.wrangleData();

	}

	/*
 	* Data wrangling
 	*/
	wrangleData(){
		let vis = this;
        
        vis.displayData = vis.stackedData;


		// Update the visualization
		vis.updateVis();
	}

	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
 	* Function parameters only needed if different kinds of updates are needed
 	*/
	updateVis(){
		let vis = this;

		// Update domain
        // Get the maximum of the multi-dimensional array or in other words, get the highest peak of the uppermost layer
        vis.y.domain([0, d3.max(vis.displayData, function(d) {
            return d3.max(d, function(e) {
                return e[1];
            });
        })
        ]);


		// Draw the layers
		let categories = vis.svg.selectAll(".area")
			.data(vis.displayData);

		categories.enter().append("path")
			.attr("class", "area")
			.merge(categories)
			.style("fill", d => {
				return vis.colorScale(d)
			})
			.style("stroke", "black")
			.style("stroke-width", "3px")
			.attr("d", d => vis.area(d))


			.on('mouseover', function(d){
				//Tooltip update
			// 	vis.tooltip
			// 		.style("opacity", 1)
			// 		.style("left", event.pageX + 20 + "px")
			// 		.style("top", event.pageY + "px")
			// 		.html(`
         // <div style="border-radius: 5px; background: darkgray; padding: 6px">
         //    <h4 class ='tooltip-text'> Energy Source: ${d.key}  <h4>
         // </div>`);
			// })
				resTooltip
					.transition()
					.style('visibility', 'visible')
				resTooltip
					.style("opacity", 1)
					.html(`<div style="border-radius: 5px; background: darkgray; padding: 6px">
            				<h4 class ='tooltip-text'> Energy Source: ${d.key}  <h4>                  
         					</div>`)
					.attr('data-res_total', d.key)
					.style("left", d3.event.pageX + "px")
					.style("top", d3.event.pageY -20 + "px");

			})
			.on('mouseout', function(event, d){
				resTooltip
					.style("opacity", 0)
					.style("left", 0)
					.style("top", 0)
					.html(``);
			});

		categories.exit().remove();

		// Call axis functions with the new domain
		vis.svg.select(".x-axis").call(vis.xAxis);
		vis.svg.select(".y-axis").call(vis.yAxis);
	}
}