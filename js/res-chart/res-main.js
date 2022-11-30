
// (1) Load data with promises

// var loc = window.location.pathname;
// var dir = loc.substring(0, loc.lastIndexOf('/'));
// console.log('Directory tree is', dir)


let areachart, timeline;
let promisesArea = [
	d3.csv("data/res_all.csv"),
	// d3.csv("data/comm_all.csv")
];

Promise.all(promisesArea)
	.then(function (data) {
		// console.log('This is the data',data)
		createVis(data)
	})
	.catch(function (err) {
		console.log(err)
	});

function createVis(data) {

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
	areachart = new StackedAreaChart("res-stacked-chart", data);

	// Create an object instance of Timeline
	//timeline = new Timeline("global-emissions-timeline", data);

	// Initialize visualization
	areachart.initVis()
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