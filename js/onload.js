var current_width = 1;
var menu_status = 0;
var current_ws_width = 0;

$(document).ready(function(){
	//get dashboard size and set some other sizes
	$(document.body).width($(window).width()-20);
	$(document.body).height($(window).height()-10);
	$("#header").width($(window).width()-20);

	let containerHeight = $(document.body).height()-70;
	dashboardWidth = $(document.body).width() - 4 * viewMargin;
	// let dashboardHeight = containerHeight - ;



	treeContainerWidth = 2 * dashboardWidth / 5 < 200 ? 200 : (2 * dashboardWidth / 5) - slideBarMarginLeft;
	let styleHeight = containerHeight;
	height = containerHeight - 2*viewMargin - 50 - 50;
	barWidth = treeContainerWidth-10;
	distillTreeContainerWidth = (treeContainerWidth+slideBarMarginLeft)/2;
	scatterplotWidth = treeContainerWidth + 50 - viewMargin > (styleHeight - 2*viewMargin)*2/3 - 50 - viewMargin ? (styleHeight - 2*viewMargin)*2/3 - 50 - viewMargin : treeContainerWidth - viewMargin;
	scatterplotHeight = styleHeight - 3*viewMargin - $("#ctrPanel").height() - 56;
	barLength = height - 10;
	barY = styleHeight - 130;

	$("#container").height(containerHeight);
	$("#ourTreeContainer").width(treeContainerWidth+slideBarMarginLeft);
	$("#ourTreeContainer").height(styleHeight - 2*viewMargin);
	$("#distillTree").height(styleHeight - 2*viewMargin);
	$("#label-ordered-tree-container").height(styleHeight - 2*viewMargin - 50);
	$("#distill-container").height(styleHeight - 2*viewMargin - 50);
	$("#distillTree").width(distillTreeContainerWidth);
	$("#scatterplotFooter").width(scatterplotWidth);
	// if(treeContainerWidth + 50 - viewMargin > (styleHeight - 2*viewMargin)*2/3 - 50 - viewMargin){
	// 	$("#ctrPanel").height((scatterplotWidth+50)/2);
	// }else{
	// 	$("#ctrPanel").height(styleHeight - viewMargin - treeContainerWidth - 50 - 20);
	// }
	
	$("#sliderPanel0").width(scatterplotWidth - 90);
	$("#sliderPanel1").width(scatterplotWidth - 90);
	$("#sliderPanel2").width(scatterplotWidth - 90);
	//end setting sizes

	//set slider
	d3.select('#slider0')
		.call(
			d3.slider()
				.value(6)
				.axis(true)
				.min(0)
				.max(10)
				.step(0.01)
				.on("slide", function(evt, value) {
  					to = value;
					plotTree();
					$("#oValue").html(value);
				})
	);
	d3.select('#slider1')
		.call(
			d3.slider()
				.value(10)
				.axis(true)
				.min(0)
				.max(200)
				.step(0.1)
				.on("slide", function(evt, value) {
  					// ta = value/10;
					ta = value
					plotTree();
					$("#taValue").html(value);
				})
	);
	d3.select('#slider2')
		.call(
			d3.slider()
				.value(6)
				.axis(true)
				.min(0)
				.max(10)
				.step(0.1)
				.on("slide", function(evt, value) {
					tb = value/2;
					plotTree();
					$("#tbValue").html(value);
				})
	);
	

	//add mouse over to sliders to give tips
	$('#slider0').mouseover(function(evt){
		if(!isMouseDown0){
			showTips0 = true;
		}
	})
	$('#slider0').mousedown(function(evt){
		isMouseDown0 = true;
		showTips0 = false;
	})
	$('#slider0').mouseout(function(evt){
		showTips0 = false;
		$("#tips").css({
			"display" : "none"
		})	
	})
	$('#slider0').mousemove(function(evt){
		if(showTips0){
			$("#tips").css({
				"display" : "block",
				"top" : evt.pageY+2,
				"left" : evt.pageX+2
			})
			$("#tips").html(tip0)
		}
	})
	//slider 1
	$('#slider1').mouseover(function(evt){
		if(!isMouseDown1){
			showTips1 = true;
		}
	})
	$('#slider1').mousedown(function(evt){
		isMouseDown1 = true;
		showTips1 = false;
	})
	$('#slider1').mouseout(function(evt){
		showTips1 = false;
		$("#tips").css({
			"display" : "none"
		})	
	})
	$('#slider1').mousemove(function(evt){
		if(showTips1){
			$("#tips").css({
				"display" : "block",
				"top" : evt.pageY+2,
				"left" : evt.pageX+4
			})
			$("#tips").html(tip1)
		}
	})
	//slider 2
	$('#slider2').mouseover(function(evt){
		if(!isMouseDown2){
			showTips2 = true;
		}
	})
	$('#slider2').mousedown(function(evt){
		isMouseDown2 = true;
		showTips2 = false;
	})
	$('#slider2').mouseout(function(evt){
		showTips2 = false;
		$("#tips").css({
			"display" : "none"
		})	
	})
	$('#slider2').mousemove(function(evt){
		if(showTips2){
			$("#tips").css({
				"display" : "block",
				"top" : evt.pageY+2,
				"left" : evt.pageX+2
			})
			$("#tips").html(tip2)
		}
	})

	$(document).mouseup(function(evt){
		isMouseDown0 = false;
		showTips0 = true;
		isMouseDown1 = false;
		showTips1 = true;
		isMouseDown2 = false;
		showTips2 = true;
	})



	plotData("data/cucumber.tsv");
	orderThreshHold = 1;


	// bindSlider();
	
});

