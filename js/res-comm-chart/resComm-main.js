
// (1) Load data with promises

// var loc = window.location.pathname;
// var dir = loc.substring(0, loc.lastIndexOf('/'));
// console.log('Directory tree is', dir)


let areachartTOTAL
let promisesAreaTOTAL = [
	d3.csv("data/res_com_total.csv"),
	// d3.csv("data/comm_all.csv")
];

Promise.all(promisesAreaTOTAL)
	.then(function (data) {
		// console.log('This is the data',data)
		createVisTOTAL(data)
	})
	.catch(function (err) {
		console.log(err)
	});

function createVisTOTAL(data) {

	var parseDate = d3.timeParse("%Y");

	console.log(data)

	data[0].forEach((row) => {

		for (let k in row) {
			if (k != "Year")
				row[k] = +row[k]
			if (k == "Year")
				row[k] = parseDate(row.Year)
		}
	});

	console.log('data loaded')

	// Create an object instance of StackedAreaChart
	areachartTOTAL = new TotalStackedAreaChart("res-comm-stacked-chart", data);

	// Create an object instance of Timeline
	//timeline = new Timeline("global-emissions-timeline", data);

	// Initialize visualization
	areachartTOTAL.initVis()
	//timeline.initVis()

}

// function brushed() {
//
// 	// Get the extent of the current brush
// 	let selectionRange = d3.brushSelection(d3.select(".brush").node());
//
// 	// Convert the extent into the corresponding domain values
// 	let selectionDomain = selectionRange.map(timeline.x.invert);
//
// 	// Apply selection domain to update area chart
// 	areachart.x.domain(selectionDomain);
//
// 	// Update focus chart
// 	// Append brush component
// 	areachart.wrangleData();
// }