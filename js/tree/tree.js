var ta = 1;
var tb = 3;
var to = 1.5;
var chooseRoot = 796

function Tree(childParent, allWeight, leafClassify, leafTaxa, rootIndex, usingOrder, D, rootNum){
	this.childParent = childParent; //2D array
	this.allWeight = allWeight; //array, index is the leaf index
	this.leafClassify = leafClassify; //array, index is the leaf index
	this.leafTaxa = leafTaxa; //array, index is the leaf index
	this.rootIndex = rootIndex; //int
	this.midRoot = rootIndex;
	this.choseRoot = -1;
	this.usingOrder = usingOrder;
	this.layout = 0;//0:H  1:C  2:C-H

	this.leafAmount = this.leafClassify.length;
	this.clusterNum = 0;
	this.maxDepth = 0;
	this.leafIndex = 0;

	this.threshhold = 0.8;
	this.reverseOrderPercent = 0.13;

	this.treeStructure = new Array();//array nodeIndex->node, start from 1
	this.treeStructureBackup;//array nodeIndex->node, start from 1
	this.rootNode = "";
	this.rootNodeBackup;
	this.changedNodes = new Array();
	this.swapIndex = new Array();
	this.reverseList = new Array();
	this.inOrderList_temp = new Array();
	this.inOrderList = new Array();
	this.subSequence = new Array();
	this.finalReverseList = new Array();
	// this.reverseIndex = new Array();
	this.currentLeafOrder = new Array();
	this.nodeCoordinates = new Array();
	this.nodeOffsets = new Array();

	this.maxWeight = 0;
	this.maxLeafNumRatio = 0;
	this.leafRatios = [];

	this.bindLeaves = new Array();
	this.fixedLeaves = new Array();

	this.D = D;
	this.leafSeqBackup = new Array();
	this.leafDiff = new Array();
	this.leafPeakValley = new Array();
	this.threshholdT = ta;//2, 100 for cucumberv
	console.log("ta was: "+ ta);
	//this.threshholdT = 100;
	this.outlierT = to;//2, 1.5 for cucumber
	console.log("to was: "+ to);
	//this.outlierT = 1.5;//6.227985以上，将只分出2个聚类
	this.outlierSeqLen = 3;//5, 3 for cucumber
	this.peakValleyT = tb;//3.6 for cucumber
	console.log("tb was: "+ tb);
	//this.peakValleyT = 0.1;
	this.selectRoot = rootNum;//1283, 141, 133 for cucumber

	this.outlierNodes = new Array();

	this.treeUtil = new TreeUtil();//tree util that deal with some normal operations on trees

	this.distilledRoot = "";
	this.distilledTreeStructure = new Array();
	this.maxDistillDepth = 0;
	distillIdx = 0;

	// console.log("finish initialising tree");

	//for test
	this.tmpPeakValley = new Array();
	this.highLightFirstStep = new Array();
	this.clusterBoundary = new Array();
}

Tree.prototype.setLayout = function(l){
	this.layout = l;
}

Tree.prototype.init = function(usingLabel){
	if(this.choseRoot === -1){
		//init all nodes including root
		this.rootNode = new Node(this.rootIndex);
		this.treeStructure[this.rootIndex] = this.rootNode;

		for(var i = 0; i < this.childParent.length; i++){
			var tmpNode = new Node(this.childParent[i][0]);
			this.treeStructure[this.childParent[i][0]] = tmpNode;
		}

		//init all branches
		var midDistance = 15;
		// let testArr = new Array();
		for(var i = 0; i < this.childParent.length; i++){
			var childIndex = this.childParent[i][0];
			var parentIndex = this.childParent[i][1];
			if(childIndex <= this.leafAmount){
				this.treeStructure[childIndex].leafNum = 1;
			}
			//parent->child
			if(this.treeStructure[parentIndex].leftChild == ""){
				this.treeStructure[parentIndex].leftChild = this.treeStructure[childIndex];
			} else {
				this.treeStructure[parentIndex].rightChild = this.treeStructure[childIndex];
				this.treeStructure[parentIndex].leafNum = this.treeStructure[parentIndex].leftChild.leafNum + this.treeStructure[parentIndex].rightChild.leafNum;
				// testArr.push(Math.abs(this.treeStructure[parentIndex].leafNum - this.leafAmount/2));
				if(Math.abs(this.treeStructure[parentIndex].leafNum - this.leafAmount/2) < midDistance){
					this.midRoot = parentIndex;
					midDistance = Math.abs(this.treeStructure[parentIndex].leafNum - this.leafAmount/2);
				}
			}
			//child->parent
			this.treeStructure[childIndex].ancestor = this.treeStructure[parentIndex];
		}
	// 	var nodesToFix = new Array();
	// 	for(var i = 0, len = this.fixedLeaves.length; i < len; i++){
	// 		this.fixTreeNode(this.treeStructure[parseInt(this.fixedLeaves[i])], nodesToFix);
	// 	}
	// 	//test fix tree node
	// 	//var nodesToFix = new Array();
	// 	//this.fixTreeNode(this.treeStructure[7], nodesToFix);
	// 	// console.log("nodes need to be fixed:");
	// 	// console.log(nodesToFix);
	// 	//end test fix tree node


	// 	//assign weights for all nodes and classify for leaves
	// 	for(var i = 0; i < this.allWeight.length; i++){
	// 		//test fix tree node
	// 		if(nodesToFix.indexOf(this.treeStructure[i+1].index)>-1){
	// 			this.treeStructure[i+1].fixed = true;
	// 		}
	// 		// console.log(i+1 + " fix: " + this.treeStructure[i+1].fixed);
	// 		//end test fix tree node

	// 		if(i < this.leafClassify.length){
	// 			if(usingLabel){
	// 				this.treeStructure[i+1].weight = this.allWeight[i] + this.leafClassify[i]*100;
	// 			}else{
	// 				this.treeStructure[i+1].weight = this.allWeight[i];
	// 			}

	// 			//twisting two points together
	// 			if(this.bindLeaves.indexOf(i+1+"") > -1){
	// 				this.treeStructure[i+1].weight = this.allWeight[i] + 30000;
	// 				this.threshhold = 10000.01;
	// 			}
	// 			//end twisting two points together
	// 			// console.log(this.bindLeaves);
	// 			// console.log(i+1 + "  " +  this.treeStructure[i+1].weight);

	// 			this.treeStructure[i+1].oriWeight = this.allWeight[i];
	// 			this.treeStructure[i+1].classify = this.leafClassify[i];
	// 			this.treeStructure[i+1].taxa = this.leafTaxa[i];
	// 			if(this.leafClassify[i] > this.clusterNum){
	// 				this.clusterNum = this.leafClassify[i];
	// 			}
	// 		} else {
	// 			this.treeStructure[i+1].weight = this.allWeight[i];
	// 			this.treeStructure[i+1].oriWeight = this.allWeight[i];
	// 		}
	// 		// console.log(this.treeStructure[i+1].index + " weight: " + this.treeStructure[i+1].weight);
	// 	}
	// }
		//assign weights for all nodes and classify for leaves
		for(var i = 0; i < this.allWeight.length; i++){
			if(i < this.leafClassify.length){
				this.treeStructure[i+1].weight = this.allWeight[i];//*this.allWeight[i]*this.allWeight[i]/2;
				this.treeStructure[i+1].allLeaves.push(this.treeStructure[i+1].index);
				this.treeStructure[i+1].varience = this.treeStructure[i+1].weight;

				this.treeStructure[i+1].oriWeight = this.allWeight[i];//*this.allWeight[i]*this.allWeight[i]/2;
				this.treeStructure[i+1].classify = this.leafClassify[i];
				this.treeStructure[i+1].taxa = this.leafTaxa[i];
				if(this.leafClassify[i] > this.clusterNum){
					this.clusterNum = this.leafClassify[i];
				}
			} else {
				this.treeStructure[i+1].weight = this.allWeight[i];
				this.treeStructure[i+1].oriWeight = this.allWeight[i];
			}
		}
	}

	//center root
	if(rooting == 0){
        var r = this.selectRoot;//for compound 653/736
        // var r = 653;//for compound 653/736 679
		var leftIndex = this.rootNode.leftChild.index;
		var rightIndex = this.rootNode.rightChild.index;
		this.rootNode.leftChild.ancestor = this.rootNode.rightChild;
		this.rootNode.rightChild.ancestor = this.rootNode.leftChild;
		this.rootNode.leftChild = "";
		this.rootNode.rightChild = "";
		this.changedNodes = [];
		this.changedNodes.push(this.treeStructure[r].ancestor);
		this.createBinaryTree(this.treeStructure[r], leftIndex, rightIndex);

		this.rootNode.leftChild = this.treeStructure[r];
		this.rootNode.rightChild = this.treeStructure[r].ancestor;
		this.treeStructure[r].ancestor.ancestor = this.rootNode;
		this.treeStructure[r].ancestor = this.rootNode;
	}
// console.log(this.treeStructure);debugger
	//add the weights of the ancestors to their descendants
	let maxLeafWeight = 0;
	for (var i = 1; i <= this.leafAmount; i++){
		var ancestors = new Array();
		this.treeUtil.findAncestors(this.treeStructure[i], ancestors, this.rootIndex);

		for (var j = 0; j < ancestors.length; j++){
			if(this.bindLeaves.indexOf(i+"") < 0){
				this.treeStructure[i].weight += ancestors[j].weight;
			}
		}
		
		if(this.treeStructure[i].weight > maxLeafWeight){
			maxLeafWeight = this.treeStructure[i].weight;
		}
	}

	//if using label, change threshold
	//according to the biggest weight
	let maxLeafWeightStr = "" + maxLeafWeight;
	let numberLength = 0;
	// console.log("max leaf weight: " + maxLeafWeightStr);
	if(maxLeafWeight < 1){//0.xxx | 0.0...0xxx
		let tmp = maxLeafWeightStr.split(".")[1];
		let recorder = 0;
		for(let i = 0; i < tmp.length; i++){
			if(tmp.substring(i, i+1) != "0"){
				recorder = -(i+2);
				break;
			}
		}
		numberLength = recorder;
	}else if(maxLeafWeight >= 1 && maxLeafWeight < 10){//1.xxx - 9.xxx
		numberLength = -1;
	}else{//x...x.xxx
		numberLength = maxLeafWeightStr.split(".")[0].length - 2;
	}
	if(usingLabel && this.bindLeaves.length == 0) {
		// this.threshhold = orderThreshHold;
		this.threshhold = Math.pow(10, numberLength)/this.threshholdT;
		console.log(numberLength + "this.threshhold " +this.threshhold);
	}
}