function plotData(dataFile){
	d3.tsv(dataFile, function(err, data){
		if(err) throw err;
		currentDataSet = data;

		//get number of data attribtues and their names
		let tmpAttrNames = Object.getOwnPropertyNames(currentDataSet[0]);
		dataAttributes = tmpAttrNames.length-4;
		dataAttributeNames = tmpAttrNames.slice(4, tmpAttrNames.length);

		
		plotTree();//plot the tree
		
		plotScatter(currentDataSet);//plot the scatterplot
	})
}

function plotTree(){
	// console.log("ta: " + ta);
	// console.log("tb: " + tb);
	d3.json("data/cucumberNJ.json", function(err, treeJson){
		tree_label = null;
		let preprocessedData = preprocessing(currentDataSet);	
		let D = inputdataDis;
		DBackUp = cloneObj(D);

		let taxa = preprocessedData.taxa;
		let classify = preprocessedData.classify;

		// var NJ = new NeighborJoining(D, taxa, classify);
		// NJ.buildTree();

		let rootNum = 133;//446
		//for compound 653/736 679
console.log(treeJson)
// debugger
		//order with distance and label
		generateTree(treeJson, true, true, 0, 2, DBackUp, rootNum);
		console.log(tree_label);
		drawTree(tree_label.rootNodeBackup, tree_label.treeStructureBackup, tree_label.leafAmount, "label-ordered-tree-container", tree_label.nodesToMerge, tree_label.currentLeafOrder, DBackUp);
		
		document.getElementById("save-btn").addEventListener("click", function(){
			let outputSVG = document.getElementById("label-ordered-tree-container")
			// console.log(outputSVG);
			var s = new XMLSerializer().serializeToString(outputSVG)
			// console.log(s);
				// 创建a标签
				var elementA = document.createElement('a');
				
				//文件的名称为时间戳加文件名后缀
				elementA.download = rootNum + ".svg";
				elementA.style.display = 'none';
				
				//生成一个blob二进制数据，内容为json数据
				var blob = new Blob([s]);
				
				//生成一个指向blob的URL地址，并赋值给a标签的href属性
				elementA.href = URL.createObjectURL(blob);
				document.body.appendChild(elementA);
				elementA.click();
				document.body.removeChild(elementA);
		})

		
	  
	  
		//test
		// for(let i = 0; i < tree_label.highLightFirstStep.length; i++){
		// 	// console.log("drawing outliers:" + tree_label.highLightFirstStep[i]);
		// 	$("#label-ordered-tree-container-node-"+tree_label.highLightFirstStep[i]).css({
		// 		"stroke-width" : 2,
		// 		"stroke" : "#000",
		// 		"r" : 3
		// 	})
		// }
		for(let i = 0; i < tree_label.leafPeakValley.length; i++){
			$("#label-ordered-tree-container-node-"+tree_label.leafPeakValley[i].leafId).css({
				"stroke-width" : 2,
				"r" : 3,
				"stroke" : "green"
			})	
		}
		// for(let i = 0; i < tree_label.outlierNodes.length; i++){
		// 	$("#label-ordered-tree-container-node-"+tree_label.outlierNodes[i]).css({
		// 		"stroke-width" : 2,
		// 		"r" : 3,
		// 		"stroke" : "red"
		// 	})	
		// }
		//end test 

		drawDistilled(tree_label.distilledTreeStructure);


		// if(document.getElementById("slider_1") == null){
		// 	//draw slide bar
		// 	drawBar("label-ordered-tree-container");
		// 	drawButton(tree_label.leafAmount, taxa, "label-ordered-tree-container");
		// 	drawSlider(tree_label.leafAmount, "label-ordered-tree-container", 1);
		// 	drawVSlider(tree_label.leafAmount, "label-ordered-tree-container", 1);	
		// }
	})
}

