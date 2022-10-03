class NeighborJoining{
	constructor(D, taxa, classify){
		if(taxa.length != classify.length){
			console.err("length mis match !!");
			return;
		}
		this.N = taxa.length;//total number of OTUs
		this.D = D;//distance matrix 
		this.taxa = taxa;//array of taxa
		this.classify = classify;//array of classify
		this.S;//the sum of the distance between that OTU and every other OTU, divided by N-2
		this.M;//identify the pair of OTUs with the minimum value of Dij-Si-Sj
		this.minM = 10000000;
		this.minPair = new Array(2);
		this.internalNodeNum = taxa.length;
		this.treeNodes = new Map();
		this.root;
		this.treeJson = {};

        this.rows = new Array(taxa.length-1);
        this.cols = new Array(taxa.length-1);

        this.Dpara = 1;
        this.Spara = 1;//1.5

		return this;
	}

	buildTree(){
		this.initLeaves();
        while(this.N-2 > 0){
    		this.calS();
    		this.calM();
            this.joinPair();
            this.updateD();
        }
        this.addRoot();
        this.generateJson();
	}

	initLeaves(){
		for(let i = 0; i < this.N; i++){
			let obj = new NJNode();
			obj.setIndex(i);
            obj.setClassify(this.classify[i]);
			obj.setTaxa(this.taxa[i]);
			this.treeNodes.set(i, obj);
            if(i < this.N){
                this.rows[i] = i;
                this.cols[i] = i;
            }
		}
	}

	calS(){
		this.S = new Array(this.N);
		for(let i = 0; i < this.N; i++){
			let tmpS = 0;
			for(let j = 0; j < this.N; j++){
				tmpS += this.D[i][j];
			}
			this.S[i] = tmpS / (this.N - 2);
		}
	}

	calM(){
		this.M = new Array(this.N);
		for(let i = 0; i < this.N; i++){
			this.M[i] = new Array(); 
			for(let j = i+1; j < this.N; j++){
				// if(j > i){//lower triangular matrix
					this.M[i][j] = this.Dpara*this.D[i][j] - this.Spara*(this.S[i] + this.S[j]);
					if(this.M[i][j] < this.minM){
						this.minM = this.M[i][j];
						this.minPair[0] = this.rows[i];
						this.minPair[1] = this.cols[j];
					// }
				}
			}
		}
	}

    joinPair(){
        //calculate the weight
        let rowIdx = this.rows.indexOf(this.minPair[0]);
        let colIdx = this.cols.indexOf(this.minPair[1]);
        let Siu = this.D[rowIdx][colIdx]/2 + (this.S[rowIdx] - this.S[colIdx])/2;
        this.treeNodes.get(this.minPair[0]).setWeight(Siu);
        let Sju = this.D[rowIdx][colIdx]/2 + (this.S[colIdx] - this.S[rowIdx])/2;
        this.treeNodes.get(this.minPair[1]).setWeight(Sju);
        
        //create virtual node and assign child-parent relation
        let obj = new NJNode();
        obj.setIndex(this.internalNodeNum);
        let leftChild = this.treeNodes.get(this.minPair[0]);
        let rightChild = this.treeNodes.get(this.minPair[1]);
        obj.setLeftChild(leftChild);
        obj.setRightChild(rightChild);
        leftChild.parent = obj.index;
        rightChild.parent = obj.index;
        this.treeNodes.set(this.internalNodeNum, obj);
        this.internalNodeNum++;
    }

    /**
     * update D, array rows and array cols
     */
    updateD(){
        //calculate the distance from all other nodes to the newly created virtual node
        let rowIdx = this.rows.indexOf(this.minPair[0]);
        let colIdx = this.cols.indexOf(this.minPair[1]);

        let tmpDU = new Array(this.N);
        for(let i = 0; i < this.N; i++){
            if(i != rowIdx && i != colIdx){
                tmpDU[i] = (this.D[rowIdx][i] + this.D[colIdx][i] - this.D[rowIdx][colIdx])/2;
            }else{
                tmpDU[i] = 0;
            }
        }

        //replace the colIdx col and row with tmpDU
        this.D.splice(colIdx, 1, tmpDU);
        for(let i = 0; i < this.N; i++){
            this.D[i].splice(colIdx, 1, tmpDU[i]);
        }
        //delete the rowIdx col and row
        this.D.splice(rowIdx, 1);
        for(let i = 0; i < this.N-1; i++){
            this.D[i].splice(rowIdx, 1);
        }
        //update N and reset
        this.N--;
        this.minM = 1000000;
        //update rows and cols array
        this.cols.splice(colIdx, 1, this.internalNodeNum-1);
        this.cols.splice(rowIdx, 1);
        this.rows.splice(colIdx, 1, this.internalNodeNum-1);
        this.rows.splice(rowIdx, 1);
    }

    addRoot(){
        //create root
        this.root = new NJNode();
        this.root.setIndex(this.internalNodeNum);
        let leftChild = this.treeNodes.get(this.rows[0]);
        let rightChild = this.treeNodes.get(this.rows[1]);
        leftChild.setWeight(this.D[0][1]);//assign weight to the last two nodes
        rightChild.setWeight(0);
        this.root.setLeftChild(leftChild);
        this.root.setRightChild(rightChild);
        leftChild.parent = this.root.index;
        rightChild.parent = this.root.index;
        // this.treeNodes.set(this.internalNodeNum, this.root);
    }

    generateJson(){
    	let tmpNodesArr = new Array();
    	this.treeNodes.forEach(function(value){
    		let tmpObj = {};
    		tmpObj.index = value.index+1;
    		tmpObj.parent = value.parent+1;
            if(tmpObj.index == 33)
                tmpObj.weight = value.weight*0.6;
            else    
                tmpObj.weight = value.weight;
            tmpObj.classify = value.classify;
    		tmpObj.taxa = value.taxa;
    		tmpNodesArr.push(tmpObj);
        })

    	tmpNodesArr.sort(function(a, b){
    		return a.parent - b.parent;
    	})
    	
    	this.treeJson.nodes = tmpNodesArr;
        console.log(JSON.stringify(this.treeJson));
    }

	printD(dis){
        console.log("******************* printing D *******************");
		for(let i = 0; i < dis.length; i++){
			let content = "";
			for(let j = 0; j < dis[i].length; j++){
			   content += dis[i][j] + "\t"; 
			}
			console.log(content);
		}
        console.log("***************** end printing D *****************");
	}

	printNodes(){
        this.treeNodes.forEach(function(value){
            console.log(value.index 
                + " parent:"+value.parent 
                + " leftChild: " + (value.leftChild == null ? "null" : value.leftChild.index)
                + " rightChild: " + (value.rightChild == null ? "null" : value.rightChild.index)
                + " weight:" + value.weight 
                + " classify:" + value.classify);
        })
	}
}

class NJNode {
	constructor(){
		this.children = new Array(2);
		this.index = -1;
		this.parent = -1;
		this.weight = -1;
		this.leftChild = null;
		this.rightChild = null;
		this.classify = -1;
		this.taxa = "";
	}

	setIndex(index){
		this.index = index;
	}

	setParent(parent){
		this.parent = parent;
	}

	setLeftChild(t){
		this.leftChild = t;   
	}

	setRightChild(t){
		this.rightChild = t;   
	}

	setWeight(weight){
		this.weight = weight;
	}

	setClassify(classify){
		this.classify = parseInt(classify);
	}

	setTaxa(taxa){
		this.taxa = taxa;
	}
}