/**
 * input is an unrooted binary tree, take the chosen node as the root node and build a binary tree
 */
Tree.prototype.createBinaryTree = function(t, left_index, right_index){
	 if((t.index == left_index || t.index == right_index)){
		console.log(1111);
		 for(var i = 0; i < this.changedNodes.length-1; i++){
			 this.changedNodes[i+1].ancestor = this.changedNodes[i];
		 }
		 return;
	 }
	 if(t.ancestor.ancestor != "" && t.ancestor.leftChild == t){
		 t.ancestor.leftChild = t.ancestor.ancestor;
		 t.ancestor.leftChild.weight = t.ancestor.weight;
		 t.ancestor.leftChild.oriWeight = t.ancestor.oriWeight;
		 this.changedNodes.push(t.ancestor.leftChild);
		 this.createBinaryTree(t.ancestor, left_index, right_index);
	 } else if (t.ancestor.ancestor != "" && t.ancestor.rightChild == t){
		 t.ancestor.rightChild = t.ancestor.ancestor;
		 t.ancestor.rightChild.weight = t.ancestor.weight;
		 t.ancestor.rightChild.oriWeight = t.ancestor.oriWeight;
		 this.changedNodes.push(t.ancestor.rightChild);
		 this.createBinaryTree(t.ancestor, left_index, right_index);
	 }
}

/*
 * depth-first tracersal method to assign weight and cluster for each internal node
 */
Tree.prototype.assignInternalWeights = function(t){
	if (t.rightChild != "") {
		this.assignInternalWeights(t.rightChild);
	}
	if (t.leftChild != "") {
		this.assignInternalWeights(t.leftChild);
	}
	if (t.leftChild != "" && t.rightChild != ""){
		//t.weight = (t.rightChild.weight + t.leftChild.weight) / 2;
		t.weight = Math.max(t.rightChild.weight , t.leftChild.weight);
		t.classify = (t.rightChild.classify + t.leftChild.classify) / 2;

		t.allLeaves = cloneObj(t.leftChild.allLeaves);
		t.allLeaves = t.allLeaves.concat(cloneObj(t.rightChild.allLeaves));
	}
}

/*
 * inOrder sort, reduce the inversion amount
 */
Tree.prototype.inOrderSort = function(inputRoot){
	if (inputRoot.leftChild != "" && inputRoot.rightChild != ""){
		if (inputRoot.leftChild.weight > inputRoot.rightChild.weight && !inputRoot.leftChild.fixed /*&& inputRoot.leftChild.varience > inputRoot.rightChild.varience*/){
			// console.log("swap");
			var swapNode = inputRoot.rightChild;
			inputRoot.rightChild = inputRoot.leftChild;
			inputRoot.leftChild = swapNode;
			this.swapIndex.push(inputRoot.index);
		}
		this.inOrderSort(inputRoot.leftChild);
		this.inOrderSort(inputRoot.rightChild);
	}
}

Tree.prototype.inorderListTemp = function(t){
	if (t != ""){
		this.inorderListTemp(t.leftChild);
		if (this.treeUtil.isLeaf(t)){
			this.inOrderList_temp.push(t);
		}
		this.inorderListTemp(t.rightChild);
	}
}