function changeRooting(rn){
	rooting = rn;
	// plotScatter(currentDataSet);//plot the scatterplot
	plotTree();//plot the tree
}

// function bindSlider(){
// 	//init the position of the slide bar
// 	let sliderWidth = $("#a-slider").width();
// 	let slideContainerWidth = $("#aSlider").width();
// 	let containerA = {"x":$("#aSlider").offset().left,"y":$("#aSlider").offset().top};
// 	$("#a-slider").css({ top: containerA.y + $("#aSlider").height() - sliderWidth - 10, left: containerA.x  + slideContainerWidth/2 - sliderWidth/2 + 5});
// 	let containerB = {"x":$("#bSlider").offset().left,"y":$("#bSlider").offset().top};
// 	$("#b-slider").css({ top: containerB.y + $("#aSlider").height() - sliderWidth - 10, left: containerB.x  + slideContainerWidth/2 - sliderWidth/2 + 5});

// 	let slidewayLen = $("#a-slideway").height();
// 	let slidewayTop = $("#a-slideway").offset().top;
// 	let startDragA = false;
// 	let startDragB = false;
// 	$("#a-slider").mousedown(function(e){
// 		startDragA = true;
// 	})
// 	$("#b-slider").mousedown(function(e){
// 		startDragB = true;
// 	})
// 	$(document).mousemove(function(e){
// 		if(startDragA){
// 			let y = e.pageY;
// 			//split into 10 pieces
// 			let unitHeight = slidewayLen/10;
// 			let sliderTop = slidewayTop + (parseInt((y - slidewayTop)/unitHeight))*unitHeight;
// 			if(sliderTop >= slidewayTop && sliderTop < slidewayTop+slidewayLen){
// 				$("#a-slider").css({top: sliderTop});
// 				$("#Tavalue").val(10-parseInt((y - slidewayTop)/unitHeight));
// 			}
// 		}
// 		if(startDragB){
// 			let y = e.pageY;
// 			//split into 10 pieces
// 			let unitHeight = slidewayLen/10;
// 			let sliderTop = slidewayTop + (parseInt((y - slidewayTop)/unitHeight))*unitHeight;
// 			if(sliderTop >= slidewayTop && sliderTop < slidewayTop+slidewayLen){
// 				$("#b-slider").css({top: sliderTop});
// 				$("#Tbvalue").val(10-parseInt((y - slidewayTop)/unitHeight));
// 			}
// 		}
// 	})
// 	$(document).mouseup(function(e){
// 		if(startDragA || startDragB){
// 			//change tree
// 			ta = $("#Tavalue").val() == "" ? ta : $("#Tavalue").val()/10;
// 			tb = $("#Tbvalue").val() == "" ? tb : $("#Tbvalue").val()/2;
// 			plotTree();
// 		}
// 		startDragA = false;
// 		startDragB = false;
// 	})
// }


