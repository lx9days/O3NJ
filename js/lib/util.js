function preprocessing(data){
	let result = {};

	let len = data.length;
	let d = new Array(len);
	let taxa = new Array(len);
	let classify = new Array(len);
	for(let i = 0; i < len; i++){
		d[i] = new Array();
	}

	// console.log("matrix dimension: " + len);

	for(let i = 0; i < len; i++){
		taxa[i] = data[i].taxa;
		classify[i] = data[i].classify;

		let printStr = ""
		for(let j = 0; j < len; j++){
			//calculate distance matrix according to the data matrix
			let tmpSum = 0;
			for(let at = 0; at < dataAttributes; at++){
				let tmpDataIAttr = parseFloat(data[i][dataAttributeNames[at]]);
				let tmpDataJAttr = parseFloat(data[j][dataAttributeNames[at]]);
				tmpSum += (tmpDataIAttr - tmpDataJAttr) * (tmpDataIAttr - tmpDataJAttr);
			}

			let dis = Math.sqrt(tmpSum);
			d[i][j] = dis;
			// printStr += parseInt(dis*10000)/10000+",";
		}
		// console.log(i + "         " + printStr);
	}

	result.D = d;
	result.classify = classify;
	result.taxa = taxa;

	return result;
}

function educDis(data){
	let len = data.length;
	let d = new Array();
	for(let i = 0 ; i < len; i++){
		d[i] = new Array();
	}
	for(let i = 0; i < len; i++){
		for(let j = 0; j < len; j++){
			let dis = Math.sqrt((data[i].x-data[j].x)*(data[i].x-data[j].x)+(data[i].y-data[j].y)*(data[i].y-data[j].y));
			d[i][j] = dis;
		}
	}

	return d;
}

function mapColor(classify){
	return nodeColors[classify];
}

function reset(){
	tree_ori = "";
	tree_distance = "";
	tree_label = "";
	radial_tree = "";
	usingOrdering = true;
	usingLabel = true;
	changingRoot = false;
	maxDepth = 0;
	shownLabel = true;

	minRadialX = 0, maxRadialX = 0, minRadialY = 0, maxRadialY = 0;

	currentDataSet = new Map();

	rooting = 0;//0->rand  1->mid
	clusterDistance = new Map();
	nodeXs = new Map();

	addingNode = false;
	delIdx = -1;
	deletingNode = false;

	addNodeX = 0;
	addNodeY = 0;

	minDinOrder = 1000;
	maxDinOrder = -1000;

	//clear the interface
	$("#scatterplot-container").empty();
	$("#radial-tree-container").empty();
	$("#renderedData").html(dataFormPlaceHolder);
	$("#ori-tree-container").empty();
	$("#label-ordered-tree-container").empty();
	$("#hc-tree-container").empty();
}

function cloneObj(obj){
    var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    } else if(window.JSON){
        str = JSON.stringify(obj),
        newobj = JSON.parse(str);
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ? 
            cloneObj(obj[i]) : obj[i]; 
        }
    }
    return newobj;
};

function print(obj, flag){
	if(flag){
		console.log(obj);
	}
}

(function () {
	window.alert = function (text) {
		text = text.toString().replace(/\\/g, '\\').replace(/\n/g, '<br />').replace(/\r/g, '<br />');

		var alertdiv = 
            '<div id="alert-cover"><div id="alertdiv">' 
            + text 
            + '<br /><input type="submit" name="button" id="alertButton" value="OK" onclick="$(\'#alert-cover\').remove(); " /></div></div>';
		$(document.body).append(alertdiv);

		$("#alertdiv").css({
			"margin-left": $("#alertdiv").width() / 2 * (-1) - 20,
			"margin-top": $("#alertdiv").height() / 2 * (-1) - 20
		});

		$("#alert-cover").show();
	};
})();