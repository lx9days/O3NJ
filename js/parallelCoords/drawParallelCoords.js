var dimensions;
var minMax = new Map();
var yScales = new Map();
var plotData;
var scaleLevel = 2;
var margin = { top: 80, right: 60, bottom: 30, left: 70 };
var canvas;

function initCanvas(containerCANVAS){
	//set canvas and svg attributes	
	width = $("#"+containerCANVAS).width(),
	height = $("#"+containerCANVAS).height();
	
	canvas = document.getElementById(containerCANVAS);
	canvas.width = scaleLevel*width;
	canvas.height = scaleLevel*height;
}

function drawParallelCoords(dataset, containerCANVAS){
	initCanvas(containerCANVAS);
	plotData = new Array();
	//extract plot data
	for(let i = 0, len = dataset.length; i < len; i++){
		let tmpObj = {};
		for(let prop in dataset[i]){
			if(prop.substring(0,4) == "attr"){
				tmpObj[prop] = dataset[i][prop];
			}
		}
		plotData.push(tmpObj);
	}
	dimensions = d3.keys(plotData[0]);
	for(let i = 0; i < dimensions.length; i++){
		minMax.set(dimensions[i], [1000000, -1000000]);
	}
	for(let i = 0; i < plotData.length; i++){
		for(let prop in plotData[i]){
			let tmpMinMax = minMax.get(prop);
			if(tmpMinMax[0] > parseFloat(plotData[i][prop])){
				tmpMinMax[0] = parseFloat(plotData[i][prop]);
			}
			if(tmpMinMax[1] < parseFloat(plotData[i][prop])){
				tmpMinMax[1] = parseFloat(plotData[i][prop]);
			}
			minMax.set(prop, tmpMinMax);
			yScales.set(prop, 
				d3.scaleLinear()
					.domain(tmpMinMax)
					.range([scaleLevel*(height-margin.bottom-10), scaleLevel*(margin.top+10)])
			);
		}
	}

	paintParaCoords(dataset);
}

function paintParaCoords(dataset, hightLightIndex = [-1]){
	let canvasBuffer = document.createElement("canvas");
	canvasBuffer.width = canvas.width;
	canvasBuffer.height = canvas.height;

	let ctx = canvas.getContext("2d");
	let ctxBuffer = canvasBuffer.getContext("2d");

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctxBuffer.clearRect(0, 0, canvasBuffer.width, canvasBuffer.height);

	//draw data
	for(let i = 0; i < plotData.length; i++){
		//for each data record, draw a line
		let count = 0;//count attrs
		ctxBuffer.beginPath();
		for(let prop in plotData[i]){
			//console.log(prop + ": " + plotData[i][prop]);
			let x = (margin.left+count*(width-margin.left-margin.right)/(dimensions.length-1))*scaleLevel;
			let y = yScales.get(prop)(plotData[i][prop]);
			if(count == 0){//move the painter to the position of the first point
				ctxBuffer.moveTo(x, y);
			}else{
				ctxBuffer.lineTo(x, y);
			}
			count++;
		}
		// ctxBuffer.strokeStyle = mapColor(dataset[i].classify);
		if(hightLightIndex.indexOf(i+1) > -1){
			ctxBuffer.strokeStyle = "#d94801";
			ctxBuffer.lineWidth = 4;
		}else{
			ctxBuffer.strokeStyle = mapColor(1);	
			ctxBuffer.lineWidth = 1;
		}
		
		ctxBuffer.stroke();
	}

	//draw axis
	dimensions.forEach(function(d, i){
		let tmpx = parseInt(i*(width-margin.left-margin.right)/(dimensions.length-1));
		ctxBuffer.beginPath();
		ctxBuffer.moveTo((margin.left+tmpx-5)*scaleLevel,scaleLevel*margin.top);
		ctxBuffer.lineTo((margin.left+tmpx+5)*scaleLevel,scaleLevel*margin.top);

		ctxBuffer.moveTo((margin.left+tmpx)*scaleLevel,scaleLevel*margin.top);
		ctxBuffer.lineTo((margin.left+tmpx)*scaleLevel,scaleLevel*(height-margin.bottom));

		ctxBuffer.moveTo((margin.left+tmpx-5)*scaleLevel,scaleLevel*(height-margin.bottom));
		ctxBuffer.lineTo((margin.left+tmpx+5)*scaleLevel,scaleLevel*(height-margin.bottom));

		ctxBuffer.strokeStyle = "#777";
		ctxBuffer.lineWidth = 5;
		ctxBuffer.stroke();	
	})
	ctx.drawImage(canvasBuffer, 0, 0);  
}