Tree.prototype.checkInorderListTemp = function(){
	for (var i = 0; i < this.inOrderList_temp.length - 1; i++){
		if (this.inOrderList_temp[i].weight < this.inOrderList_temp[i + 1].weight || 
			(Math.abs(this.inOrderList_temp[i + 1].weight - this.inOrderList_temp[i].weight) <= this.threshhold)) {
			continue;
		} else {
			return false;
		}
	}
	return true;
}

Tree.prototype.inorderTree = function(t){
	this.inOrderList_temp = [];
	this.inorderListTemp(t);

	if (this.checkInorderListTemp()){
		this.inOrderList.push(t);
		return;
	}
	if (t.leftChild != ""){
		this.inOrderList_temp = [];
		this.inorderListTemp(t.leftChild);

		if (this.checkInorderListTemp()){
			this.inOrderList.push(t.leftChild);
		} else {
			this.inorderTree(t.leftChild);
		}
	}
	if (t.rightChild != ""){
		this.inOrderList_temp = [];
		this.inorderListTemp(t.rightChild);
		
		if (this.checkInorderListTemp()){
			this.inOrderList.push(t.rightChild);
		} else {
			this.inorderTree(t.rightChild);
		}
	}
}

/*
 * create a graph using selected nodes and find a shortest path
 */
Tree.prototype.finalReverse = function(stList){
	let orderList = new Array();
	let reverseOrderList = new Array();

	for (let i = 0; i < stList.length; i++){
		let currentNode = stList[i];
		let leftLeafNode;
		let rightLeafNode;
		if (!this.treeUtil.isLeaf(currentNode)){
			leftLeafNode = this.treeUtil.findLeafNode(currentNode, 0);
			rightLeafNode = this.treeUtil.findLeafNode(currentNode, 1);
		} else {
			leftLeafNode = currentNode;
			rightLeafNode = currentNode;
		}

		let ol = new Array();
		ol.push(leftLeafNode);
		ol.push(rightLeafNode);
		orderList.push(ol);

		let rol = new Array();
		rol.push(rightLeafNode);
		rol.push(leftLeafNode);
		reverseOrderList.push(rol);
	}

	//first choose a head to start from order list and reverse order list
	//compare the first two of order list and reverse order list
	let iterater;
	if (orderList.length >= 2){
		let minDistance = 0;

		let diffOrder1 = Math.abs(orderList[1][0].weight - orderList[0][1].weight);
		let diffOrder2 = Math.abs(reverseOrderList[1][0].weight - orderList[0][1].weight);
		// let DOrder1 = this.D[orderList[1][0].index-1][orderList[0][1].index-1];
		// let DOrder2 = this.D[reverseOrderList[1][0].index-1][orderList[0][1].index-1];
		minDistance = diffOrder1 < diffOrder2 ? diffOrder1 : diffOrder2;
		// minD = DOrder1 < DOrder2 ? DOrder1 : DOrder2;
		iterater = orderList[0][1];
		let diffReverseOrder1 = Math.abs(orderList[1][0].weight - reverseOrderList[0][1].weight);
		let diffReverseOrder2 = Math.abs(reverseOrderList[1][0].weight - reverseOrderList[0][1].weight);
		// let DReverseOrder1 = this.D[orderList[1][0].index-1][reverseOrderList[0][1].index-1];
		// let DReverseOrder2 = this.D[reverseOrderList[1][0].index-1][reverseOrderList[0][1].index-1];
		if (diffReverseOrder1 < minDistance || diffReverseOrder2 < minDistance){
		// if (DReverseOrder1 < minD || DReverseOrder2 < minD){
			iterater = reverseOrderList[0][1];
			this.finalReverseList.push(stList[0]);
		}
	}

	for (let i = 1; i < orderList.length; i++){
		let diffOrder = Math.abs(orderList[i][0].weight - iterater.weight);
		let diffReverseOrder = Math.abs(reverseOrderList[i][0].weight - iterater.weight);
		let DOrder = this.D[orderList[i][0].index-1][iterater.index-1];
		let DReverseOrder = this.D[reverseOrderList[i][0].index-1][iterater.index-1];

		// if (diffOrder <= diffReverseOrder){//choose the one in order list
		if (DOrder <= DReverseOrder && diffOrder < this.threshhold){//choose the one in order list
			iterater = orderList[i][1];
		// } else if ((diffOrder > diffReverseOrder) || (iterater.classify == reverseOrderList[i][0].classify && iterater.classify != orderList[i][0].classify)){
		} else if ((DOrder > DReverseOrder && diffReverseOrder < this.threshhold) || (iterater.classify == reverseOrderList[i][0].classify && iterater.classify != orderList[i][0].classify)){
			iterater = reverseOrderList[i][1];
			this.finalReverseList.push(stList[i]);
		}
	}

	for (let i = 0; i < this.finalReverseList.length; i++){
		this.treeUtil.reverseSubTree(this.finalReverseList[i]);
	}

	//prepare for the next iteration
	let tmpStList = new Array();
	let skipList = new Array();
	for(let i = 0; i < stList.length; i++){
		if(skipList.indexOf(stList[i].index) < 0){
			let hasBrother = false;
			for(let j = 0; j < stList.length; j++){
				if(stList[i].ancestor.index == stList[j].ancestor.index && i != j){//i and j are brothers
					hasBrother = true;
					tmpStList.push(stList[i].ancestor);
					skipList.push(stList[i].index);
					skipList.push(stList[j].index);
				}
			}
			if(!hasBrother){
				tmpStList.push(stList[i]);
			}
		}
	}
	// console.log(stList);
	if(tmpStList.length == stList.length){
		return;
	}else{
		// console.log("iterative reverse");
		this.finalReverseList = [];
		this.finalReverse(tmpStList);
	}

}

/**
 * compute the distance from the leaf to the root, and record the max
 */
Tree.prototype.accumulateWeight = function(r){
	if(r.index != this.rootIndex){
		r.weightToRoot += r.ancestor.weightToRoot + r.oriWeight;
		if(this.maxWeight < r.weightToRoot){
			this.maxWeight = r.weightToRoot;
		}
	}else{
		r.weightToRoot = r.oriWeight;
		this.maxWeight = r.weightToRoot;
	}
	if (r.rightChild != "" && r.leftChild != "") {
		this.accumulateWeight(r.rightChild);
		this.accumulateWeight(r.leftChild);
	}
}

/**
 * assign Y for the nodes
 */
Tree.prototype.assignY = function(t, padding_top){
	if (t.rightChild != "" && typeof t.rightChild != "undefined") {
		this.assignY(t.rightChild, padding_top);
	}
	if (t.leftChild != "" && typeof t.leftChild != "undefined") {
		this.assignY(t.leftChild, padding_top);
	}
	if (t.leftChild != "" && typeof t.rightChild != "undefined" && t.rightChild != "" && typeof t.leftChild != "undefined"){
		t.y = ((t.rightChild.y-padding_top) + (t.leftChild.y-padding_top)) / 2 + padding_top;
	}
}

/**
 * assign X for the nodes
 */
