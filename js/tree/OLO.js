class OLO{
	constructor(rootNode, D){
		this.rootNode = rootNode;//the root node of the HC tree
		this.D = D;//euclidean distance matrix
		this.M = new Array();
		for(let x in this.D){
			// console.log(x);
			this.M[x] = new Array();
		}
		this.leafOrder;

		// console.log("in OLO:");
		// console.log(this.D);
	}

	optimalOrder(){
		this.build(this.rootNode);
		var ans = this.opt(this.rootNode);
		// console.log("final answer is: " + this.M[ans.ans_l][ans.ans_r].list);
		this.leafOrder = this.M[ans.ans_l][ans.ans_r].list;
	}

	build(rt){
		if(typeof rt.leftChild == 'undefined'){
			rt.leaves = new Array();
			rt.leaves[0] = rt.index;
			return;
		}
		this.build(rt.leftChild);
		this.build(rt.rightChild);
		rt.leaves = rt.leftChild.leaves;
		rt.leaves = rt.leaves.concat(rt.rightChild.leaves);
		// console.log(rt.index);
		// console.log(rt.leaves);
	}

	count1(ll,lr,tr){
		var mx = 100000;
		var tmp_rl,tmp_rr;
		var ans=100000,ans_l,ans_r;
		for(var v in ll.leaves){
			for(var w in tr.leaves){
				mx = 100000;
				for(var m in lr.leaves){
					// console.log("v is " + ll.leaves[v] + ", m is " + lr.leaves[m]+ ", w is " + tr.leaves[w] );
					// console.log(this.M[ll.leaves[v]][lr.leaves[m]].cnt+this.D[lr.leaves[m]][tr.leaves[w]]);
					if(mx > this.M[ll.leaves[v]][lr.leaves[m]].cnt+this.D[lr.leaves[m]][tr.leaves[w]]){
						// console.log("in");
						mx = this.M[ll.leaves[v]][lr.leaves[m]].cnt+this.D[lr.leaves[m]][tr.leaves[w]];
						tmp_rl = lr.leaves[m];
					}
				}
				// console.log("ll.leaves[v]: " + ll.leaves[v] + ", tmp_rl: " + tmp_rl);
				// console.log(this.M[ll.leaves[v]][tmp_rl].list + ",,,,,,,,," + tr.index);

				this.M[ll.leaves[v]][tr.leaves[w]] = {cnt:mx,list:this.M[ll.leaves[v]][tmp_rl].list+","+tr.index};
				//the other one is in reverse order, reverse the list
				let tmpBlock = this.M[ll.leaves[v]][tmp_rl].list.split(",");
				tmpBlock = tmpBlock.reverse();
				let tempStr = "";
				for(let i = 0; i < tmpBlock.length-1; i++){
					tempStr += tmpBlock[i] + ",";
				}
				tempStr += tmpBlock[tmpBlock.length-1];
				this.M[tr.leaves[w]][ll.leaves[v]] = {cnt:mx,list:tr.index+","+tempStr};
				if(ans>mx){
					ans = mx;
					ans_l = ll.leaves[v];
					ans_r = tr.leaves[w];
					// console.log(ans_l + " " + ans_r);
				}
			}
		}
		// console.log(ans_l + " + " + ans_r + " + " + this.M[ans_l][ans_r].list);
		// console.log(ans_r + " + " + ans_l + " + " + this.M[ans_r][ans_l].list);
		return {ans:ans,ans_l:ans_l,ans_r:ans_r};
	}

	count2(ll,lr,rl,rr){
		var mx = 100000;
		var tmp_rl,tmp_rr;
		var ans=100000,ans_l,ans_r;
		for(var v in ll.leaves)
			for(var w in rr.leaves){
				mx = 100000;
				for(var m in lr.leaves)
					for(var k in rl.leaves){
						if(mx>this.M[ll.leaves[v]][lr.leaves[m]].cnt+this.M[rl.leaves[k]][rr.leaves[w]].cnt+this.D[lr.leaves[m]][rl.leaves[k]]){
							mx = this.M[ll.leaves[v]][lr.leaves[m]].cnt+this.M[rl.leaves[k]][rr.leaves[w]].cnt+this.D[lr.leaves[m]][rl.leaves[k]];
							tmp_rl = lr.leaves[m];
							tmp_rr = rl.leaves[k];
						}
					}
				this.M[ll.leaves[v]][rr.leaves[w]] = {cnt:mx,list:this.M[ll.leaves[v]][tmp_rl].list+","+this.M[tmp_rr][rr.leaves[w]].list};
				//reverse list 
				let tmpBlock1 = this.M[tmp_rr][rr.leaves[w]].list.split(",");
				let tmpBlock2 = this.M[ll.leaves[v]][tmp_rl].list.split(",");
				tmpBlock1 = tmpBlock1.reverse();
				tmpBlock2 = tmpBlock2.reverse();
				let tmpStr1 = "";
				let tmpStr2 = "";
				for(let i = 0; i < tmpBlock1.length-1; i++){
					tmpStr1 += tmpBlock1[i]+",";
				}
				tmpStr1 += tmpBlock1[tmpBlock1.length-1];
				for(let i = 0; i < tmpBlock2.length-1; i++){
					tmpStr2 += tmpBlock2[i]+",";
				}
				tmpStr2 += tmpBlock2[tmpBlock2.length-1];
				this.M[rr.leaves[w]][ll.leaves[v]] = {cnt:mx,list:tmpStr1+","+tmpStr2};
				if(ans>mx){
					ans = mx;
					ans_l = ll.leaves[v];
					ans_r = rr.leaves[w];
				}
			}
		return {ans:ans,ans_l:ans_l,ans_r:ans_r};
	}

	opt(rt){
		if(typeof rt.leftChild == 'undefined'){
			this.M[rt.index][rt.index] = {cnt:0,list:[rt.index]};
			return;
		}
		var ans;
		var tl = rt.leftChild;
		var tr = rt.rightChild;
		this.opt(tl);
		this.opt(tr);
		if(typeof tl.leftChild == 'undefined' && typeof tr.leftChild == 'undefined'){//both leaves
			// console.log("&&&&&&&&&&&&&&&&&&&&&&&& " + tl.index + " and " + tr.index + " are both leaves");
			this.M[tl.index][tr.index] = {cnt:this.D[tl.index][tr.index],list:tl.index+','+tr.index};
			this.M[tr.index][tl.index] = {cnt:this.D[tl.index][tr.index],list:tr.index+','+tl.index};

			// console.log("temp ans is: ");
			// console.log(this.D[tl.index][tr.index]);
			// console.log(this.M[tl.index][tr.index].list);

			return {ans:this.D[tl.index][tr.index],ans_l:tl.index,ans_r:tr.index};
		} else if(typeof tl.leftChild == 'undefined' && typeof tr.leftChild != 'undefined'){//tl is leaf
			// console.log("&&&&&&&&&&&&&&&&&&&&&&&& " + tl.index + " is leaf.");
			var mx = 100000;
			var temp1 = mx, temp2 = mx;
			temp1 = this.count1(tr.leftChild,tr.rightChild,tl);
			// console.log("temp1: ");
			// console.log(temp1);
			if(mx>temp1.ans) {mx=temp1.ans,ans=temp1};
			temp2 = this.count1(tr.rightChild,tr.leftChild,tl);
			// console.log("temp2: ");
			// console.log(temp2);
			if(mx>temp2.ans) {mx=temp2.ans,ans=temp2};
			// console.log("answer is: ");
			// console.log(ans);


			// console.log("temp answer is: ");
			// console.log(ans.ans);
			// console.log(this.M[ans.ans_l][ans.ans_r].list);

			return ans;
		} else if(typeof tr.leftChild == 'undefined' && typeof tl.leftChild != 'undefined'){//tr is leaf
			// console.log(tr.index + " is leaf.");
			var mx = 100000;
			var temp1 = mx, temp2 = mx;
			temp1 = this.count1(tl.leftChild,tl.rightChild,tr);
				if(mx>temp1.ans) {mx=temp1.ans,ans=temp1};
			temp2 = this.count1(tl.rightChild,tl.leftChild,tr);
				if(mx>temp2.ans) {mx=temp2.ans,ans=temp2};

			// console.log("temp answer is: ");
			// console.log(ans.ans);
			// console.log(this.M[ans.ans_l][ans.ans_r].list);

			return ans;
		}else{//both are internal nodes
			// console.log("&&&&&&&&&&&&&&&&&&&&&&&& " + tl.index + " and " + tr.index + " are both internal nodes");
			var mx = 100000;
			var temp = mx;
			temp = this.count2(tl.leftChild,tl.rightChild,tr.leftChild,tr.rightChild);
			if(mx>temp.ans) {mx=temp.ans,ans=temp};
			temp = this.count2(tl.rightChild,tl.leftChild,tr.leftChild,tr.rightChild);
			if(mx>temp.ans) {mx=temp.ans,ans=temp};
			temp = this.count2(tl.leftChild,tl.rightChild,tr.rightChild,tr.leftChild);
			if(mx>temp.ans) {mx=temp.ans,ans=temp};
			temp = this.count2(tl.rightChild,tl.leftChild,tr.rightChild,tr.leftChild);
			if(mx>temp.ans) {mx=temp.ans,ans=temp};

			// console.log("temp answer is: ");
			// console.log(ans.ans);
			// console.log(this.M[ans.ans_l][ans.ans_r].list);

			return ans;	
		}
		
	}
}

// var no1 = {index:0};
// var no2 = {index:1};
// var no3 = {index:2};
// var no4 = {index:3};
// var no5 = {index:4};
// var no6 = {index:5,leftChild:no1,rightChild:no2};
// var no7 = {index:6,leftChild:no6,rightChild:no3};
// var no8 = {index:7,leftChild:no4,rightChild:no5};
// var no9 = {index:8,leftChild:no7,rightChild:no8};
// var d = new leaves();
// d[0] = new leaves(0,1,2,3,7);
// d[1] = new leaves(1,0,4,5,8);
// d[2] = new leaves(2,4,0,6,3);
// d[3] = new leaves(3,5,6,0,10);
// d[4] = new leaves(7,8,3,10,0);
// var olo = new OLO(no9,d);
// olo.optimalOrder();