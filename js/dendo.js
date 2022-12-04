dendoSixURL = "data/zone6.json"
dendoFiveURL = "data/zone5.json"
dendoFourURL = "data/zone4.json"

var margin = {top: 15, right: 15, bottom: 15, left: 25}
width = window.innerWidth;
height = window.innerHeight;
var svg = d3.select("#dendo").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("
        + margin.left + "," + margin.top + ")");


var i = 0,
    duration = 750,
    root;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height/2, width/2]);
function updateButton (dataURL) {
    d3.json(dataURL).then(function (treeData) {

        // Assigns parent, children, height, depth
        root = d3.hierarchy(treeData, function (d) {
            return d.children;
        });
        root.x0 = height / 2;
        root.y0 = 0;

        // Collapse after the second level
        root.children.forEach(collapse);

        update(root);

        // Collapse the node and all it's children
        function collapse(d) {
            if (d.children) {
                d._children = d.children
                d._children.forEach(collapse)
                d.children = null
            }
        }

        function update(source) {

            // Assigns the x and y position for the nodes
            var treeData = treemap(root);

            // Compute the new tree layout.
            var nodes = treeData.descendants(),
                links = treeData.descendants().slice(1);

            // Normalize for fixed-depth.
            nodes.forEach(function (d) {
                d.y = d.depth * 180
            });

            // ****************** Nodes section ***************************

            // Update the nodes...
            var node = svg.selectAll('g.node')
                .data(nodes, function (d) {
                    return d.id || (d.id = ++i);
                });

            // Enter any new modes at the parent's previous position.
            var nodeEnter = node.enter().append('g')
                .attr('class', 'node')
                .attr("transform", function (d) {
                    return "translate(" + source.y0 + "," + source.x0 / 2 + ")";
                })
                .on('click', click);

            // Add Circle for the nodes
            nodeEnter.append('circle')
                .attr('class', 'node')
                .attr('r', 1e-10)
                // .attr('r', 50)
                .style("fill", function (d) {
                    return d._children ? "#d6604d" : "#b2182b";
                });

            // Add labels for the nodes
            nodeEnter.append('text')
                .attr("dy", ".2em")
                .attr("x", function (d) {
                    if (d.data.name.length > 2){ return 12; }
                    else { return -1; }
                })
                .attr("text-anchor", function (d) {
                    return d.children || d._children ? "end" : "start";
                })
                .attr('fill', 'white')
                .text(function (d) {
                    if (d.height > 0) return d.data.name;
                    return d.data.name + ": " + d.data.value +" kWh";
                })
                .attr("text-anchor", function (d) {
                    if (d.data.name.length > 2){ return 'start'; }
                    else { return 'middle'; }
                })

            // UPDATE
            var nodeUpdate = nodeEnter.merge(node);

            // Transition to the proper position for the node
            nodeUpdate.transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            // Update the node attributes and style
            nodeUpdate.select('circle.node')
                .attr('r', function(d){
                    // console.log("radius", d)
                    console.log("length: ", d.data.name, d.data.name.length);
                    // if (d.data.name.length = 1){ return 50; }
                    // if (d.data.name.length = 2){ return 20; }
                    if (d.data.name.length > 2){ return 5; }
                    else { return 20; }
                })
                // .style("stroke-dasharray", ("4,2"))
                .style('stroke',function (d) {
                    return d._children ? "#808080" : "#85182A";
                })
                .style("fill", "rgba(0,0,0,1.0)")
                // .style("fill", function (d) {
                //     return d._children ? "#808080" : "#85182A";
                // })
                .attr('cursor', 'pointer')
                .style('stroke-width', 2)
                .style('fill-opacity', 1.0);


            // Remove any exiting nodes
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

            // On exit reduce the node circles size to 0
            nodeExit.select('circle')
                .attr('r', 1e-6);

            // On exit reduce the opacity of text labels
            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            // ****************** links section ***************************

            // Update the links...
            var link = svg.selectAll('path.link')
                .data(links, function (d) {
                    return d.id;
                });

            // Enter any new links at the parent's previous position.
            var linkEnter = link.enter().insert('path', "g")
                .attr("class", "link")
                // .style("stroke-dasharray", ("2,2"))
                .style("stroke-width", function(d){
                    if (d.data.name.length > 2){ return 1; }
                    else { return 2; }
                })
                .attr('d', function (d) {
                    var o = {x: source.x0, y: source.y0}
                    return diagonal(o, o)
                });

            // UPDATE
            var linkUpdate = linkEnter.merge(link);

            // Transition back to the parent element position
            linkUpdate.transition()
                .duration(duration)
                .attr('d', function (d) {
                    return diagonal(d, d.parent)
                });

            // Remove any exiting links
            var linkExit = link.exit().transition()
                .duration(duration)
                .attr('d', function (d) {
                    var o = {x: source.x, y: source.y}
                    return diagonal(o, o)
                })
                .remove();

            // Store the old positions for transition.
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });

            // Creates a curved (diagonal) path from parent to the child nodes
            function diagonal(s, d) {

                path = `M ${s.y} ${s.x}
                    C ${(s.y + d.y) / 2} ${s.x},
                      ${(s.y + d.y) / 2} ${d.x},
                      ${d.y} ${d.x},
                      ${d.y+10} ${d.x+50}`

                return path
            }

            // Toggle children on click.
            function click(event, d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            }
        }
    })
}
updateButton(dendoFourURL)

// const btnDendo4 = document.getElementById('btnDendo4');
//
// btnDendo4.addEventListener('click', function onClick() {
//     btnDendo4.style.backgroundColor = '#85182A';
//     btnDendo4.style.color = 'white';
// });
//
// const btnDendo5 = document.getElementById('btnDendo5');
//
// btnDendo5.addEventListener('click', function onClick() {
//     btnDendo5.style.backgroundColor = '#85182A';
//     btnDendo5.style.color = 'white';
// });
//
// const btnDendo6 = document.getElementById('btnDendo6');
//
// btnDendo6.addEventListener('click', function onClick() {
//     btnDendo6.style.backgroundColor = '#85182A';
//     btnDendo6.style.color = 'white';
// });