////////////////////////////////////////////////////////////////////////////////////////////////////////////
// var current_width = 1;
// var menu_status = 0;
// var current_ws_width = 0;

// $(document).ready(function(){
// 	//get dashboard size and set some other sizes
// 	$(document.body).width($(window).width()-20);
// 	$(document.body).height($(window).height()-10);
// 	$("#header").width($(window).width()-20);

// 	let containerHeight = $(document.body).height()-70;
// 	dashboardWidth = $(document.body).width() - 4 * viewMargin;
// 	// let dashboardHeight = containerHeight - ;



// 	treeContainerWidth = 2 * dashboardWidth / 5 < 200 ? 200 : (2 * dashboardWidth / 5) - slideBarMarginLeft;
// 	let styleHeight = containerHeight;
// 	height = containerHeight - 2*viewMargin - 50 - 50;
// 	barWidth = treeContainerWidth-10;
// 	distillTreeContainerWidth = (treeContainerWidth+slideBarMarginLeft)/2;
// 	scatterplotWidth = treeContainerWidth + 50 - viewMargin > (styleHeight - 2*viewMargin)*2/3 - 50 - viewMargin ? (styleHeight - 2*viewMargin)*2/3 - 50 - viewMargin : treeContainerWidth - viewMargin;
// 	scatterplotHeight = styleHeight - 3*viewMargin - $("#ctrPanel").height() - 56;
// 	barLength = height - 10;
// 	barY = styleHeight - 130;

// 	$("#container").height(containerHeight);
// 	$("#ourTreeContainer").width(treeContainerWidth+slideBarMarginLeft);
// 	$("#ourTreeContainer").height(styleHeight - 2*viewMargin);
// 	$("#distillTree").height(styleHeight - 2*viewMargin);
// 	$("#label-ordered-tree-container").height(styleHeight - 2*viewMargin - 50);
// 	$("#distill-container").height(styleHeight - 2*viewMargin - 50);
// 	$("#distillTree").width(distillTreeContainerWidth);
// 	$("#scatterplotFooter").width(scatterplotWidth);
// 	// if(treeContainerWidth + 50 - viewMargin > (styleHeight - 2*viewMargin)*2/3 - 50 - viewMargin){
// 	// 	$("#ctrPanel").height((scatterplotWidth+50)/2);
// 	// }else{
// 	// 	$("#ctrPanel").height(styleHeight - viewMargin - treeContainerWidth - 50 - 20);
// 	// }
	
// 	$("#sliderPanel0").width(scatterplotWidth - 90);
// 	$("#sliderPanel1").width(scatterplotWidth - 90);
// 	$("#sliderPanel2").width(scatterplotWidth - 90);
// 	//end setting sizes

// 	//set slider
// 	d3.select('#slider0')
// 		.call(
// 			d3.slider()
// 				.value(6)
// 				.axis(true)
// 				.min(0)
// 				.max(30)
// 				.step(0.1)
// 				.on("slide", function(evt, value) {
//   					to = value;
// 					plotTree();
// 					$("#oValue").html(value);
// 				})
// 	);
// 	d3.select('#slider1')
// 		.call(
// 			d3.slider()
// 				.value(10)
// 				.axis(true)
// 				.min(0)
// 				.max(200)
// 				.step(0.1)
// 				.on("slide", function(evt, value) {
//   					ta = value/10;
// 					plotTree();
// 					$("#taValue").html(value);
// 				})
// 	);
// 	d3.select('#slider2')
// 		.call(
// 			d3.slider()
// 				.value(6)
// 				.axis(true)
// 				.min(0)
// 				.max(10)
// 				.step(0.1)
// 				.on("slide", function(evt, value) {
// 					tb = value/2;
// 					plotTree();
// 					$("#tbValue").html(value);
// 				})
// 	);
	

