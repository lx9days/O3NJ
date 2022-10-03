var sliderWidth = 16;
var barWidth = 410;
var barHeight = 4;
var barLength = 780;//for vbar
var barX = slideBarMarginLeft;
var barY = 1030;
var vbarX = slideBarMarginLeft-20;
var vbarY = 10;
var referLineWidth = 1;
var referLineHeight = 1060;//length of reference line on the x axis
var isXDragging = false;
var isYDragging = false;
var leafTaxa;

function drawBar(treeContainer){
	let svg = $("#"+treeContainer);
	let bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	bar.setAttribute("x", barX);
	bar.setAttribute("y", barY);
	bar.setAttribute("rx", barHeight/2);
	bar.setAttribute("ry", barHeight/2);
	bar.setAttribute("width", barWidth);
	bar.setAttribute("height", barHeight);
	bar.setAttribute("fill", "url('#Gradient2')");
	bar.setAttribute("stroke", "url('#Gradient3')");
	bar.setAttribute("stroke-width", 2);
	svg.append(bar);

	let vbar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	vbar.setAttribute("x", vbarX);
	vbar.setAttribute("y", vbarY);
	vbar.setAttribute("rx", barHeight/2);
	vbar.setAttribute("ry", barHeight/2);
	vbar.setAttribute("width", barHeight);
	vbar.setAttribute("height", barLength);
	vbar.setAttribute("fill", "url('#Gradient6')");
	vbar.setAttribute("stroke", "url('#Gradient7')");
	vbar.setAttribute("stroke-width", 2);
	svg.append(vbar);	
}

