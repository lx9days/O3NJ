class OptimalLeafOrdering{
	constructor(rootNode, D){
		this.rootNode = rootNode;
		this.D = D;
		console.log(D);
		this.M = new Array();
		for(let i in this.D){
			this.M[i] = new Array();
		}
		this.leafOrder;
	}

	optimalOrder(){
		this.build(this.rootNode);
		this.goThroughTree(this.rootNode);
		// let finalOrdering = this.
	}

	build(t){
		if(typeof(t.leftChild) == "undefined"){//t is leaf
			t.leaves = new Array();
			t.leaves[0] = t.index;
			return;
		}
		this.build(t.leftChild);
		this.build(t.rightChild);
		t.leaves = t.leftChild.leaves;
		t.leaves = t.leaves.concat(t.rightChild.leaves);
	}

	opt(t){
		if(typeof(t.leftChild) == "undefined"){//t is a leaf 
			this.M[t.index][t.index] = {value:0, list:""+t.index};
			return;
		}

		let result;
		this.opt(t.leftChild);
		this.opt(t.rightChild);

		for(let i = 0, len1 = t.leftChild.leaves.length; i < len1; i++){
			for(let j = 0, len2 = t.rightChild.leaves.length; j < len2; j++){
				M[t.leftChild]
			}
		}
	}

	goThroughTree(r){
		if (r.rightChild != "" && r.leftChild != "" && typeof(r.leftChild) != "undefined" && typeof(r.rightChild) != "undefined") {
			console.log("internal: " + r.index + "   leftChild:" + r.leftChild.index + " rightChild:" + r.rightChild.index);
			console.log(r.leaves);
			this.goThroughTree(r.rightChild);
			this.goThroughTree(r.leftChild);
		}else{
			console.log("leaf: " + r.index);
			console.log(r.leaves);
		}
	}

}