// 	//add mouse over to sliders to give tips
// 	$('#slider0').mouseover(function(evt){
// 		if(!isMouseDown0){
// 			showTips0 = true;
// 		}
// 	})
// 	$('#slider0').mousedown(function(evt){
// 		isMouseDown0 = true;
// 		showTips0 = false;
// 	})
// 	$('#slider0').mouseout(function(evt){
// 		showTips0 = false;
// 		$("#tips").css({
// 			"display" : "none"
// 		})	
// 	})
// 	$('#slider0').mousemove(function(evt){
// 		if(showTips0){
// 			$("#tips").css({
// 				"display" : "block",
// 				"top" : evt.pageY+2,
// 				"left" : evt.pageX+2
// 			})
// 			$("#tips").html(tip0)
// 		}
// 	})
// 	//slider 1
// 	$('#slider1').mouseover(function(evt){
// 		if(!isMouseDown1){
// 			showTips1 = true;
// 		}
// 	})
// 	$('#slider1').mousedown(function(evt){
// 		isMouseDown1 = true;
// 		showTips1 = false;
// 	})
// 	$('#slider1').mouseout(function(evt){
// 		showTips1 = false;
// 		$("#tips").css({
// 			"display" : "none"
// 		})	
// 	})
// 	$('#slider1').mousemove(function(evt){
// 		if(showTips1){
// 			$("#tips").css({
// 				"display" : "block",
// 				"top" : evt.pageY+2,
// 				"left" : evt.pageX+4
// 			})
// 			$("#tips").html(tip1)
// 		}
// 	})
// 	//slider 2
// 	$('#slider2').mouseover(function(evt){
// 		if(!isMouseDown2){
// 			showTips2 = true;
// 		}
// 	})
// 	$('#slider2').mousedown(function(evt){
// 		isMouseDown2 = true;
// 		showTips2 = false;
// 	})
// 	$('#slider2').mouseout(function(evt){
// 		showTips2 = false;
// 		$("#tips").css({
// 			"display" : "none"
// 		})	
// 	})
// 	$('#slider2').mousemove(function(evt){
// 		if(showTips2){
// 			$("#tips").css({
// 				"display" : "block",
// 				"top" : evt.pageY+2,
// 				"left" : evt.pageX+2
// 			})
// 			$("#tips").html(tip2)
// 		}
// 	})

// 	$(document).mouseup(function(evt){
// 		isMouseDown0 = false;
// 		showTips0 = true;
// 		isMouseDown1 = false;
// 		showTips1 = true;
// 		isMouseDown2 = false;
// 		showTips2 = true;
// 	})



// for(let i = 1; i <= 5; i++) {
	
// 	setTimeout(() => {plotData("data/compound.tsv", i, 1);}, 5000);
	
// 	setTimeout(() => {plotData("data/compound.tsv", i, 100);}, 5000);
// }

// 	//plotData("data/compound.tsv", 1, 100);
	
// 	//plotData("data/compound.tsv", 679, 100);
	
// 	orderThreshHold = 1;


// 	// bindSlider();
	
// });

// function plotData(dataFile, rootNum, alpha){
// 	d3.tsv(dataFile, function(err, data){
// 		if(err) throw err;
// 		currentDataSet = data;

// 		//get number of data attribtues and their names
// 		let tmpAttrNames = Object.getOwnPropertyNames(currentDataSet[0]);
// 		dataAttributes = tmpAttrNames.length-4;
// 		dataAttributeNames = tmpAttrNames.slice(4, tmpAttrNames.length);

		
// 		plotTree(rootNum, alpha);//plot the tree
		
// 		//plotScatter(currentDataSet);//plot the scatterplot
// 	})
// }

