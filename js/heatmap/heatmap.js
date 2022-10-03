function drawHeatmap(D, taxa, leafOrder, containerSVG, containerCANVAS){
	//reset svg
	$("#"+containerSVG).empty();

	//prepare data
	let plotData = new Array();
	for(let i = 0, len = D.length; i < len; i++){
		for(let j = 0; j < len; j++){
			let obj = {};
			obj.row = i;
			obj.col = j;
			obj.dis = D[i][j];
			plotData.push(obj);
		}
	}

	var margin = { top: 70, right: 10, bottom: 10, left: 70 },
	canvasWidth = canvasHeight = $("#"+containerSVG).width(),
	col_number = row_number = D.length,
	cellSize = (canvasWidth - margin.left - margin.right)/col_number;
	//heatmapColors = ["#6baed6", "#9ecae1", "#c6dbef","#deebf7","#f7fbff","#fff5eb","#fee6ce","#fdd0a2","#fdae6b","#fd8d3c"];
	// heatmapColors = ["#113463", "#2c66a7", "#5499c3","#9bc9de","#e4edf3",
	// 				"#f7f1ed","#f2b197","#d76a5b","#aa002d","#640120"];
	//heatmapColorsCold = ["#fff7ec", "#fee8c8", "#fdd49e","#fdbb84","#fc8d59",
	//				"#ef6548","#d7301f","#b30000","#7f0000"];
	// heatmapColors = ["#f7fbff", "#deebf7", "#c6dbef","#9ecae1","#6baed6",
	// 				"#4292c6","#2171b5","#08519c","#08306b"];
	heatmapColors = ["#ffffcc", "#ffeda0", "#fed976","#feb24c","#fd8d3c",
					"#fc4e2a","#e31a1c","#bd0026","#800026"];

	//find max and min of the plot data
	let maxDis = d3.max(plotData, function(d){return d.dis});
	let minDis = d3.min(plotData, function(d){return d.dis});

	let colorScale = d3.scaleQuantile()
						.domain([minDis, maxDis])
						.range(heatmapColors);
	// let colorScaleCold = d3.scaleQuantile()
	// 					.domain([minDis, maxDis])
	// 					.range(heatmapColorsCold);

	let svg = d3.select("#"+containerSVG)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	let rowlabels = svg.append("g")
				.selectAll(".rowLabelg")
				.data(taxa)
				.enter()
				.append("text")
				.text(function(d){return d})
				.attr("x", 0)
				.attr("y", function(d, i){return leafOrder.indexOf(i+1)*cellSize})
				.style("text-anchor", "end")
				.style("fill", "#000")
				.style("font-size", 15)
				.style("font-weight", "bold")
				.style("opacity", 0)
				.attr("transform", "translate(-6," + 7 + ")")
				.attr("class", function (d,i) { 
					return "rowLabel mono r"+i + " " + containerSVG + d;
				});

	let colLabels = svg.append("g")
				.selectAll(".colLabelg")
				.data(taxa)
				.enter()
				.append("text")
				.text(function (d){return d})
				.attr("x", 0)
				.attr("y", function (d, i) { return leafOrder.indexOf(i+1) * cellSize; })
				.style("text-anchor", "left")
				.style("fill", "#000")
				.style("font-size", 15)
				.style("font-weight", "bold")
				.style("opacity", 0)
				.attr("transform", "translate("+cellSize+ ",-6) rotate (-90)")
				.attr("class",  function (d,i) { 
					return "colLabel mono c"+i + " " + containerSVG + d;
				});

	let canvas = document.getElementById(containerCANVAS);
	canvas.width = 2*(canvasWidth - margin.left - margin.right);
	canvas.height = 2*(canvasHeight - margin.top - margin.bottom);
	canvas.style.float = "left";
	canvas.style.width = canvasWidth - margin.left - margin.right + "px";
	canvas.style.height =  canvasHeight - margin.top - margin.bottom + "px";
	canvas.style.marginTop = -canvasHeight+margin.top+"px";
	canvas.style.marginLeft = margin.left+"px";

	let canvasCellSize = cellSize*2;

	let canvasBuffer = document.createElement("canvas");
	canvasBuffer.width = canvas.width;
	canvasBuffer.height = canvas.height;

	let ctx = canvas.getContext("2d");
	let ctxBuffer = canvasBuffer.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctxBuffer.clearRect(0, 0, canvasBuffer.width, canvasBuffer.height);

	for(let i = 0, len = plotData.length; i < len; i++){
		ctxBuffer.fillStyle = colorScale(plotData[i].dis);	
		ctxBuffer.fillRect(leafOrder.indexOf(plotData[i].col+1)*canvasCellSize, 
							leafOrder.indexOf(plotData[i].row+1)*canvasCellSize, 
							canvasCellSize, 
							canvasCellSize);
	}
	ctx.drawImage(canvasBuffer, 0, 0);
	canvas.onmousemove = function(e){
		let x = e.pageX - canvas.offsetLeft;
        let y = e.pageY - canvas.offsetTop + document.getElementById("container").scrollTop;
        // ctx.fillStyle = "#000";
        // ctx.fillRect(x*2, y*2, 10, 10);
        let selectRow = Math.floor(y*2/canvasCellSize);
        
        d3.selectAll(".mono").style("opacity", 0);
        d3.selectAll(".label-tree-heatmap-svg"+taxa[leafOrder[selectRow]-1]).style("opacity", 1);
        d3.selectAll(".ori-tree-svg"+taxa[leafOrder[selectRow]-1]).style("opacity", 1);
		d3.selectAll(".label-tree-svg"+taxa[leafOrder[selectRow]-1]).style("opacity", 1);
		d3.selectAll(".hc-tree-svg"+taxa[leafOrder[selectRow]-1]).style("opacity", 1);
		d3.selectAll(".ori-tree-heatmap-svg"+taxa[leafOrder[selectRow]-1]).style("opacity", 1);
		d3.selectAll(".hc-tree-heatmap-svg"+taxa[leafOrder[selectRow]-1]).style("opacity", 1);

		$(".dot").css("fill", "rgba(0,0,0,0.1)");
		//d3.selectAll(".leaf").attr("stroke-width", 0).attr("r", 3);
		$(".leaf").css({
			"stroke-width" : 0,
			"r" : 2.5
		})

		$("#ori-tree-container-node-"+leafOrder[selectRow]).css({
			"stroke" : "#000",
			"stroke-width" : 2,
			"r" : 6
		})
		$("#label-ordered-tree-container-node-"+leafOrder[selectRow]).css({
			"stroke" : "#000",
			"stroke-width" : 2,
			"r" : 6
		})
		$("#hc-tree-container-node-"+leafOrder[selectRow]).css({
			"stroke" : "#000",
			"stroke-width" : 2,
			"r" : 6
		})
		$("#scatter"+taxa[leafOrder[selectRow]-1])
			.css("fill", "rgba(0, 0, 0, 0.8)");
		$("#pca"+taxa[leafOrder[selectRow]-1])
			.css("fill", "rgba(0, 0, 0, 0.8)");


		//highlight parrel coords
		paintParaCoords(currentDataSet, [leafOrder[selectRow]]);
	}
	canvas.onmouseout = function(){
		d3.selectAll(".mono").style("opacity", 0);
		$(".leaf").css({
			"stroke-width" : 0,
			"r" : 2.5
		})
		$(".dot").css("fill", "rgba(0,0,0,0.1)");
		//cancel highlight parrel coords
		paintParaCoords(currentDataSet, [-1]);
	}

}