Tree.prototype.assignX = function(t, padding_left){
	if(t.ancestor != ""){
		t.x = t.ancestor.x + (t.oriWeight/this.maxWeight)*(treeContainerWidth-paddingWidth*2);
		if(t.index <= this.leafAmount){
			currentDataSet[t.index-1].treeX = t.x;
			if(clusterDistance.get(parseInt(t.classify)) == null || typeof(clusterDistance.get(parseInt(t.classify))) == "undefined"){
				let obj = {};
				obj.min = t.x;
				obj.max = t.x;
				clusterDistance.set(parseInt(t.classify), obj);
			}else{
				let obj = clusterDistance.get(parseInt(t.classify));
				if(t.x < obj.min){
					obj.min = t.x;
				}
				if(t.x > obj.max){
					obj.max = t.x;
				}
			}
		}
	} else {//root
		if(this.usingOrder){
			t.x = padding_left+30;
		}else{
			t.x = padding_left;
		}
	}

	if(t.leftChild != "" && t.rightChild != ""){
		this.assignX(t.leftChild, padding_left);
		this.assignX(t.rightChild, padding_left);
	}
}

Tree.prototype.assignPosition = function(){
	let cost = 0, cost1 = 0, cost2 = 0;
	let extraPaddingHeight;
	if(!this.usingOrder){
		extraPaddingHeight = 100;
	}else{
		extraPaddingHeight = 20;
	}
	if (this.layout != 3) {
		//assign positions for the nodes
		var unitHeight = (height-paddingHeight)/this.leafAmount;
		gridiantRadius = unitHeight*2;
		for(var i = 0; i < this.currentLeafOrder.length; i++){
			this.treeStructure[this.currentLeafOrder[i]].y = extraPaddingHeight + (i+1) * unitHeight - unitHeight/2;
			if(typeof this.rootNodeBackup != "undefined"){
				this.treeUtil.treeStructure[this.currentLeafOrder[i]].y = extraPaddingHeight + (i+1) * unitHeight - unitHeight/2;
			}else{
				this.treeStructure[this.currentLeafOrder[i]].y = extraPaddingHeight + (i+1) * unitHeight - unitHeight/2;
			}

		}
		this.treeStructureBackup = this.treeUtil.treeStructure;
		if(typeof this.rootNodeBackup != "undefined"){
			//internal nodes
			this.assignY(this.rootNodeBackup, paddingHeight/2);
			//assign X
			this.assignX(this.rootNodeBackup, 30);
		}else{
			//internal nodes
			this.assignY(this.rootNode, paddingHeight/2);
			//assign X
			this.assignX(this.rootNode, 30);
		}
	} 
}

/**
 * generate and reorder the tree
 */
Tree.prototype.finalTree = function(use_order, use_label, layout, treeType){
	this.setLayout(layout);
	if(!use_order && !use_label){
		this.init(use_label);
		this.assignInternalWeights(this.rootNode);
		this.accumulateWeight(this.rootNode);
		this.currentLeafOrder = this.treeUtil.getLeafOrder(this.rootNode);
		this.assignPosition();
	} else {
		this.init(use_label);
		this.assignInternalWeights(this.rootNode);
		this.accumulateWeight(this.rootNode);
		this.inOrderSort(this.rootNode);
		// this.reverseSingleBranches(this.rootNode);
		this.inorderTree(this.rootNode);
		// this.finalReverse(this.inOrderList);
		// this.reverseSingleBranches(this.rootNode);

		this.rootNodeBackup = this.treeUtil.cloneTree(this.rootNode);
		// console.log(this.rootNodeBackup);
		this.cutTree();
		this.prepareTreeForOLO(this.rootNode);
		let njfastolo = new CDPOLO(this.rootNode, this.treeStructure, this.D);
		//console.log(this);
		// console.time("nj fastolo time: ");
		njfastolo.optimalOrder();
		// console.timeEnd("nj fastolo time: ");
		let njOLOfastOrder = njfastolo.leafOrder.split(",");
		for(let i = 0; i < njOLOfastOrder.length; i++){
			njOLOfastOrder[i] = parseInt(njOLOfastOrder[i])+1;
		}
		this.resetNJTree(this.rootNode);
		this.reconstructOurOrder(njOLOfastOrder);


		//test print distance matrix generated from the tree structure
		let tmpDisM = new Array();
		for(let i = 0; i < this.currentLeafOrder.length; i++){
			tmpDisM[i] = new Array();
		}
		let maxTij = 0;
		let maxD = 0;
		for(let i = 0, len = this.currentLeafOrder.length; i < len; i++){
			//find LCA of node i
			let iAnces = new Array();
			this.findAllAncestors(this.treeStructure[i+1], iAnces);

			for(let j = 0; j < len; j++){
				//find LCA of node i and node j
				let jAnces = new Array();
				this.findAllAncestors(this.treeStructure[j+1], jAnces);
				let LCA = this.findLCA(iAnces, jAnces);
				let tij = this.minDisOnTree(i+1, j+1, this.cloneObj(iAnces), this.cloneObj(jAnces), iAnces.indexOf(LCA));
				tmpDisM[i][j] = tij;
				if(tij > maxTij){
					maxTij = tij;
				}
				if(this.D[i][j] > maxD){
					maxD = this.D[i][j];
				}
			}
		}

		let tmpD = this.cloneObj(this.D);
		//unify the matrix
		for(let i = 0, len = this.currentLeafOrder.length; i < len; i++){
			for(let j = 0; j < len; j++){	
				tmpDisM[i][j] /= maxTij;
				tmpD[i][j] /= maxD;
			}
		}
		let sum = 0;
		for(let i = 0, len = this.currentLeafOrder.length; i < len; i++){
			for(let j = 0; j < len; j++){	
				sum += (tmpDisM[i][j] - tmpD[i][j]) * (tmpDisM[i][j] - tmpD[i][j]);
			}
		}
		// console.log("NJ distance difference is: " + sum);
		//end test

		// console.log(this.currentLeafOrder);
		let clusterSeq = this.buildNewHierarchy(this.currentLeafOrder, this.outlierT);
		 console.log(clusterSeq);
		this.peakAnalysis(clusterSeq.clusters, clusterSeq.avgWeight, clusterSeq.outlierThreshold, this.peakValleyT);
		
		this.assignPosition();


		//generate distilled cluster tree
		this.generateDistilledHierarchy();
	}
}

Tree.prototype.cloneObj = function(obj){
	var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ? 
            this.cloneObj(obj[i]) : obj[i]; 
        }
    }
    return newobj;
}

Tree.prototype.minDisOnTree = function(leafi, leafj, iAnces, jAnces, LCAIndex){
	if(leafi == leafj){
		return 0;
	}
	iAnces.push(leafi);
	jAnces.push(leafj);
	let sum = 0;
	for(let i = LCAIndex+1; i < iAnces.length; i++){
		let nodeIndex = iAnces[i];
		sum += this.treeStructure[nodeIndex].oriWeight;
	}
	for(let i = LCAIndex+1; i < jAnces.length; i++){
		let nodeIndex = jAnces[i];
		sum += this.treeStructure[nodeIndex].oriWeight;	
	}
	return sum;
}

