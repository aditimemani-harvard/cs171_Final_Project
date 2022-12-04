let colorTree = ['#6C757D',
	'#333333',
	'#555555',
	'#777777',
	'#A71E34',
	'#444444',
	'#555555',
	'#6C757D',
	'#333333',
	'#555555',
	'#A71E34',
	'#777777',
	'#6C757D',
	'#333333',
	'#555555',
	'#777777',
	'#555555',
	'#777777',
	'#777777',
	'#6C757D',
	'#333333',
	'#555555',
	'#777777',
	'#A71E34',
	'#555555',
	'#777777',
	'#6C757D',
];
let treeMapSrc =['Heating Bkup',
	'Ceiling Fan',
	'Clothes Dryer',
	'Clothes Dryer/Washer',
	'Cooling',
	'Cooling Fans Pumps',
	'Dishwasher',
	'Fireplace',
	'Freezer',
	'Grill',
	'Heating',
	'Heating Fans Pumps',
	'Hot Tub Heater',
	'Hot Tub Heater/Pump',
	'Hot Water',
	'Lighting',
	'Mech Vent',
	'Plug Loads',
	'Pool Heater',
	'Pool Heater/Pump',
	'Range Oven',
	'Refrigerator',
	'Well Pump',
	'Electricity',
	'Fuel Oil',
	'Natural Gas',
	'Propane']


var width = height = 100, // % of the parent element
	
	x = d3.scaleLinear().domain([0, width]).range([0, width]),
    y = d3.scaleLinear().domain([0, height]).range([0, height]),

	color = d3.scaleOrdinal()
		.domain(treeMapSrc)
		.range(colorTree),
	
	Ttreemap = d3.treemap()
    	.size([width, height])
		//.tile(d3.treemapResquarify) // doesn't work - height & width is 100%
    	.paddingInner(0)
    	.round(false), //true

	data = {
		"children": [
			{
				"name": "Electricity",
				"children": [
					{
						"name": "Ceiling Fan",
						"value": 0.0042
					},
					{
						"name": "Clothes Dryer/Washer",
						"value": 0.0323
					},
					{
						"name": "Cooling",
						"value": 0.2257
					},
					{
						"name": "Cooling Fans Pumps",
						"value": 0.0443
					},
					{
						"name": "Dishwasher",
						"value": 0.0035
					},
					{
						"name": "Freezer",
						"value": 0.0082
					},
					{
						"name": "Heating",
						"value": 0.1936
					},
					{
						"name": "Heating Fans Pumps",
						"value": 0.0191
					},
					{
						"name": "Heating Bkup",
						"value": 0.0086
					},
					{
						"name": "Hot Tub Heater/Pump",
						"value": 0.0081
					},
					{
						"name": "Hot Water",
						"value": 0.0801
					},
					{
						"name": "Lighting",
						"value": 0.0906
					},
					{
						"name": "Mech Vent",
						"value": 0.0017
					},
					{
						"name": "Plug Loads",
						"value": 0.1952
					},
					{
						"name": "Pool Heater/Pump",
						"value": 0.0146
					},
					{
						"name": "Range Oven",
						"value": 0.0211
					},
					{
						"name": "Refrigerator",
						"value": 0.0523
					},
					{
						"name": "Well Pump",
						"value": 0.0036
					}
				]
			},
			{
				"name": "Fuel Oil",
				"children": [
					{
						"name": "Heating",
						"value": 0.9239
					},
					{
						"name": "Hot Water",
						"value": 0.0761
					}
				]
			},
			{
				"name": "Natural Gas",
				"children": [
					{
						"name": "Clothes Dryer",
						"value": 0.0096
					},
					{
						"name": "Fireplace",
						"value": 0.0041
					},
					{
						"name": "Grill",
						"value": 0.0018
					},
					{
						"name": "Heating",
						"value": 0.777
					},
					{
						"name": "Hot Tub Heater",
						"value": 0.0027
					},
					{
						"name": "Hot Water",
						"value": 0.1777
					},
					{
						"name": "Lighting",
						"value": 0.0005
					},
					{
						"name": "Pool Heater",
						"value": 0.0053
					},
					{
						"name": "Range Oven",
						"value": 0.0214
					}
				]
			},
			{
				"name": "Propane",
				"children": [
					{
						"name": "Clothes Dryer",
						"value": 0.0057
					},
					{
						"name": "Heating",
						"value": 0.8439
					},
					{
						"name": "Hot Water",
						"value": 0.1214
					},
					{
						"name": "Range Oven",
						"value": 0.029
					}
				]
			}
		],
		"name": "All Features"
	},
	
	Tnodes = d3.hierarchy(data)
		.sum(function(d) { return d.value ? 1 : 0; }),
		//.sort(function(a, b) { return b.height - a.height || b.value - a.value });
	
	currentDepth;

Ttreemap(Tnodes);
let formatDecimal_tree = d3.format(",.2f");
var chart = d3.select("#treemap-chart");
var cells = chart
	.selectAll(".node-treemap")
	.data(Tnodes.descendants())
	.enter()
	.append("div")
	// .attr('stroke', 'black')
	// .attr('stroke-width', '2px')
	.attr("class", function(d) { return "node-treemap level-" + d.depth; })
	.attr("title", function(d) { return d.data.name ? d.data.name : "null"; });
var pmax = d3.max(Tnodes, function(d) {
	if(d.depth<1) return +d.size;
})

cells
	.style("left", function(d) { return x(d.x0) + "%"; })
	.style("top", function(d) { return y(d.y0) + "%"; })
	.style("width", function(d) { return x(d.x1) - x(d.x0) + "%"; })
	.style("height", function(d) { return y(d.y1) - y(d.y0) + "%"; })
	//.style("background-image", function(d) { return d.value ? imgUrl + d.value : ""; })
	//.style("background-image", function(d) { return d.value ? "url(http://placekitten.com/g/300/300)" : "none"; }) 
	.style("background-color", function(d) { while (d.depth > 2) d = d.parent; return color(d.data.name); })
	// .style('stroke', function(d) { while (d.depth < 2)  return 'black'; })
	// .style('stroke-width', function(d) { while (d.depth < 2)  return '2px'; })
	.on("click", zoom)
	.append("p")
	.attr("class", "label")
	.text(function (d) {
		if (d.height > 0) return d.data.name;
		return d.data.name + ": " + formatDecimal_tree(d.data.value*100) + "%";
	});
	//.style("font-size", "")
	//.style("opacity", function(d) { return isOverflowed( d.parent ) ? 1 : 0; });

var parent = d3.select(".up")
	.datum(Tnodes)
	.on("click", zoom);

function zoom(event, d) {
	
	console.log('clicked: ' + d.data.name + ', depth: ' + d.depth);
	
	currentDepth = d.depth;
	parent.datum(d.parent || Tnodes);
	
	x.domain([d.x0, d.x1]);
	y.domain([d.y0, d.y1]);
	
	var t = d3.transition()
    	.duration(800)
    	.ease(d3.easeCubicOut);
	
	cells
		.transition(t)
		.style("left", function(d) { return x(d.x0) + "%"; })
		.style("top", function(d) { return y(d.y0) + "%"; })
		.style("width", function(d) { return x(d.x1) - x(d.x0) + "%"; })
		.style("height", function(d) { return y(d.y1) - y(d.y0) + "%"; });
	
	cells // hide this depth and above
		.filter(function(d) { return d.ancestors(); })
		.classed("hide", function(d) { return d.children ? true : false });
	
	cells // show this depth + 1 and below
		.filter(function(d) { return d.depth > currentDepth; })
		.classed("hide", false);
	
}