function updateHeatmap(selectedLeaves, D, leafOrder, containerSVG, containerCANVAS){
	//prepare data
	let plotData = new Array();
	for(let i = 0, len = D.length; i < len; i++){
		for(let j = 0; j < len; j++){
			let obj = {};
			obj.row = i;
			obj.col = j;
			obj.dis = D[i][j];
			plotData.push(obj);
		}
	}

	var margin = { top: 70, right: 10, bottom: 10, left: 70 },
	canvasWidth = canvasHeight = $("#"+containerSVG).width(),
	col_number = row_number = D.length,
	cellSize = (canvasWidth - margin.left - margin.right)/col_number;
	heatmapColorsCold = ["#fff7ec", "#fee8c8", "#fdd49e","#fdbb84","#fc8d59",
					"#ef6548","#d7301f","#b30000","#7f0000"];
	heatmapColors = ["#f7fbff", "#deebf7", "#c6dbef","#9ecae1","#6baed6",
					"#4292c6","#2171b5","#08519c","#08306b"];

	//find max and min of the plot data
	let maxDis = d3.max(plotData, function(d){return d.dis});
	let minDis = d3.min(plotData, function(d){return d.dis});

	let colorScale = d3.scaleQuantile()
						.domain([minDis, maxDis])
						.range(heatmapColors);
	let colorScaleCold = d3.scaleQuantile()
						.domain([minDis, maxDis])
						.range(heatmapColorsCold);

	let canvas = document.getElementById(containerCANVAS);

	let canvasCellSize = cellSize*2;

	let canvasBuffer = document.createElement("canvas");
	canvasBuffer.width = canvas.width;
	canvasBuffer.height = canvas.height;

	let ctx = canvas.getContext("2d");
	let ctxBuffer = canvasBuffer.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctxBuffer.clearRect(0, 0, canvasBuffer.width, canvasBuffer.height);

	for(let i = 0, len = plotData.length; i < len; i++){
		let cIndex = leafOrder.indexOf(plotData[i].col+1);
		let rIndex = leafOrder.indexOf(plotData[i].row+1);

		// if((cIndex >= tmpMin && cIndex <= tmpMax) || (rIndex >= tmpMin && rIndex <= tmpMax)){
		if(selectedLeaves.indexOf(plotData[i].col+1) >= 0 || selectedLeaves.indexOf(plotData[i].row+1) >= 0){
			ctxBuffer.fillStyle = colorScaleCold(plotData[i].dis);
		}else{
			ctxBuffer.fillStyle = colorScale(plotData[i].dis);	
		}
		ctxBuffer.fillRect(cIndex*canvasCellSize, 
							rIndex*canvasCellSize, 
							canvasCellSize, 
							canvasCellSize);
	}
	ctx.drawImage(canvasBuffer, 0, 0);
}