Tree.prototype.findAllAncestors = function(t, arr){
	if (t.index != this.rootIndex){
		this.findAllAncestors(t.ancestor, arr);
		arr.push(t.ancestor.index);
	}
}

Tree.prototype.findLCA = function(iAnces, jAnces){
	let len = iAnces.length < jAnces.length ? iAnces.length : jAnces.length;
	for(let i = 0; i < len; i ++){
		if(i == len-1 || iAnces[i+1] != jAnces[i+1]){
			return iAnces[i];
		}
	}
}

Tree.prototype.buildNewHierarchy = function(leafOrder, tmpT){
	let clusters = new Array();
	let leavesDiff = new Array();

	let sumDiff = 0;
	let sumWeight = 0;
	let maxDiff = 0;
	let tmpIdx = 0;
	let diffRecord = new Array();
	for(let i = 0; i < leafOrder.length-1; i++){
		let tmpDiff = Math.abs(this.treeStructure[leafOrder[i]].weight - this.treeStructure[leafOrder[i+1]].weight);
		sumWeight += this.treeStructure[leafOrder[i]].weight;

		sumDiff += tmpDiff;
		leavesDiff.push({"leaf1":leafOrder[i],"leaf2":leafOrder[i+1],"diff":tmpDiff});
		diffRecord.push(tmpDiff);
	}
	sumWeight += this.treeStructure[leafOrder[leafOrder.length-1]].weight;
	let avgDiff = sumDiff / (leafOrder.length-1);
	let avgWeight = sumWeight / (leafOrder.length-1);
	diffRecord.sort(function(a,b){
		return a-b;
	});
	let Q1 = diffRecord[parseInt(diffRecord.length/4)];
	let Q3 = diffRecord[parseInt(3*diffRecord.length/4)];
	let IQR = Q3-Q1;
	let outlierThreshold = Q3 + this.outlierT*IQR;

	for(let j = 0; j < leavesDiff.length; j++){
		// if(leavesDiff[j].diff > tmpT*avgDiff){
		if(leavesDiff[j].diff > outlierThreshold){
			let tmpArr = leafOrder.slice(tmpIdx, j+1);
			tmpIdx = j+1;
			clusters.push(tmpArr);
		}
	}
	let tmpArr = leafOrder.slice(tmpIdx, leafOrder.length);
	
	clusters.push(tmpArr);
	
	return {"avgWeight":avgDiff,"outlierThreshold":outlierThreshold,"clusters":clusters};
}

Tree.prototype.peakAnalysis = function(clusters, avgD, outlierThreshold, T){
	let smoothSeq = new Array();
	let peakValleySeq = new Array();
	let concatingOutlier = false;
	for(let i = 0; i < clusters.length; i++){
		if(clusters[i].length <= this.outlierSeqLen/* && !concatingOutlier*/){
			this.outlierNodes = this.outlierNodes.concat(clusters[i]);
			concatingOutlier = true;
		}else if(clusters[i].length > this.outlierSeqLen && concatingOutlier){//combine longer sequences
			if(smoothSeq.length == 0){//there are no sequence yet
				smoothSeq.push(clusters[i]);
			}else{
				//cal ARD of the boundary of two clusters
				let tmpSmoothSeq = smoothSeq[smoothSeq.length-1];
				let tmpArd = Math.abs(this.treeStructure[tmpSmoothSeq[tmpSmoothSeq.length-1]].weight-this.treeStructure[clusters[i][0]].weight);
				if(tmpArd >= outlierThreshold){
					smoothSeq.push(clusters[i]);
				}else{
					smoothSeq[smoothSeq.length-1] = smoothSeq[smoothSeq.length-1].concat(clusters[i]);	
				}
			}
			concatingOutlier = false;
		}else if(clusters[i].length > this.outlierSeqLen && !concatingOutlier){
			smoothSeq.push(clusters[i]);
		}
	}
	console.log("outliers: ");
	console.log(this.outlierNodes);

	console.log("smooth seq: ");
	console.log(smoothSeq);

	for(let i = 0, len = smoothSeq.length; i < len; i++){
		this.highLightFirstStep.push(smoothSeq[i][0]);
		let tmpRVRecorder = new Array();
		tmpRVRecorder.push({"index":this.currentLeafOrder.indexOf(smoothSeq[i][0]),"leafId":smoothSeq[i][0],"weight":this.treeStructure[smoothSeq[i][0]].weight,"peakValley":"end","del":false});
		
		//seaking peak and valley
		for(let j = 1, len2 = smoothSeq[i].length-1; j < len2; j++){
			let weight1 = this.treeStructure[smoothSeq[i][j-1]].weight;
			let currentWeight = this.treeStructure[smoothSeq[i][j]].weight;
			let weight2 = this.treeStructure[smoothSeq[i][j+1]].weight;	
			if(weight1 < currentWeight && weight2 < currentWeight){
				tmpRVRecorder.push({"index":this.currentLeafOrder.indexOf(smoothSeq[i][j]),"leafId":smoothSeq[i][j],"weight":currentWeight,"peakValley":"peak","del":false});
			}else if(weight1 >= currentWeight && weight2 >= currentWeight){
				tmpRVRecorder.push({"index":this.currentLeafOrder.indexOf(smoothSeq[i][j]),"leafId":smoothSeq[i][j],"weight":currentWeight,"peakValley":"valley","del":false});
			}			
		}
		

		tmpRVRecorder.push({"index":this.currentLeafOrder.indexOf(smoothSeq[i][smoothSeq[i].length-1]),"leafId":smoothSeq[i][smoothSeq[i].length-1],"weight":this.treeStructure[smoothSeq[i][smoothSeq[i].length-1]].weight,"peakValley":"end","del":false});
		peakValleySeq.push(tmpRVRecorder);
	}


	this.leafPeakValley = new Array();
	for(let i = 0; i < peakValleySeq.length; i++){
		// let tmpLeafPVLen = this.leafPeakValley.length;

		let tmpSumD = 0;
		for(let j = 0, len = smoothSeq[i].length-1; j < len; j++){
			let tmpDiff = Math.abs(this.treeStructure[smoothSeq[i][j]].weight - this.treeStructure[smoothSeq[i][j+1]].weight);	
			tmpSumD += tmpDiff;
		}
		let tmpAvgD = tmpSumD/smoothSeq[i].length;
		this.cleanSeq(peakValleySeq[i], tmpAvgD, T);

		// let keepNum = this.leafPeakValley.length - tmpLeafPVLen;
	}

	// this.cleanSeq(peakValleySeq, avgD, T);
	
	//filter peak and valley nodes
	let sqrAvgT = 0;
	for(let i = 0; i < this.leafPeakValley.length;){
		if(this.leafPeakValley[i].peakValley == "end"){
			this.leafPeakValley[i].del = true;
			this.leafPeakValley.splice(i,1);
		}else{
			let tmpLeafIdx = this.leafPeakValley[i].index;
			let tmpRecord = new Array();
			let sum = 0;
			for(let j = tmpLeafIdx-2; j < tmpLeafIdx+2; j++){
				if(typeof this.treeStructure[this.currentLeafOrder[j]] == "undefined"){
					continue;
				}else{
					tmpRecord.push(this.treeStructure[this.currentLeafOrder[j]].weight);
					sum += this.treeStructure[this.currentLeafOrder[j]].weight;
				}
			}

			let avg = sum / tmpRecord.length;
			// console.log("avg: " + avg);
			let sqrSum = 0;
			for(let j = 0; j < tmpRecord.length; j++){
				sqrSum += (tmpRecord[j] - avg)*(tmpRecord[j] - avg);
			}
			this.leafPeakValley[i].sqrAvg = sqrSum / tmpRecord.length;
			if(this.leafPeakValley[i].sqrAvg > sqrAvgT){
				sqrAvgT = this.leafPeakValley[i].sqrAvg;
			}
			i++;
		}
	}
	sqrAvgT /= 10;

	this.leafPeakValley.sort(function(a,b){
		return b.sqrAvg - a.sqrAvg;
	})

	// for(let i = 0; i < this.leafPeakValley.length; i++){
	// 	if(this.leafPeakValley[i].sqrAvg < sqrAvgT){
	// 		console.log("from " + i);
	// 		this.leafPeakValley.splice(i, this.leafPeakValley.length - i);
	// 		break;
	// 	}
	// }
	let keepNodes = Math.ceil(this.leafPeakValley.length/10);
	this.leafPeakValley.splice(keepNodes, this.leafPeakValley.length - keepNodes + 1);
	// console.log("peak & valley");
	// console.log(this.leafPeakValley);

	//find least common ancestor
	let commonAncestors = new Array();
	for(let i = 0; i < this.leafPeakValley.length; i++){
		let tmpIdx = this.leafPeakValley[i].index;
		let tmpStart = tmpIdx-2 < 0 ? 0 : tmpIdx-2;
		let tmpEnd = tmpIdx+2 > this.currentLeafOrder.length-1 ? this.currentLeafOrder.length-1 : tmpIdx+2;
		//find ancestors
		let startAncestors = new Array();
		this.treeUtil.findAncestors(this.treeStructure[this.currentLeafOrder[tmpStart]], startAncestors, this.rootNode.index);
		let endAncestors = new Array();
		this.treeUtil.findAncestors(this.treeStructure[this.currentLeafOrder[tmpEnd]], endAncestors, this.rootNode.index);
		let len = startAncestors.length > endAncestors.length ? endAncestors.length : startAncestors.length;

		let tmpCommonAncestor;
		let tmpCommonAncestorDepth = 0;
		for(let i = 0; i < len; i++){
			if(startAncestors[i].index != endAncestors[i].index){
				tmpCommonAncestor = startAncestors[i-1];
				break;
			}
			tmpCommonAncestorDepth++;
		}
		commonAncestors.push({"leafId":this.leafPeakValley[i].leafId,"peakValley":this.leafPeakValley[i].peakValley,"ancestor":tmpCommonAncestor,"depth":tmpCommonAncestorDepth});
	}
}