function drawButton(leafAmount, taxa, treeContainer){
	let svg = $("#"+treeContainer);
	leafTaxa = taxa;

	let delButton = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	delButton.setAttribute("cx", barX+barWidth-65);
	delButton.setAttribute("cy", barY+30);
	delButton.setAttribute("r", 15);
	delButton.setAttribute("fill", "url('#Gradient4')");
	delButton.setAttribute("stroke", "url('#Gradient5')");
	delButton.setAttribute("stroke-width", 4);
	delButton.onclick = function(){
		delSlider(leafAmount, taxa, treeContainer);
	}
	svg.append(delButton);
	let delText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	delText.setAttribute("x", barX+barWidth-65-8);
	delText.setAttribute("y", barY+30+6);
	delText.setAttribute("fill", "#555");
	delText.setAttribute("font-family", "Arial");
	delText.setAttribute("style", "font-size:15px;font-weight:bold;cursor:pointer;");
	delText.innerHTML = "-V";
	delText.onclick = function(){
		delSlider(leafAmount, taxa, treeContainer);
	}
	svg.append(delText);

	let addButton = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	addButton.setAttribute("cx", barX+barWidth-25);
	addButton.setAttribute("cy", barY+30);
	addButton.setAttribute("r", 15);
	addButton.setAttribute("fill", "url('#Gradient4')");
	addButton.setAttribute("stroke", "url('#Gradient5')");
	addButton.setAttribute("stroke-width", 4);
	addButton.onclick = function(){
		addSlider(leafAmount, treeContainer);
	}
	svg.append(addButton);
	let addText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	addText.setAttribute("x", barX+barWidth-25-8);
	addText.setAttribute("y", barY+30+6);
	addText.setAttribute("fill", "#555");
	addText.setAttribute("font-family", "Arial");
	addText.setAttribute("style", "font-size:15px;font-weight:bold;cursor:pointer;");
	addText.innerHTML = "+V";
	addText.onclick = function(){
		addSlider(leafAmount, treeContainer);
	}
	svg.append(addText);

	let vDelButton = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	vDelButton.setAttribute("cx", vbarX+20);
	vDelButton.setAttribute("cy", barY+30);
	vDelButton.setAttribute("r", 15);
	vDelButton.setAttribute("fill", "url('#Gradient4')");
	vDelButton.setAttribute("stroke", "url('#Gradient5')");
	vDelButton.setAttribute("stroke-width", 4);
	vDelButton.onclick = function(){
		delVSlider(leafAmount, taxa, treeContainer);
	}
	svg.append(vDelButton);
	let vdelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	vdelText.setAttribute("x", vbarX+20-8);
	vdelText.setAttribute("y", barY+30+6);
	vdelText.setAttribute("fill", "#555");
	vdelText.setAttribute("font-family", "Arial");
	vdelText.setAttribute("style", "font-size:15px;font-weight:bold;cursor:pointer;");
	vdelText.innerHTML = "-H";
	vdelText.onclick = function(){
		delVSlider(leafAmount, taxa, treeContainer);
	}
	svg.append(vdelText);

	let vAddButton = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	vAddButton.setAttribute("cx", vbarX+60);
	vAddButton.setAttribute("cy", barY+30);
	vAddButton.setAttribute("r", 15);
	vAddButton.setAttribute("fill", "url('#Gradient4')");
	vAddButton.setAttribute("stroke", "url('#Gradient5')");
	vAddButton.setAttribute("stroke-width", 4);
	vAddButton.onclick = function(){
		addVSlider(leafAmount, treeContainer);
	}
	svg.append(vAddButton);
	let vaddText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	vaddText.setAttribute("x", vbarX+60-8);
	vaddText.setAttribute("y", barY+30+6);
	vaddText.setAttribute("fill", "#555");
	vaddText.setAttribute("font-family", "Arial");
	vaddText.setAttribute("style", "font-size:15px;font-weight:bold;cursor:pointer;");
	vaddText.innerHTML = "+H";
	vaddText.onclick = function(){
		addVSlider(leafAmount, treeContainer);
	}
	svg.append(vaddText);

	let resetButton = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	resetButton.setAttribute("x", vbarX+barWidth/2-30);
	resetButton.setAttribute("y", barY+15);
	resetButton.setAttribute("rx", 5);
	resetButton.setAttribute("ry", 5);
	resetButton.setAttribute("width", 60);
	resetButton.setAttribute("height", 30);
	resetButton.setAttribute("fill", "url('#Gradient4')");
	resetButton.setAttribute("stroke", "url('#Gradient5')");
	resetButton.setAttribute("stroke-width", 4);
	resetButton.onclick = function(){
		// addVSlider(leafAmount, treeContainer);
		for(let i = 0; i < leafAmount; i++){
			$("#ori-tree-container-node-"+(i+1)).css("fill", treeNodeColor(tree_label.treeStructure[i+1].classify, tree_label.treeStructure[i+1].x));
			$("#label-ordered-tree-container-node-"+(i+1)).css("fill", treeNodeColor(tree_label.treeStructure[i+1].classify, tree_label.treeStructure[i+1].x));
			$("#hc-tree-container-node-"+(i+1)).css("fill", mapColor(1));
			$("#scatter"+leafTaxa[i]).css("stroke", treeNodeColor(tree_label.treeStructure[i+1].classify, tree_label.treeStructure[i+1].x));
		}
		determinedClusterNum = 0;
		selectedGrids = new Map();
	}
	svg.append(resetButton);
	let resetText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	resetText.setAttribute("x", vbarX+barWidth/2-25);
	resetText.setAttribute("y", barY+30+6);
	resetText.setAttribute("fill", "#555");
	resetText.setAttribute("font-family", "Arial");
	resetText.setAttribute("style", "font-size:15px;font-weight:bold;cursor:pointer;");
	resetText.innerHTML = "RESET";
	resetText.onclick = function(){
		for(let i = 0; i < leafAmount; i++){
			$("#ori-tree-container-node-"+(i+1)).css("fill", treeNodeColor(tree_label.treeStructure[i+1].classify, tree_label.treeStructure[i+1].x));
			$("#label-ordered-tree-container-node-"+(i+1)).css("fill", treeNodeColor(tree_label.treeStructure[i+1].classify, tree_label.treeStructure[i+1].x));
			$("#hc-tree-container-node-"+(i+1)).css("fill", mapColor(1));
			$("#scatter"+leafTaxa[i]).css("stroke", treeNodeColor(tree_label.treeStructure[i+1].classify, tree_label.treeStructure[i+1].x));
		}
		determinedClusterNum = 0;
		selectedGrids = new Map();
	}
	svg.append(resetText);

	document.onmousemove = function(e){
		if(isXDragging){
			let tmpX = e.pageX - svg.offset().left - sliderWidth/2;
			if(tmpX > barX && tmpX < barX + barWidth - sliderWidth/2){//moving on the bar
				$("#slider_"+slidingId).attr("cx", tmpX + sliderWidth/2);
				$("#referLine_"+slidingId).attr("x1", tmpX + sliderWidth/2 - referLineWidth);
				$("#referLine_"+slidingId).attr("x2", tmpX + sliderWidth/2 - referLineWidth);

				sliderX.set(slidingId, tmpX + sliderWidth/2 - referLineWidth);
				let sliderXArr = new Array();
				for(var [ key , value ] of sliderX){
					sliderXArr.push(parseInt(value));
				}
				sliderXArr.sort(function(a, b){
					return a-b;
				});
				// coloriseLeaf(leafAmount, sliderXArr, taxa, treeContainer);
			}
		}
		if(isYDragging){
			let tmpY = e.pageY - svg.offset().top - sliderWidth/2;
			if(tmpY > vbarY && tmpY < vbarY + barLength - sliderWidth/2){//moving on the bar
				$("#vslider_"+vSlidingId).attr("cy", tmpY + sliderWidth/2);
				$("#vreferLine_"+vSlidingId).attr("y1", tmpY + sliderWidth/2 - referLineWidth);
				$("#vreferLine_"+vSlidingId).attr("y2", tmpY + sliderWidth/2 - referLineWidth);

				vSliderY.set(vSlidingId, tmpY + sliderWidth/2 - referLineWidth);
				
			}
		}
	}

	document.onmouseup = function(){
		if(isXDragging || isYDragging){
			drawGrid(leafAmount, treeContainer);
		}
		isXDragging = false;
		isYDragging = false;
		slidingId = "";
		vSlidingId = "";
	}
}

