function plotScatter(data){
	var count = 0;
	var margin = {top: 10, right: 10, bottom: 30, left: 10},
		width = scatterplotWidth - margin.left - margin.right,
		height = scatterplotWidth - margin.top - margin.bottom;

	var x = d3.scaleLinear()
		.range([0, width]);

	var y = d3.scaleLinear()
		.range([height, 0]);


	var color = d3.scaleOrdinal().domain(data).range(["rgba(130,146,141,0.3)"]);

	var xAxis = d3.axisBottom(x);

	var yAxis = d3.axisLeft(y);

	var svg = d3.select("#scatterplot-container")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//write data to the form
	// let dataForm = "";

	let minX = 10000000, minY = 10000000, maxX = -10000000, maxY = -1000000;
	data.forEach(function(d) {
		d.x = +d.x;
		d.y = +d.y;

		if(d.x > maxX){
			maxX = d.x;
		}
		if(d.x < minX){
			minX = d.x;
		}
		if(d.y > maxY){
			maxY = d.y;
		}
		if(d.y < minY){
			minY = d.y;
		}

		//dataForm += "<tr><td>"+d.x+"</td><td>"+d.y+"</td><td>"+d.classify+"</td><td>"+d.taxa+"</td></tr>"
	});

	let minAxis = minX > minY ? minY : minX;
	let maxAxis = maxX > maxY ? maxX : maxY;

	// document.getElementById("renderedData").innerHTML += dataForm;

	// x.domain(d3.extent(data, function(d) { return d.x; })).nice();
	// y.domain(d3.extent(data, function(d) { return d.y; })).nice();
	x.domain([minAxis, maxAxis]);
	y.domain([minAxis, maxAxis]);

	function handleMouseOver(d, i){
		$("#label-ordered-tree-container-node-"+(i+1)).css({
			"stroke" : "#000",
			"stroke-width" : 2,
			"r" : 6
		})
		$(this).css("fill", "rgba(0, 0, 0, 0.8)");
		// d3.select("#hc-tree-container-node-"+(i+1))
		// 	.attr("stroke", "#000")
		// 	.attr("stroke-width", 2)
		// 	.attr("r", 6);
		// d3.selectAll(".ori-tree-svg"+d.taxa).style("opacity", 1);
		// d3.selectAll(".label-tree-svg"+d.taxa).style("opacity", 1);
		// d3.selectAll(".hc-tree-svg"+d.taxa).style("opacity", 1);
	}

	function handleMouseOut(d, i){
		$("#label-ordered-tree-container-node-"+(i+1)).css({
			"stroke" : "#000",
			"stroke-width" : 0,
			"r" : 2.5
		})
		$(this).css("fill", "rgba(0, 0, 0, 0.1)");
		// d3.select(this)
		// 	.style("fill", "rgba(0, 0, 0, 0.1)");
		// d3.select("#ori-tree-container-node-"+(i+1))
		// 	.attr("stroke-width", 0)
		// 	.attr("r", 3);
		// d3.select("#label-ordered-tree-container-node-"+(i+1))
		// 	.attr("stroke-width", 0)
		// 	.attr("r", 3);
		// d3.select("#hc-tree-container-node-"+(i+1))
		// 	.attr("stroke-width", 0)
		// 	.attr("r", 3);
		// d3.selectAll(".ori-tree-svg"+d.taxa).style("opacity", 0);
		// d3.selectAll(".label-tree-svg"+d.taxa).style("opacity", 0);
		// d3.selectAll(".hc-tree-svg"+d.taxa).style("opacity", 0);
	}

	svg.selectAll(".dot")
		.data(data)
		.enter().append("circle")
		.attr("class", "dot")
		.attr("r", 8)
		.attr("cx", function(d) { return x(d.x); })
		.attr("cy", function(d) { return y(d.y); })
		//.attr("opacity", 0.4)
		.attr("stroke", function(d){
			return mapColor(d.classify);
		})
		.attr("stroke-width", 3)
		.attr("id", function(d){
			return "scatter"+d.taxa;
		})
		.style("fill", "rgba(0,0,0,0.1)")
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut);
		// .call(drag);
	if(data.length < showTxt){
		svg.selectAll(".txt")
			.data(data)
			.enter().append("text")
			.attr("class", "txt")
			.attr("fill", "#666")
			.attr("x", function(d) { return x(d.x)+10; })
			.attr("y", function(d) { return y(d.y)+4; })
			.attr("id", function(d){
				return "text"+d.taxa;
			})
			.attr("style", "font-size:10px;")
			.text(function(d){
				return d.taxa;
			});
	}


	// let legend = svg.selectAll(".legend")
	// 	.data(color.domain())
	// 	.enter().append("g")
	// 	.attr("class", "legend")
	// 	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
	//
	// legend.append("rect")
	// 	.attr("x", width - 18)
	// 	.attr("width", 18)
	// 	.attr("height", 18)
	// 	.style("fill", color);
	//
	// legend.append("text")
	// 	.attr("x", width - 24)
	// 	.attr("y", 9)
	// 	.attr("dy", ".35em")
	// 	.style("text-anchor", "end")
	// 	.text(function(d) { return d; });
}

// function addNode(){
// 	//check validity
// 	let addNodeCls = $("#addNodeCls").val();
// 	let addNodeTxt = $("#addNodeTxt").val();
// 	let r = /^-?\d+$/;
// 	if(!r.test(addNodeCls)){
// 		alert("Classify: please input an integer to represent the class info.");
// 		$("#addNodeCls").val("");
// 		addingNode = false;
// 		return;
// 	}
// 	let hasInputTxt = false;
// 	for(let i = 0, len = currentDataSet.length; i < len; i++){
// 		if(currentDataSet[i].taxa == addNodeTxt){
// 			hasInputTxt = true;
// 			break;
// 		}
// 	}
// 	if(hasInputTxt){
// 		alert("Taxa: we already have a node with this taxa.");
// 		$("#addNodeTxt").val("");
// 		addingNode = false;
// 		return;	
// 	}

// 	//create new data item
// 	let tmpObj = {};
// 	tmpObj.x = addNodeX;
// 	tmpObj.y = addNodeY;
// 	tmpObj.classify = addNodeCls;
// 	tmpObj.taxa = addNodeTxt;
// 	currentDataSet.push(tmpObj);

// 	addingNode = true;
// 	//clean the container
// 	$("#scatterplot-container").text("");
// 	plotScatter(currentDataSet);
// 	plotTree();
// 	addingNode = false;
// }

// function deleteNode(){
// 	deletingNode = true;
// 	let delTaxa = $("#delNodeTxt").val();
// 	let hasInputTxt = false;
// 	for(let i = 0, len = currentDataSet.length; i < len; i++){
// 		if(currentDataSet[i].taxa == delTaxa){
// 			delIdx = i;
// 			hasInputTxt = true;
// 		}
// 	}
// 	if(!hasInputTxt){
// 		alert("Taxa: we do not have a node with this taxa.");
// 		$("#delNodeTxt").val("");
// 		deletingNode = false;
// 		return;	
// 	}
// 	currentDataSet.splice(delIdx, 1);
// 	$("#scatterplot-container").text("");
// 	$("#renderedData").html(dataFormPlaceHolder);
// 	plotScatter(currentDataSet);
// 	plotTree();
// 	deletingNode = false;
// }