Tree.prototype.cleanSeq = function(arr, avgD, T){
	let deleted = false;
	for(let i = 1, len = arr.length-1; i < len; i++){
		if(arr[i].del){continue;}//current peak or valley node has been already deleted;

		//using weihgt difference
		let currentIndex = arr[i].leafId;
		let lastIndex = arr[0].leafId;
		for(let j = i-1; j > 0; j--){
			if(!arr[j].del){
				lastIndex = arr[j].leafId;
				break;
			}
		}
		let nextIndex = arr[arr.length-1].leafId;
		for(let j = i+1, len2 = arr.length; j < len2; j++){
			if(!arr[j].del){
				nextIndex = arr[j].leafId;
				break;
			}
		}
		let idxDiff1 = Math.abs(this.treeStructure[currentIndex].weight - this.treeStructure[lastIndex].weight);
		let idxDiff2 = Math.abs(this.treeStructure[nextIndex].weight - this.treeStructure[currentIndex].weight);

		this.tmpPeakValley.push(idxDiff1>idxDiff2?nextIndex:lastIndex);
		if((idxDiff1 < idxDiff2 && idxDiff1 < T*avgD) || (idxDiff1 == idxDiff2 && idxDiff1 < T*avgD)){
			// console.log("delete last");
			if(arr[i-1].peakValley != arr[i].peakValley){
				arr[i-1].del = true;
				arr[i].del = true;
				i++;
				deleted = true;
			}
		}else if((idxDiff2 < idxDiff1 && idxDiff2 < T*avgD) || (idxDiff2 == idxDiff1 && idxDiff2 < T*avgD)){
			// console.log("delete next");
			if(arr[i+1].peakValley != arr[i].peakValley){
				arr[i].del = true;
				arr[i+1].del = true;
				i+=2;
				deleted = true;
			}
		}
	}

	let finalChoice = new Array();
	for(let i = 0; i < arr.length; i++){
		if(!arr[i].del){
			finalChoice.push(arr[i]);
		}
	}
	
	if(deleted){
		this.cleanSeq(finalChoice, avgD, T);
	}else{
		// console.log("concating choice: ");
		
		this.leafPeakValley = this.leafPeakValley.concat(finalChoice);
	}
}

Tree.prototype.cutTree = function(){
	// console.log("sequencces from 1st step");
	// console.log(this.inOrderList);
	for(let i = 0, len = this.inOrderList.length; i < len; i++){
		let tmpLeafOrder = this.treeUtil.getLeafOrder(this.inOrderList[i]);
		// console.log(tmpLeafOrder);
		this.leafSeqBackup.push(tmpLeafOrder);

		var leftmostNode = this.treeUtil.findLeafNode(this.inOrderList[i], 0);
		var rightmostNode = this.treeUtil.findLeafNode(this.inOrderList[i], 1);
		if(leftmostNode.index != rightmostNode.index){
			this.inOrderList[i].leftChild = leftmostNode;
			this.inOrderList[i].rightChild = rightmostNode;
			leftmostNode.parent = this.inOrderList[i].index;
			rightmostNode.parent = this.inOrderList[i].index;
		}
	}
}

Tree.prototype.reconstructOurOrder = function(oloResult){
	for(let i = 0, len = this.leafSeqBackup.length; i < len; i++){
		let tmpLeafSeq = this.leafSeqBackup[i];
		let o1 = tmpLeafSeq[0];
		let o2 = tmpLeafSeq[tmpLeafSeq.length-1];
		let index1 = oloResult.indexOf(o1);
		let index2 = oloResult.indexOf(o2);
		if(index1 > index2){
			tmpLeafSeq = tmpLeafSeq.reverse();
			oloResult.splice(index2, 2);
			for(let j = 0; j < tmpLeafSeq.length; j++){
				oloResult.splice(index2+j, 0, tmpLeafSeq[j]);
			}
		}else if(index1 == index2){
			oloResult.splice(index1, 1);
			oloResult.splice(index1, 0, tmpLeafSeq[0]);
		}else{
			oloResult.splice(index1, 2);
			for(let j = 0; j < tmpLeafSeq.length; j++){
				oloResult.splice(index1+j, 0, tmpLeafSeq[j]);
			}
		}
	}
	this.currentLeafOrder = oloResult;
}