function drawSlider(leafAmount, treeContainer, sliderIndex){
	let svg = $("#"+treeContainer);

	let slider = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	slider.setAttribute("id", "slider_"+sliderIndex);
	slider.setAttribute("cx", barX + barWidth - sliderWidth/2 - referLineWidth);
	slider.setAttribute("cy", barY + barHeight/2);
	slider.setAttribute("r", sliderWidth/2);
	slider.setAttribute("fill", "url('#Gradient1')");
	slider.setAttribute("stroke", "#9a9a9a");
	slider.setAttribute("stroke-width", 2);
	sliderX.set(sliderIndex+"", barX + barWidth - sliderWidth/2 - referLineWidth);
	svg.append(slider);

	let referLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	referLine.setAttribute("id", "referLine_"+sliderIndex);
	referLine.setAttribute("x1", barX + barWidth - sliderWidth/2 - referLineWidth);
	referLine.setAttribute("y1", barY - (sliderWidth - barHeight)/2);
	referLine.setAttribute("x2", barX + barWidth - sliderWidth/2 - referLineWidth);
	referLine.setAttribute("y2", 0);
	referLine.setAttribute("stroke", "#aaa");
	referLine.setAttribute("stroke-width", referLineWidth);
	referLine.setAttribute("stroke-dasharray", "5, 5");
	svg.append(referLine);

	slider.onmousedown = function(e){
		isXDragging = true;
		slidingId = $(this).attr("id").split("_")[1];
		if(sliderX.get(slidingId) == "undefined"){
			let tmpX = e.pageX - svg.offset().left - sliderWidth/2;
			sliderX.set(slidingId, tmpX);
		}
	}

	drawGrid(leafAmount, treeContainer);
}

