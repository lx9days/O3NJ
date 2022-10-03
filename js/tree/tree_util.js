function TreeUtil(){
	this.leafOrder = new Array();
	this.treeStructure = new Array();
}

TreeUtil.prototype.reverseSubTree = function(t){
	if (t.leftChild != "" && t.rightChild != ""){
		if(!t.leftChild.fixed){
			var tempNode = t.rightChild;
			t.rightChild = t.leftChild;
			t.leftChild = tempNode;
		}

		this.reverseSubTree(t.leftChild);
		this.reverseSubTree(t.rightChild);
	}
}

TreeUtil.prototype.printLeafOrder = function(r){
	if (r.rightChild != "" && r.leftChild != "") {
		if(r.rightChild != ""){
			this.printLeafOrder(r.rightChild);
		}
		if (r.leftChild != "") {
			this.printLeafOrder(r.leftChild);
		}
	}else {
		console.log(r.index);
	}
}

/**
 * record the current leaf order
 */
TreeUtil.prototype.recordLeafOrder = function(r){
	if (r.rightChild != "" && r.leftChild != "") {
		if(r.rightChild != ""){
			this.recordLeafOrder(r.rightChild);
		}
		if (r.leftChild != "") {
			this.recordLeafOrder(r.leftChild);
		}
	}else {
		this.leafOrder.push(r.index);
	}
}

/**
 * return the leaf order
 */
TreeUtil.prototype.getLeafOrder = function(r){
	this.leafOrder = [];
	this.recordLeafOrder(r);
	return this.leafOrder;
}

/*
 * find the left leaf node or right leaf node of a subtree
 */
TreeUtil.prototype.findLeafNode = function(t, leftOrRight){
	var nodeStack = new Array();
	nodeStack.push(t);
	var tmpnode;
	while (nodeStack.length != 0){
		tmpnode = nodeStack[nodeStack.length-1];
		if (this.isLeaf(tmpnode)){
			return tmpnode;
		}
		nodeStack.pop();
		if (leftOrRight == 0){
			if (tmpnode.leftChild){
				nodeStack.push(tmpnode.leftChild);  //push left subtree
			}
		} else if (leftOrRight == 1){
			if (tmpnode.rightChild){
				nodeStack.push(tmpnode.rightChild);  //push right subtree
			}
		}
	}
}

/*
 * judge whether the target node is a leaf node
 */
TreeUtil.prototype.isLeaf = function(t){
	if (t.leftChild != ""){
		return false;
	} else {
		return true;
	}
}

/**
 * find all ancestors for leaf node t, and returns a list contains all its ancestors
 */
TreeUtil.prototype.findAncestors = function(t, ancestors, rIdx){
	if (t.index != rIdx){
		if(t.ancestor.ancestor.index == t.index){
			return;
		}else{
			this.findAncestors(t.ancestor, ancestors, rIdx);
			ancestors.push(t.ancestor);
		}
	}
}

/*
* for test, output tree node index
*/
TreeUtil.prototype.goThroughTree = function(r){
	//console.log(r.index + ",leafNum:" + r.leafNum + ",wedge:" + r.wedge + ",t:" +r.t + "   " + r.leftChild.index + ",leafNum:" + r.leftChild.leafNum + ",wedge:" + r.leftChild.wedge + ",t:" + r.leftChild.t + "  " + r.rightChild.index + ",leafNum:" + r.rightChild.leafNum + ",wedge:" + r.rightChild.wedge + ",t:" + r.rightChild.t);
	if (r.rightChild != "" && r.leftChild != "" && typeof(r.leftChild) != "undefined" && typeof(r.rightChild) != "undefined") {
		console.log("internal: " + r.index + "   leftChild:" + r.leftChild.index + " rightChild:" + r.rightChild.index);
		this.goThroughTree(r.rightChild);
		this.goThroughTree(r.leftChild);
	}else{
		console.log("leaf: " + r.index);
	}
}

TreeUtil.prototype.assignTreeHeight = function(r){
	if (r.rightChild != "" && r.leftChild != "") {
		this.assignTreeHeight(r.rightChild);
		this.assignTreeHeight(r.leftChild);
		r.treeHeight =	r.leftChild.treeHeight > r.rightChild.treeHeight ? r.leftChild.treeHeight+1 : r.rightChild.treeHeight+1;
	}
}

TreeUtil.prototype.clearTreeHeight = function(r){
	if (r.rightChild != "" && r.leftChild != "") {
		this.clearTreeHeight(r.rightChild);
		this.clearTreeHeight(r.leftChild);
		r.treeHeight = 0;
	}
}

TreeUtil.prototype.cloneTree = function(t){
	let tmpNode = new Node(t.index);
	tmpNode.classify = t.classify;
	tmpNode.x = t.x;
	tmpNode.y = t.y;
	tmpNode.taxa = t.taxa;
	tmpNode.oriWeight = t.oriWeight;
	tmpNode.weight = t.weight;
	if(t.leftChild != ""){
		let tmpLeftChild = this.cloneTree(t.leftChild);
		let tmpRightChild = this.cloneTree(t.rightChild);
		tmpNode.leftChild = tmpLeftChild;
		tmpNode.rightChild = tmpRightChild;
		tmpNode.leftChild.ancestor = tmpNode;
		tmpNode.rightChild.ancestor = tmpNode;
		// console.log("********************");
		// console.log(tmpNode);
		// console.log(t);
	}
	this.treeStructure[t.index] = tmpNode;
	// console.log(this.treeStructure[t.index]);
	
	return tmpNode;
}

TreeUtil.prototype.factorial = function(m,n){  
	var num = 1;  
	var count = 0;  
	for(var i = m;i > 0;i--){  
		if(count == n){  
		    break;  
		}  
		num = num * i;  
		count++;  
	}  
	return num;  
}

TreeUtil.prototype.combination = function(m,n){  
	return factorial(m,n)/factorial(n,n);
} 

TreeUtil.prototype.bilateralFilter = function(cp){
	var N = 60;
	var deltad = 10;
	var deltar = 100;
	for(var i = 0; i < cp.length; i++){
		var sum1 = 0, sum2 = 0;
		for(var j = i - N/2; j <= i + N/2; j++){
			var d = 0, r = 0, w = 0;
			if(typeof(cp[j]) != "undefined"){
				d = Math.exp(-(cp[j].y - cp[i].y) * (cp[j].y - cp[i].y)/(2*deltad*deltad));
				r = Math.exp(-(cp[j].x - cp[i].x) * (cp[j].x - cp[i].x)/(2*deltar*deltar));
				w = d * r;
				sum1 += cp[j].x * w;
				sum2 += w;
			}else{
				d = 1;
				r = Math.exp(cp[i].x * (0 - cp[i].x)/(2*deltar*deltar));
				w = d * r;
				sum1 += 0;
				sum2 += w;
			}
		}
		cp[i].x = sum1 / sum2;
	}
}

TreeUtil.prototype.avgFilter = function(cp){
	var N = 30;
	for(var i = 0; i < cp.length; i++){
		var sum = 0;
		for(var j = i - N/2; j <= i + N/2; j++){
			if(typeof(cp[j]) != "undefined"){
				sum += cp[j].x;
			}else{
				sum += 0;
			}
		}
		cp[i].x = sum/(N+1);
	}
}