Tree.prototype.prepareTreeForOLO = function(t){
	if(t.leftChild != ""){
		this.prepareTreeForOLO(t.leftChild);
		this.prepareTreeForOLO(t.rightChild);
	}else{
		delete t.leftChild;
		delete t.rightChild;
	}
	t.index--;
}

Tree.prototype.resetNJTree = function(t){
	if(typeof t.leftChild != "undefined"){
		this.resetNJTree(t.leftChild);
		this.resetNJTree(t.rightChild);
	}else{
		t.leftChild = "";
		t.rightChild = "";
	}
	t.index++;
}

/**
 * rebuild the tree after choosing the new root
 */
Tree.prototype.rebuild = function(new_root, use_order, use_label, layout){
	this.choseRoot = new_root;
	this.currentLeafOrder = [];
	this.finalTree(use_order, use_label, layout, 0);
}

/**
 * generate the distilled cluster hierarchy
 */
Tree.prototype.generateDistilledHierarchy = function(){
	// console.log("in generating cluster hierarchy!!!!!!!!!");
	// console.log(this.currentLeafOrder);
	// console.log(this.highLightFirstStep);
	// console.log(this.leafPeakValley);
	// console.log(this.outlierNodes);

	//cut the head or tail of the cluster boundaries
	if(this.highLightFirstStep[0] == this.currentLeafOrder[0]){
		this.highLightFirstStep.splice(0,1);
	}
	if(this.highLightFirstStep[this.highLightFirstStep.length-1] == this.currentLeafOrder[this.currentLeafOrder.length-1]){
		this.highLightFirstStep.splice(this.highLightFirstStep.length-1,1);
	}
	this.highLightFirstStep.splice(0,0,this.currentLeafOrder[0]);
	this.highLightFirstStep.splice(this.highLightFirstStep.length,0,this.currentLeafOrder[this.currentLeafOrder.length-1]);
	// console.log(this.highLightFirstStep);
	//filter out outliers from the leaforder
	let tmpLeafOrder = this.cloneObj(this.currentLeafOrder);
	for(let i = 0; i < this.outlierNodes.length; i++){
		tmpLeafOrder.splice(tmpLeafOrder.indexOf(this.outlierNodes[i]),1);
	}
	// console.log(tmpLeafOrder);

	//generate root
	this.distilledRoot = new distilledNode(distillIdx);
	this.distilledRoot.depth = 0;
	this.distilledRoot.leaves = this.cloneObj(this.currentLeafOrder);
	distillIdx++;
	this.distilledTreeStructure[0] = this.distilledRoot;
	//first level hierarchy, outliers are clussified into one big cluster 
	this.distilledRoot.children[0] = new distilledNode(distillIdx);
	this.distilledRoot.children[0].depth = this.distilledRoot.depth+1;
	if(this.distilledRoot.children[0].depth > this.maxDistillDepth){this.maxDistillDepth = this.distilledRoot.children[0].depth;}
	distillIdx++;
	this.distilledRoot.children[0].leaves = this.outlierNodes;
	this.distilledRoot.children[0].ancestor = this.distilledRoot;
	this.distilledTreeStructure[1] = this.distilledRoot.children[0];
	for(let i = 0; i < this.highLightFirstStep.length-1; i++){
		let tmpDistilledNode = new distilledNode(distillIdx);
		this.distilledTreeStructure[distillIdx] = tmpDistilledNode;
		this.distilledRoot.children.push(tmpDistilledNode);
		tmpDistilledNode.ancestor = this.distilledRoot;
		tmpDistilledNode.depth = tmpDistilledNode.ancestor.depth + 1;
		if(tmpDistilledNode.depth > this.maxDistillDepth){this.maxDistillDepth = tmpDistilledNode.depth;}
		tmpDistilledNode.leaves = tmpLeafOrder.slice(
										tmpLeafOrder.indexOf(this.highLightFirstStep[i]),
										tmpLeafOrder.indexOf(this.highLightFirstStep[i+1]));
		distillIdx++;
	}
	this.distilledRoot.children[this.distilledRoot.children.length-1].leaves.push(this.currentLeafOrder[this.currentLeafOrder.length-1]);

	//deeper hierarchy
	//group the peaks and valleys acording to the first level hierarchy
	let groupedPVs = new Array();
	for(let i = 0; i < this.leafPeakValley.length; i++){
		let pvIdx = tmpLeafOrder.indexOf(this.leafPeakValley[i].leafId);
		for(let j = 0; j < this.highLightFirstStep.length-1; j++){
			let tmpIdx1 = tmpLeafOrder.indexOf(this.highLightFirstStep[j]);
			let tmpIdx2 = tmpLeafOrder.indexOf(this.highLightFirstStep[j+1]);
			// console.log(pvIdx + ", " + tmpIdx1 + ", " + tmpIdx2);
			if(pvIdx > tmpIdx1 && pvIdx < tmpIdx2){
				if(typeof groupedPVs[j] == "undefined"){
					groupedPVs[j] = new Array();
				}
				groupedPVs[j].push(this.leafPeakValley[i].leafId);
			}
		}
	}
	// console.log(groupedPVs);

	//create deeper hierarchy based on LCA
	for(let i = 0; i < groupedPVs.length; i++){
		if(typeof groupedPVs[i] != "undefined"){
			let sortedPVs = new Array();
			for(let j = 0; j < groupedPVs[i].length; j++){
				// console.log(this.currentLeafOrder);
				let neighbor1Idx = this.currentLeafOrder.indexOf(groupedPVs[i][j])-4 < 0 ? 0 : this.currentLeafOrder.indexOf(groupedPVs[i][j])-4;
				let neighbor2Idx = this.currentLeafOrder.indexOf(groupedPVs[i][j])+4 > this.currentLeafOrder.length-1 ? this.currentLeafOrder.length-1 : this.currentLeafOrder.indexOf(groupedPVs[i][j])+4;
				// console.log(groupedPVs[i][j] + " + " + neighbor1Idx + " + " + neighbor2Idx);
				let ances1 = new Array();
				this.findAllAncestors(this.treeStructure[this.currentLeafOrder[neighbor1Idx]], ances1);
				let ances2 = new Array();
				this.findAllAncestors(this.treeStructure[this.currentLeafOrder[neighbor2Idx]], ances2);
				let LCA = this.findLCA(ances1, ances2);
				// console.log(neighbor1Idx + " , " + neighbor2Idx + " LCA: " + LCA);
				let LCADepth = this.stepToRoot(this.treeStructure[LCA]);
				// console.log("depth:"+LCADepth);
				let ltreeRleaf = this.treeUtil.findLeafNode(this.treeStructure[LCA].rightChild, 0);
				let ltreeRleafIdx = Math.abs(this.currentLeafOrder.indexOf(ltreeRleaf.index)-this.currentLeafOrder.indexOf(groupedPVs[i][j])) > 5 ? 
										groupedPVs[i][j] : ltreeRleaf.index;
				sortedPVs.push({"pv":groupedPVs[i][j], "LCA":LCA, "LCADepth":LCADepth, "ltrl":ltreeRleafIdx});

			}
			// sortedPVs.sort(function(a,b){
			// 	return b.LCADepth - a.LCADepth;
			// })
			// console.log(sortedPVs);

			let tmpLeafArr = new Array();
			//add the nodes on the first level into the list
			// for(let j = 0; j < this.distilledRoot.children.length; j++){
			// 	currentDeepestNodes.push(this.distilledRoot.children.leaves);
			// }
			for(let j = 0; j < this.distilledRoot.children[i+1].leaves.length; j++){
				let foundPV = false;
				let tmpLeaf = this.distilledRoot.children[i+1].leaves[j];
				for(let m = 0; m < sortedPVs.length; m++){
					// console.log(sortedPVs[m].ltrl + " ---- " + tmpLeaf);
					if(sortedPVs[m].ltrl == tmpLeaf){
						// console.log(tmpLeaf+"in" + sortedPVs[m].LCADepth);
						tmpLeafArr.push({"leafId": tmpLeaf, "LCADepth":sortedPVs[m].LCADepth});
						// console.log(tmpLeafArr);
						foundPV = true;
						break;
					}
				}
				if(!foundPV){
					tmpLeafArr.push({"leafId": tmpLeaf, "LCADepth":1000});
				}
			}

			// console.log("~~~~~~~~~~~" + i);
			// console.log(tmpLeafArr);
			// console.log(this.distilledRoot.children[i+1]);
			this.distilling(this.distilledRoot.children[i+1], tmpLeafArr);

			// currentDeepestNodes.push(this.distilledRoot.children[i+1].leaves);
			// console.log(currentDeepestNodes);
			// for(let j = 0; j < sortedPVs.length; j++){
			// 	let tmpCut = sortedPVs[j];

			// }
		}
	}	

	// console.log("current treeStructure");
	// console.log(this.distilledTreeStructure);

	//assign class label
	this.distilledTreeStructure[0].classify = -2;//root 
	this.distilledTreeStructure[1].classify = -1;//outlier
	for(let i = 2; i < this.distilledTreeStructure.length; i++){
		let labelStatistic = new Array();
		for(let j =  0; j < this.distilledTreeStructure[i].leaves.length; j++){
			let tmpClassLabel = this.treeStructure[this.distilledTreeStructure[i].leaves[j]].classify;
			if(typeof labelStatistic[tmpClassLabel] == "undefined"){
				labelStatistic[tmpClassLabel] = 1;
			}else{
				labelStatistic[tmpClassLabel]++;
			}
		}

		let tmpMax = 0;
		let tmpCls = 0;
		for(let j = 0; j < labelStatistic.length; j++){
			if(tmpMax < labelStatistic[j]){
				tmpMax = labelStatistic[j];
				tmpCls = j;
			}
		}
		this.distilledTreeStructure[i].classify = tmpCls;
	}

	this.assignDistillPosition();


	// console.log(this.distilledRoot);
	// console.log(this.distilledTreeStructure);


}