function drawVSlider(leafAmount, treeContainer, sliderIndex){
	let svg = $("#"+treeContainer);

	let vSlider = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	vSlider.setAttribute("id", "vslider_"+sliderIndex);
	vSlider.setAttribute("cx", vbarX + barHeight/2);
	vSlider.setAttribute("cy", vbarY + barLength - sliderWidth/2 - referLineWidth);
	vSlider.setAttribute("r", sliderWidth/2);
	vSlider.setAttribute("fill", "url('#Gradient1')");
	vSlider.setAttribute("stroke", "#9a9a9a");
	vSlider.setAttribute("stroke-width", 2);
	vSliderY.set(sliderIndex+"", vbarY + barLength - sliderWidth/2 - referLineWidth);
	svg.append(vSlider);

	let vReferLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
	vReferLine.setAttribute("id", "vreferLine_"+sliderIndex);
	vReferLine.setAttribute("x1", vbarX + barHeight/2 + sliderWidth/2);
	vReferLine.setAttribute("y1", vbarY + barLength - sliderWidth/2);
	vReferLine.setAttribute("x2", vbarX + treeContainerWidth - sliderWidth/2);
	vReferLine.setAttribute("y2", vbarY + barLength - sliderWidth/2);
	vReferLine.setAttribute("stroke", "#aaa");
	vReferLine.setAttribute("stroke-width", referLineWidth);
	vReferLine.setAttribute("stroke-dasharray", "5, 5");
	svg.append(vReferLine);

	vSlider.onmousedown = function(e){
		isYDragging = true;
		vSlidingId = $(this).attr("id").split("_")[1];
		if(vSliderY.get(vSlidingId) == "undefined"){
			let tmpY = e.pageY - svg.offset().top - sliderWidth/2;
			vSliderY.set(vSlidingId, tmpY);
		}
	}

	drawGrid(leafAmount, treeContainer);
}

function addSlider(leafAmount, treeContainer){
	sliderNum++;
	drawSlider(leafAmount, treeContainer, sliderNum);
}

function addVSlider(leafAmount, treeContainer){
	vSliderNum++;
	drawVSlider(leafAmount, treeContainer, vSliderNum);
}

function drawGrid(leafAmount, treeContainer){
	//reset g contains all the grids
	let bgg = document.getElementById(treeContainer+"_bgg");
	bgg.innerHTML = "";

	//sort slider x and vslider y
	let sliderXArr = new Array();
	sliderXArr.push(vbarX);
	for(var [ key , value ] of sliderX){
		sliderXArr.push(parseInt(value));
	}
	sliderXArr.sort(function(a, b){
		return a-b;
	});
	sliderXArr.push(500);

	let vSliderYArr = new Array();
	vSliderYArr.push(0);
	for(var [ key , value ] of vSliderY){
		vSliderYArr.push(parseInt(value));
	}
	vSliderYArr.sort(function(a, b){
		return a-b;
	});
	vSliderYArr.push(barY);

	//according to the number of sliders and vsliders to dynamically add grids
	for(let i = 0; i < vSliderYArr.length-1; i++){
		for(let j = 1; j < sliderXArr.length-1; j++){
			let grid = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			grid.setAttribute("x", sliderXArr[j]);
			grid.setAttribute("y", vSliderYArr[i]);
			grid.setAttribute("width", sliderXArr[j+1]-sliderXArr[j]);
			grid.setAttribute("height", vSliderYArr[i+1]-vSliderYArr[i]);
			grid.setAttribute("fill", "rgba(0,0,0,0)");
			
			grid.onmousedown = function(e){
				let topLeftX = parseFloat(this.getAttribute("x"));
				let topLeftY = parseFloat(this.getAttribute("y"));
				let bottomRightX = parseFloat(this.getAttribute("x"))+parseFloat(this.getAttribute("width"));
				let bottomRightY = parseFloat(this.getAttribute("y"))+parseFloat(this.getAttribute("height"));

				let selectedLeaves = new Array();
				let hasColored = false;
				for(let m = 1; m <= leafAmount; m++){
					let tmpLeaf = document.getElementById(treeContainer+"-node-"+m);
					let tmpLeafX = parseFloat(tmpLeaf.getAttribute("cx"));
					let tmpLeafY = parseFloat(tmpLeaf.getAttribute("cy"));

					if(tmpLeafX >= topLeftX && tmpLeafX < bottomRightX && tmpLeafY >= topLeftY && tmpLeafY < bottomRightY){
						selectedLeaves.push(tmpLeaf);
					}
				}

				//colorize or cancel colorize this grid
				let gridId = topLeftX+"-"+topLeftY+"-"+bottomRightX+"-"+bottomRightY;
				if(typeof selectedGrids.get(gridId) == "undefined" || selectedGrids.get(gridId) == false){
					selectedGrids.set(gridId, true);
					determinedClusterNum++;
					for(let m = 0; m < selectedLeaves.length; m++){
						selectedLeaves[m].setAttribute("fill", mapColor(determinedClusterNum+1));
						let idStrs = selectedLeaves[m].getAttribute("id").split("-");
						let index = parseInt(idStrs[idStrs.length-1]);

						$("#scatter"+leafTaxa[index-1]).css("stroke", mapColor(determinedClusterNum+1));
						$("#ori-tree-container-node-"+index).css("fill", mapColor(determinedClusterNum+1));
						$("#label-ordered-tree-container-node-"+index).css("fill", mapColor(determinedClusterNum+1));
						$("#hc-tree-container-node-"+index).css("fill", mapColor(determinedClusterNum+1));
					}
				}else{
					selectedGrids.set(gridId, false);
					determinedClusterNum--;
					for(let m = 0; m < selectedLeaves.length; m++){
						selectedLeaves[m].setAttribute("fill", mapColor(1));
						let idStrs = selectedLeaves[m].getAttribute("id").split("-");
						let index = parseInt(idStrs[idStrs.length-1]);

						$("#scatter"+leafTaxa[index-1]).css("stroke", mapColor(1));
						$("#ori-tree-container-node-"+index).css("fill", mapColor(1));
						$("#label-ordered-tree-container-node-"+index).css("fill", mapColor(1));
						$("#hc-tree-container-node-"+index).css("fill", mapColor(1));
					}
				}
			}

			grid.onmouseover = function(){
				this.setAttribute("fill", "rgba(0,0,0,0.1)");
			}
			grid.onmouseout = function(){
				this.setAttribute("fill", "rgba(0,0,0,0)");
			}

			bgg.append(grid);
		}
	}
	
}

