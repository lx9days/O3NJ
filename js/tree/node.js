function Node(index){
	this.index = index;
	this.weight = "";
	this.oriWeight = "";
	this.classify = "";
	this.leftChild = "";
	this.rightChild = "";
	this.ancestor = "";
	this.leafNum = 0;
	this.depth = 0;
	this.treeHeight = 0;

	this.leafRatio = [];
	this.allLeaves = [];
	this.varience = 0;
	this.distanceToRoot = 0;//in order to get the max distance to the root, and scale the tree to the screen width
	this.weightToRoot = 0;//in order to get the max weight to the root, and scale the tree to the screen width

	this.judgeX = 0;
	this.judgeY = 0;
	this.foldable = false;

	this.x = 0;
	this.y = 0;

	this.fixed = false;

	this.taxa = "";
}

//unchanged attributes and functions
Node.prototype.setWeight = function(weight){
	this.weight = weight;
};
Node.prototype.setClassify = function(classify){
	this.classify = classify;
};
Node.prototype.setLeftChild = function(leftChild){
	this.leftChild = leftChild;
};
Node.prototype.setRightChild = function(rightChild){
	this.rightChild = rightChild;
};
Node.prototype.setAncestor = function(ancestor){
	this.ancestor = ancestor;
};