// function plotTree(rootNum, alpha){
// 	// console.log("ta: " + ta);
// 	// console.log("tb: " + tb);
// 	d3.json("data/compound_nj.json", function(err, treeJson){
// 		tree_label = null;
// 		let preprocessedData = preprocessing(currentDataSet);	
// 		let D = inputdataDis;
// 		DBackUp = cloneObj(D);

// 		let taxa = preprocessedData.taxa;
// 		let classify = preprocessedData.classify;

// 		// var NJ = new NeighborJoining(D, taxa, classify);
// 		// NJ.buildTree();



// 		//order with distance and label
// 		generateTree(treeJson, true, true, 0, 2, DBackUp, rootNum, alpha);
// 		console.log(tree_label);
// 		drawTree(tree_label.rootNodeBackup, tree_label.treeStructureBackup, tree_label.leafAmount, "label-ordered-tree-container", tree_label.nodesToMerge, tree_label.currentLeafOrder, DBackUp);
		
		
		
	  
	  
// 		//test
// 		// for(let i = 0; i < tree_label.highLightFirstStep.length; i++){
// 		// 	// console.log("drawing outliers:" + tree_label.highLightFirstStep[i]);
// 		// 	$("#label-ordered-tree-container-node-"+tree_label.highLightFirstStep[i]).css({
// 		// 		"stroke-width" : 2,
// 		// 		"stroke" : "#000",
// 		// 		"r" : 3
// 		// 	})
// 		// }
// 		for(let i = 0; i < tree_label.leafPeakValley.length; i++){
// 			$("#label-ordered-tree-container-node-"+tree_label.leafPeakValley[i].leafId).css({
// 				"stroke-width" : 2,
// 				"r" : 3,
// 				"stroke" : "green"
// 			})	
// 		}
// 		// for(let i = 0; i < tree_label.outlierNodes.length; i++){
// 		// 	$("#label-ordered-tree-container-node-"+tree_label.outlierNodes[i]).css({
// 		// 		"stroke-width" : 2,
// 		// 		"r" : 3,
// 		// 		"stroke" : "red"
// 		// 	})	
// 		// }
// 		//end test 

// 		//drawDistilled(tree_label.distilledTreeStructure);

// //document.getElementById("save-btn").addEventListener("click", function(){
// 	let outputSVG = document.getElementById("label-ordered-tree-container")
// 	// console.log(outputSVG);
// 	var s = new XMLSerializer().serializeToString(outputSVG)
// 	// console.log(s);
// 		// 创建a标签
// 		var elementA = document.createElement('a');
		
// 		//文件的名称为时间戳加文件名后缀
// 		elementA.download = rootNum + "-" + alpha + ".svg";
// 		elementA.style.display = 'none';
		
// 		//生成一个blob二进制数据，内容为json数据
// 		var blob = new Blob([s]);
		
// 		//生成一个指向blob的URL地址，并赋值给a标签的href属性
// 		elementA.href = URL.createObjectURL(blob);
// 		document.body.appendChild(elementA);
// 		elementA.click();
// 		document.body.removeChild(elementA);
// //})
// while(outputSVG.childNodes[2]) {
// 	outputSVG.removeChild(outputSVG.childNodes[2]);
// }
// //document.getElementById("save-btn").click()
// // d3.selectAll("circle").remove()
// // d3.selectAll("polyline").remove()
// // d3.select("label-ordered-tree-container_bgg").remove()


// 		// if(document.getElementById("slider_1") == null){
// 		// 	//draw slide bar
// 		// 	drawBar("label-ordered-tree-container");
// 		// 	drawButton(tree_label.leafAmount, taxa, "label-ordered-tree-container");
// 		// 	drawSlider(tree_label.leafAmount, "label-ordered-tree-container", 1);
// 		// 	drawVSlider(tree_label.leafAmount, "label-ordered-tree-container", 1);	
// 		// }
// 	})
// }

// function changeRooting(rn){
// 	rooting = rn;
// 	// plotScatter(currentDataSet);//plot the scatterplot
// 	plotTree();//plot the tree
// }