
// Variables for the visualization instances
let areachart, timeline;
// let totalchart;


// Start application by loading the data
loadData();

function loadData() {
    d3.json("data/res_comm.json"). then(jsonData=>{
            
        // prepare data
        let data = prepareData(jsonData)
        
        console.log('data loaded ')

		// areachart = new ResStackedAreaChart("stacked-area-chart", data.layers);
		// timeline = new ResTimeline("timeline", data.years);
		areachart = new ResStackedAreaChart("stacked-area-chart", data.residential);
		timeline = new ResTimeline("timeline", data.residential_total);


		areachart.initVis();
		timeline.initVis();


		// totalchart = new StackedAreaChartTotal("stacked-area-chart", data.consumption_total);
		// totalchart.initVis();

    });
}


function prepareData(data){

	let parseDate = d3.timeParse("%Y");

	data.residential.forEach(function(d){
		d.Year = parseDate(d.Year.toString());
	});

	// data.commercial.forEach(function(d){
	// 	d.Year = parseDate(d.Year.toString());
	// });
	// data.consumption_total.forEach(function(d){
	// 	d.Total = parseFloat(d.Total);
	// 	d.Year = parseDate(d.Year.toString());
	// });

	data.residential_total.forEach(function(d){
		d.resTotal = parseFloat(d.resTotal);
		d.commTotal = parseFloat(d.commTotal);
		d.Year = parseDate(d.Year.toString());
	});
	// data.commercial_total.forEach(function(d){
	// 	d.Total = parseFloat(d.Total);
	// 	d.Year = parseDate(d.Year.toString());
	// });

	return data
	console.log('data', data);
}

function brushed() {

	//Returning to the base chart
	if (d3.event.selection === null) {
		areachart.x.domain(d3.extent(areachart.data, d=> d.Year));
		// totalchart.x.domain(d3.extent(totalchart.data, d=> d.Year));
		areachart.wrangleData();
		// totalchart.wrangleData();
		return;
	}

	// React to 'brushed' event

	// Get the extent of the current brush
	let selectionRange = d3.brushSelection(d3.select(".brush").node());

	// Convert the extent into the corresponding domain values
	let selectionDomain = selectionRange.map(timeline.xScale.invert);

	// Update focus chart (detailed information)
	areachart.x.domain(selectionDomain);
	// totalchart.x.domain(selectionDomain);

	//wrangle the data afterwards
	areachart.wrangleData();
	// totalchart.wrangleData();

}