function delSlider(leafAmount, taxa, treeContainer){
	if(sliderNum > 1){
		$("#slider_"+sliderNum).remove();
		$("#referLine_"+sliderNum).remove();
		sliderX.delete(sliderNum + "");

		let sliderXArr = new Array();
		for(var [ key , value ] of sliderX){
			sliderXArr.push(parseInt(value));
		}
		sliderXArr.sort(function(a, b){
			return a-b;
		});
		coloriseLeaf(leafAmount, sliderXArr, taxa, treeContainer);
		sliderNum--;

		drawGrid(leafAmount, treeContainer);
	}
}

function delVSlider(leafAmount, taxa, treeContainer){
	if(vSliderNum > 1){
		$("#vslider_"+vSliderNum).remove();
		$("#vreferLine_"+vSliderNum).remove();
		vSliderY.delete(vSliderNum + "");
		vSliderNum--;
		
		drawGrid(leafAmount, treeContainer);
	}
}

function coloriseLeaf(leafAmount, sliderXArr, taxa, treeContainer){
	let leaves = new Array();
	for(let i = 0; i < leafAmount; i++){
		let leaf = $("#"+treeContainer+"-node-"+(i+1));
		let leafX = leaf.attr("cx");
		//judge which sliders it is in between
		let colorIndex = 0;
		let foundInBetween = false;

		for(let j = 0, len = sliderXArr.length-1; j < len; j++){
			if(leafX <= sliderXArr[j+1] && leafX > sliderXArr[j]){
				colorIndex = j;
				foundInBetween = true;
			}
		}
		if(!foundInBetween){
			colorIndex = sliderXArr.length-1;
		}
		// leaf.css("fill", mapColor(colorIndex+1));

		//assign color to all the leaves
		$("#ori-tree-container-node-"+(i+1)).css("fill", mapColor(colorIndex+1));
		$("#label-ordered-tree-container-node-"+(i+1)).css("fill", mapColor(colorIndex+1));
		$("#hc-tree-container-node-"+(i+1)).css("fill", mapColor(colorIndex+1));
		$("#scatter"+taxa[i]).css("stroke", mapColor(colorIndex+1));
		$("#pca"+taxa[i]).css("stroke", mapColor(colorIndex+1));
	}
}