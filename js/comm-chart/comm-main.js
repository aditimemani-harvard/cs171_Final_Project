
// (1) Load data with promises

// var loc = window.location.pathname;
// var dir = loc.substring(0, loc.lastIndexOf('/'));
// console.log('Directory tree is', dir)


let areachartCOMM
let promisesAreaCOMM = [
	d3.csv("data/comm_all.csv"),
	// d3.csv("data/comm_all.csv")
];

Promise.all(promisesAreaCOMM)
	.then(function (data) {
		// console.log('This is the data',data)
		createVisCOMM(data)
	})
	.catch(function (err) {
		console.log(err)
	});

function createVisCOMM(data) {

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
	areachartCOMM = new COMMStackedAreaChart("comm-stacked-chart", data);

	// Create an object instance of Timeline
	//timeline = new Timeline("global-emissions-timeline", data);

	// Initialize visualization
	areachartCOMM.initVis()
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