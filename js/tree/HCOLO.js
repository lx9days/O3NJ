class HCOLO{
	constructor(inputData, D, taxa){
		this.D = D;
		this.inputData = inputData;
		this.taxa = taxa;
		this.hcTree;
		this.leafOrder;
		this.rootIndex = -1;
		this.allNodes = new Map();
	}

	readData(treePath, callback){
		d3.json(treePath, function(err, data){
			if(err) throw err;

			callback(data);
		})
	}

	generateTreeFromFile(){

		hcTreeData.sort(function(a, b){
			return a.parent - b.parent;
		})

		var rootData = {};
		rootData.index = hcTreeData[0].index;
		rootData.classify = hcTreeData[0].classify;
		rootData.weight = hcTreeData[0].weight;
		rootData.parent = "";
		rootData.taxa = "";
		// hcTreeData.push(rootData);
		// hcTreeData = hcTreeData.slice(1, hcTreeData.length);
		// console.log(hcTreeData);

		for(let i = 0, len = hcTreeData.length; i < len; i++){
			this.allNodes.set(hcTreeData[i].index, hcTreeData[i]);
		}
		console.log(hcTreeData);
		// console.log(this.allNodes);
		// console.log(this.allNodes.length);

		// console.log(Object.getOwnPropertyNames(this.allNodes).length-1);
		this.rootIndex = rootData.index;
	}

	generateTree(){
		var clusters = hcluster()
			.distance('euclidean')
			.linkage('max')
			.verbose(true)
			.data(this.inputData);
		let tmpTree = clusters.tree();
		this.formatTree(tmpTree);
		this.hcTree = this.allNodes.get(tmpTree.taxa);
	}

	getLeafOrder(){
		// let olo = new OLO(this.hcTree, this.D);
		// olo.optimalOrder();
		// this.leafOrder = olo.leafOrder.split(",");
		// for(let i = 0; i < this.leafOrder.length; i++){
		// 	this.leafOrder[i] = parseInt(this.leafOrder[i])+1;
		// }
		let preprocessedOrder = testLeafOrder[numOrdering];
		// console.log(preprocessedOrder);
		this.leafOrder = preprocessedOrder.split(",");
		for(let i = 0; i < this.leafOrder.length; i++){
			this.leafOrder[i] = parseInt(this.leafOrder[i]);
		}
	}

	formatTree(rootNode){
		if(typeof(rootNode.children) != "undefined"){
			this.formatTree(rootNode.children[0]);
			this.formatTree(rootNode.children[1]);
		}
		let tmpNode = {};
		let r = /^-?\d+$/;
		tmpNode.index = r.test(rootNode.taxa) ? rootNode.taxa : this.taxa.indexOf(rootNode.taxa);
		tmpNode.height = rootNode.height;
		if(typeof(rootNode.children) != "undefined"){
			tmpNode.leftChild = this.allNodes.get(r.test(rootNode.children[0].taxa) ? rootNode.children[0].taxa : this.taxa.indexOf(rootNode.children[0].taxa));
			tmpNode.rightChild = this.allNodes.get(r.test(rootNode.children[1].taxa) ? rootNode.children[1].taxa : this.taxa.indexOf(rootNode.children[1].taxa));
		}
		tmpNode.x = 0;
		tmpNode.y = 0;
		this.allNodes.set(tmpNode.index, tmpNode);
	}

	/**
	 * assign Y for the nodes
	 */
	assignY(t, padding_top){
		if (typeof(t.rightChild) != "undefined") {
			this.assignY(t.rightChild, padding_top);
		}
		if (typeof(t.leftChild) != "undefined") {
			this.assignY(t.leftChild, padding_top);
		}
		if (typeof(t.leftChild) != "undefined" && typeof(t.rightChild) != "undefined"){
			t.y = ((t.rightChild.y-padding_top) + (t.leftChild.y-padding_top)) / 2 + padding_top;
		}
	}

	/**
	 * assign X for the nodes
	 */
	assignX(t, padding_left){
		if(t.index == this.hcTree.index){//root
			t.x = padding_left;
		} else {
			t.x = padding_left + ((this.hcTree.height-t.height)/this.hcTree.height)*(treeContainerWidth-2*paddingWidth);
		}

		if(typeof(t.leftChild) != "undefined" && typeof(t.rightChild) != "undefined"){
			this.assignX(t.leftChild, padding_left);
			this.assignX(t.rightChild, padding_left);
		}
	}

	/**
	 * assign positions for the tree nodes according to the height info and leaf order
	 * assign X according to the height info
	 * assign Y according to the leaf order
	 */
	assignPosition(){
		let extraPaddingHeight = 100;
		let unitHeight = (height-paddingHeight)/this.leafOrder.length;
		for(let i = 0, len = this.leafOrder.length; i < len; i++){
			this.allNodes.get(this.leafOrder[i]-1).y = extraPaddingHeight + i * unitHeight;
			if(i != 0){
				this.allNodes.get(this.leafOrder[i]-1).y -= unitHeight/2;
			}
		}

		//internal nodes
		this.assignY(this.hcTree, paddingHeight);
		//assign X
		this.assignX(this.hcTree, 30);
	}

	assignPositionFromFile(){
		let extraPaddingHeight = 10;
		//let unitHeight = (height-paddingHeight)/this.leafOrder.length;
		let unitHeight = 1000/this.leafOrder.length;
		for(let i = 0, len = this.leafOrder.length; i < len; i++){
			this.allNodes.get(this.leafOrder[i]).y = extraPaddingHeight + i * unitHeight;
			if(i != 0){
				this.allNodes.get(this.leafOrder[i]).y -= unitHeight/2;
			}
		}

		let rootWeight = this.allNodes.get(this.rootIndex).weight;
		for(let i = 1, len = hcTreeData.length; i < len; i+=2){
			// if(i < len-1){
				let parentY = (this.allNodes.get(hcTreeData[i].index).y + this.allNodes.get(hcTreeData[i+1].index).y)/2;
				let parentIndex = this.allNodes.get(hcTreeData[i].index).parent;
				// console.log(hcTreeData[i].index + " " + parentIndex);
				// if(parentIndex != "")
				this.allNodes.get(parentIndex).y = parentY;

				let node1Weight = this.allNodes.get(hcTreeData[i].index).weight;
				let node1x = 30 + ((rootWeight-node1Weight)/rootWeight)*(treeContainerWidth-2*paddingWidth);
				this.allNodes.get(hcTreeData[i].index).x = node1x;

				let node2Weight = this.allNodes.get(hcTreeData[i+1].index).weight;
				let node2x = 30 + ((rootWeight-node2Weight)/rootWeight)*(treeContainerWidth-2*paddingWidth);
				this.allNodes.get(hcTreeData[i+1].index).x = node2x;
			// }
		}
		this.allNodes.get(this.rootIndex).x = 30;
		this.allNodes.get(this.rootIndex).y = 1000/2;

		// for(let i = 0; i < hcTreeData.length; i++){
		// 	console.log("index:"+this.allNodes.get(hcTreeData[i].index).index+", x:"+this.allNodes.get(hcTreeData[i].index).x+", y:"+this.allNodes.get(hcTreeData[i].index).y);
		// }


		//test print distance matrix generated from the tree structure
		let tmpDisM = new Array();
		for(let i = 0; i < this.leafOrder.length; i++){
			tmpDisM[i] = new Array();
		}
		let maxTij = 0;
		let maxD = 0;
		for(let i = 0, len = this.leafOrder.length; i < len; i++){
			//find LCA of node i
			let iAnces = new Array();
			this.findAllAncestors(this.allNodes.get(i+1), iAnces);

			for(let j = 0; j < len; j++){
				//find LCA of node i and node j
				let jAnces = new Array();
				this.findAllAncestors(this.allNodes.get(j+1), jAnces);
				let LCA = this.findLCA(iAnces, jAnces);
				let tij = this.allNodes.get(LCA).weight;
				// let tij = this.minDisOnTree(i+1, j+1, this.cloneObj(iAnces), this.cloneObj(jAnces), iAnces.indexOf(LCA));
				tmpDisM[i][j] = Math.round(tij*10000)/10000;
				if(tmpDisM[i][j] > maxTij){
					maxTij = tmpDisM[i][j];
				}
				if(this.D[i][j] > maxD){
					maxD = this.D[i][j];
				}
			}
		}

		// for(let i = 0; i < this.leafOrder.length; i++){
		// 	console.log(tmpDisM[i].join());
		// }
		//calculate the evaluate value
		let tmpD = this.cloneObj(this.D);
		//unify the matrix
		for(let i = 0, len = this.leafOrder.length; i < len; i++){
			for(let j = 0; j < len; j++){	
				tmpDisM[i][j] /= maxTij;
				tmpD[i][j] /= maxD;
			}
		}
		// console.log(tmpD);
		// console.log(tmpDisM);
		let sum = 0;
		for(let i = 0, len = this.leafOrder.length; i < len; i++){
			for(let j = 0; j < len; j++){
				sum += (tmpDisM[i][j] - tmpD[i][j]) * (tmpDisM[i][j] - tmpD[i][j]);
			}
		}
		console.log("HC distance difference is: " + sum);
		//end test

		console.log(this.allNodes);
	}


	cloneObj(obj){
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

	minDisOnTree(leafi, leafj, iAnces, jAnces, LCAIndex){
		if(leafi == leafj){
			return 0;
		}
		iAnces.push(leafi);
		jAnces.push(leafj);
		let sum = 0;
		for(let i = LCAIndex+1; i < iAnces.length; i++){
			let nodeIndex = iAnces[i];
			sum += this.allNodes.get(nodeIndex).weight;
		}
		for(let i = LCAIndex+1; i < jAnces.length; i++){
			let nodeIndex = jAnces[i];
			sum += this.allNodes.get(nodeIndex).weight;	
		}
		return sum;
	}

	findAllAncestors(t, arr){
		if (t.index != this.rootIndex){
			// console.log(t);
			this.findAllAncestors(this.allNodes.get(t.parent), arr);
			arr.push(t.parent);
		}
	}

	findLCA(iAnces, jAnces){
		let len = iAnces.length < jAnces.length ? iAnces.length : jAnces.length;
		for(let i = 0; i < len; i ++){
			if(i == len-1 || iAnces[i+1] != jAnces[i+1]){
				return iAnces[i];
			}
		}
	}
}