Tree.prototype.stepToRoot = function(t){	
	let steps = 0;
	while(t.index != this.rootIndex){
		steps++;
		t = t.ancestor;
	}
	return steps;
}

Tree.prototype.distilling = function(t, leafSeq){
	let deepestLCA = 1000;
	let deepestLeaf = 0;
	let deepestIdx = -1;
	for(let i = 0; i < leafSeq.length; i++){//can still be split
		if(leafSeq[i].LCADepth < deepestLCA){
			deepestLCA = leafSeq[i].LCADepth;
			deepestLeaf = leafSeq[i].leafId;
			deepestIdx = i;
		}
	}
	// console.log("lca index: " + deepestIdx + ", lca depth: " + deepestLCA + " , leafseq length: " + leafSeq.length);
	if(deepestIdx == leafSeq.length-1 || deepestIdx == -1) return;

	let leftDChild = new distilledNode(distillIdx);
	this.distilledTreeStructure[distillIdx] = leftDChild;
	// console.log("left: " + distillIdx);
	distillIdx++;
	let rightDChild = new distilledNode(distillIdx);
	this.distilledTreeStructure[distillIdx] = rightDChild;
	// console.log("right: " + distillIdx);
	distillIdx++;
	t.children[0] = leftDChild;
	t.children[1] = rightDChild;
	t.children[0].ancestor = t;
	t.children[1].ancestor = t;
	t.children[0].depth = t.depth+1;
	t.children[1].depth = t.depth+1;
	if(t.depth+1 > this.maxDistillDepth){this.maxDistillDepth = t.depth+1;}
	leftDChild.leaves = t.leaves.slice(0, t.leaves.indexOf(deepestLeaf)+1);
	// console.log("left leaves: " + leftDChild.leaves.toString());
	leafSeq1 = leafSeq.slice(0, deepestIdx+1);
	rightDChild.leaves = t.leaves.slice(t.leaves.indexOf(deepestLeaf)+1, t.leaves.length);
	// console.log("right leaves: " + rightDChild.leaves.toString());
	leafSeq2 = leafSeq.slice(deepestIdx+1, leafSeq.length);
	this.distilling(leftDChild, leafSeq1);
	this.distilling(rightDChild, leafSeq2);
}

Tree.prototype.assignDistillPosition = function(){
	// distillTreeContainerWidth
	let paddingx = 50;
	let unitx = (distillTreeContainerWidth - 2 * paddingx) / this.maxDistillDepth;

	for(let i = 0; i < this.distilledTreeStructure.length; i++){
		let tmpDNode = this.distilledTreeStructure[i];

		//assign Y
		let ySum = 0;
		for(let j = 0; j < tmpDNode.leaves.length; j++){
			ySum += this.treeStructure[tmpDNode.leaves[j]].y;
		}
		this.distilledTreeStructure[i].y = ySum/tmpDNode.leaves.length;

		//assign X
		this.distilledTreeStructure[i].x = (this.maxDistillDepth - this.distilledTreeStructure[i].depth) * unitx + paddingx;
	}
}

//fix tree nodes
/**
 * fix some specific nodes
 */
 Tree.prototype.fixTreeNode = function(t, nodeToFix){
	console.log("fixing " + t.index);
	if (t.index != this.rootIndex){
		if(t.ancestor.ancestor.index == t.index){
			return;
		}else{
			this.fixTreeNode(t.ancestor, nodeToFix);
			nodeToFix.push(t.ancestor.index);
			nodeToFix.push(t.ancestor.leftChild.index);
			nodeToFix.push(t.ancestor.rightChild.index);
		}
	}
}
//end fix tree nodes