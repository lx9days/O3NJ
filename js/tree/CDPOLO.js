class CDPOLO{
	constructor(rootNode, allNodes, D){
		this.rootNode = rootNode;//the root node of the HC tree
		this.allNodes = new Map();


		for(let i = 1; i < allNodes.length; i++){
			// this.allNodes
			// console.log(allNodes[i].index);
			this.allNodes.set(allNodes[i].index, allNodes[i].weight);
		}



		this.D = D;//euclidean distance matrix
		this.M = new Array();
		for(let x in this.D){
			this.M[x] = new Array();
		}
		//cal avg D
		let count = 0;
		let sumD = 0;
		for(let i in this.D){
			for(let j = 0; j < i; j++){
				count++;
				sumD += this.D[i][j];
			}
		}
		this.avgD = sumD/count;
		this.avgD /= 2;
		// console.log("avgD: " + this.avgD);

		this.leafOrder;

		// this.util = new Util();


		this.runTime = 0;
		this.count1RunTime = 0;
		this.count1InnerRunTime = 0;
		this.testTime = 0;
		this.testTime2 = 0;
	}

	optimalOrder(){
		this.build(this.rootNode);
		var ans = this.opt(this.rootNode);
		// console.log("runtime: " + this.runTime);
		// console.log("count1 runTime: " + this.count1RunTime);
		// console.log("count1 inner runTime: " + this.count1InnerRunTime);
		// console.log("count1 test runTime: " + this.testTime);
		// console.log("count1 test2 runTime: " + this.testTime2);

		// console.log("final answer is: " + this.M[ans.ans_l][ans.ans_r].list);
		this.leafOrder = this.M[ans.ans_l][ans.ans_r][3];
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
	}

	count1(ll,lr,tr){
		// console.log("&&&&&&&&&& count1  &&&&&&&&&&&&");
		var mx = 100000000;
		var tmp_rl,tmp_rr;
		var ans=100000000,ans_l,ans_r;
		for(var v in ll.leaves){
			//sort M(vl, v, R)
			let MvR = new Array();
			let tmpStr = ll.leaves.concat(lr.leaves).join(",");
			let tmpStrLen = tmpStr.length; 
			// let testStart = new Date().getTime();
			for(let mvri = 0, len = this.M[ll.leaves[v]].length; mvri < len; mvri++){
				if(typeof(this.M[ll.leaves[v]][mvri]) != "undefined"){
					if(this.M[ll.leaves[v]][mvri][3].length == tmpStrLen){
						MvR.push([this.M[ll.leaves[v]][mvri][1], this.M[ll.leaves[v]][mvri][2]]);
					}
				}
			}
			MvR.sort(function(a,b){
				return a[1] - b[1];
			})
			
			for(var w in tr.leaves){
				let minDiff = 100000;
				for(var m in lr.leaves){
					if(Math.abs(this.allNodes.get(lr.leaves[m]) - this.allNodes.get(tr.leaves[w])) < minDiff){
						minDiff = Math.abs(this.allNodes.get(lr.leaves[m]) - this.allNodes.get(tr.leaves[w]));
					}
				}

				mx = 100000000;
				for(var m in MvR){
					// if(MvR[m][] < tmpStrLen) continue;
					var mIndex = MvR[m][0];
					if(this.M[ll.leaves[v]][mIndex][2] + minDiff >= mx){
						this.M[ll.leaves[v]][tr.leaves[w]] = [ll.leaves[v], tr.leaves[w], mx, this.M[ll.leaves[v]][mIndex][3]+","+tr.index];
						// console.log("terminte in m " + m + " , " +MvR.length);
						break;
					}

					let lenDiff = this.D[mIndex][tr.leaves[w]] <= this.avgD ? 
									Math.abs(this.allNodes.get(mIndex) - this.allNodes.get(tr.leaves[w])) : 
									10*this.avgD+(Math.abs(this.allNodes.get(mIndex) - this.allNodes.get(tr.leaves[w])));
					if(mx > this.M[ll.leaves[v]][mIndex][2]+lenDiff){
						mx = this.M[ll.leaves[v]][mIndex][2]+lenDiff;
						tmp_rl = mIndex;
					}
				}

				this.M[ll.leaves[v]][tr.leaves[w]] = [ll.leaves[v], tr.leaves[w], mx, this.M[ll.leaves[v]][tmp_rl][3]+","+tr.index];
				let tmpBlock = this.M[ll.leaves[v]][tmp_rl][3].split(",").reverse().join(",");
				this.M[tr.leaves[w]][ll.leaves[v]] = [tr.leaves[w], ll.leaves[v], mx, tr.index+","+tmpBlock];
				if(ans>mx){
					ans = mx;
					ans_l = ll.leaves[v];
					ans_r = tr.leaves[w];
				}
			}
			
		}
		// console.log(ans_l + " + " + ans_r + " + " + this.M[ans_l][ans_r].list);
		// console.log(ans_r + " + " + ans_l + " + " + this.M[ans_r][ans_l].list);
		// let end = new Date().getTime();
		// this.count1RunTime += end - start;

		return {ans:ans,ans_l:ans_l,ans_r:ans_r};
	}

	count2(ll,lr,rl,rr){
		// console.log("**************** count2  ***************");
		// console.time("--1st loop");
		var mx = 100000000;
		var tmp_rl,tmp_rr;
		var ans=100000000,ans_l,ans_r;
		let count = 0;
		for(var v in ll.leaves){
			//sort M(vl, v, R)
			let tmpStr = ll.leaves.concat(lr.leaves).join(",");
			let tmpStrLen = tmpStr.length; 
			let MvR = new Array();
			for(let mvri = 0, len = this.M[ll.leaves[v]].length; mvri < len; mvri++){
				if(typeof this.M[ll.leaves[v]][mvri] != "undefined")
					if(this.M[ll.leaves[v]][mvri][3].length == tmpStrLen){
						MvR.push([this.M[ll.leaves[v]][mvri][1], this.M[ll.leaves[v]][mvri][2]]);
					}
			}

			MvR.sort(function(a,b){
				return a[1] - b[1];
			})

			for(var w in rr.leaves){
				// let MwL = this.util.cloneObj(this.M[rr.leaves[w]]);
				let tmpStr2 = rl.leaves.concat(rr.leaves).join(",");
				let tmpStrLen2 = tmpStr2.length;
				let MwL = new Array();
				for(let mwli = 0, len = this.M[rr.leaves[w]].length; mwli < len; mwli++){
					if(typeof this.M[rr.leaves[w]][mwli] != "undefined")
						if(this.M[rr.leaves[w]][mwli][3].length == tmpStrLen2){
							MwL.push([this.M[rr.leaves[w]][mwli][1], this.M[rr.leaves[w]][mwli][2]]);
						}
				}

				//sort M(vr, w, L)
				MwL.sort(function(a,b){
					return a[1] - b[1];
				})

				let minDiff = 100000000;
				for(var m in lr.leaves){
					for(var k in rl.leaves){
						count++;
						if(Math.abs(this.allNodes.get(lr.leaves[m]) - this.allNodes.get(rl.leaves[k])) < minDiff){
							minDiff = Math.abs(this.allNodes.get(lr.leaves[m]) - this.allNodes.get(rl.leaves[k]));
							minDiff = this.D[lr.leaves[m]][rl.leaves[k]] <= this.avgD ? minDiff : 10*this.avgD+minDiff;
						}
					}
				}

				mx = 100000000;
				for(var m in MvR){
					var mIndex = MvR[m][0];
					var k0 = MwL[0][0];
					if(this.M[ll.leaves[v]][mIndex][2] + this.M[k0][rr.leaves[w]][2] + minDiff >= mx){
						this.M[ll.leaves[v]][rr.leaves[w]] = [ll.leaves[v], rr.leaves[w], mx, this.M[ll.leaves[v]][mIndex][3]+","+this.M[k0][rr.leaves[w]][3]];
						break;
					}
					for(var k in MwL){
						count++;
						var kIndex = MwL[k][0];
						let lenDiff = this.D[mIndex][kIndex] <= this.avgD ? 
									Math.abs(this.allNodes.get(mIndex) - this.allNodes.get(kIndex)) : 
									10*this.avgD+(Math.abs(this.allNodes.get(mIndex) - this.allNodes.get(kIndex)));
						if(mx>=this.M[ll.leaves[v]][mIndex][2]+this.M[kIndex][rr.leaves[w]][2]+lenDiff){
							mx = this.M[ll.leaves[v]][mIndex][2]+this.M[kIndex][rr.leaves[w]][2]+lenDiff;
							tmp_rl = mIndex;
							tmp_rr = kIndex;
						}else{
							break;
						}
					}

				}
				this.M[ll.leaves[v]][rr.leaves[w]] = [ll.leaves[v], rr.leaves[w], mx, this.M[ll.leaves[v]][tmp_rl][3]+","+this.M[tmp_rr][rr.leaves[w]][3]];

				let tmpBlock1 = this.M[tmp_rr][rr.leaves[w]][3].split(",").reverse().join(",");
				let tmpBlock2 = this.M[ll.leaves[v]][tmp_rl][3].split(",").reverse().join(",");
				this.M[rr.leaves[w]][ll.leaves[v]] = [rr.leaves[w], ll.leaves[v], mx, tmpBlock1+","+tmpBlock2];
				if(ans>mx){
					ans = mx;
					ans_l = ll.leaves[v];
					ans_r = rr.leaves[w];
				}
				
			}

		}
		return {ans:ans,ans_l:ans_l,ans_r:ans_r};
	}

	opt(rt){
		// console.log("processing " + rt.index);
		if(typeof rt.leftChild == 'undefined'){
			this.M[rt.index][rt.index] = [rt.index, rt.index, 0, rt.index+""];
			// console.log("leaf return");
			return;
		}
		var ans;
		var tl = rt.leftChild;
		var tr = rt.rightChild;
		this.opt(tl);
		this.opt(tr);
		
		if(typeof tl.leftChild == 'undefined' && typeof tr.leftChild == 'undefined'){//both leaves
			// console.log("both leaves!!!!!!!!!!!!");
			let lenDiff = this.D[tl.index][tr.index] <= this.avgD ? 
							Math.abs(this.allNodes.get(tl.index) - this.allNodes.get(tr.index)) : 
							10*this.avgD+(Math.abs(this.allNodes.get(tl.index) - this.allNodes.get(tr.index)));
			// this.M[tl.index][tr.index] = {lidx:tl.index, ridx:tr.index,cnt:lenDiff,list:tl.index+','+tr.index};
			// this.M[tr.index][tl.index] = {lidx:tr.index, ridx:tl.index,cnt:lenDiff,list:tr.index+','+tl.index};
			this.M[tl.index][tr.index] = [tl.index, tr.index, lenDiff, tl.index+','+tr.index];
			this.M[tr.index][tl.index] = [tr.index, tl.index, lenDiff, tr.index+','+tl.index];

			return {ans:lenDiff,ans_l:tl.index,ans_r:tr.index};
			// console.timeEnd("dealing " + rt.index);
		} else if(typeof tl.leftChild == 'undefined' && typeof tr.leftChild != 'undefined'){//tl is leaf
			// console.log("tl is leaf!!!!!!!!!!!!");
			// console.time("dealing " + rt.index);	
			// console.log("&&&&&&&&&&&&&&&&&&&&&&&& " + tl.index + " is leaf.");
			var mx = 100000000;
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

			// console.timeEnd("dealing " + rt.index);
			return ans;
		} else if(typeof tr.leftChild == 'undefined' && typeof tl.leftChild != 'undefined'){//tr is leaf
			// console.log("tr is leaf!!!!!!!!!!!!");
			// console.time("dealing " + rt.index);	
			// console.log(tr.index + " is leaf.");
			var mx = 100000000;
			var temp1 = mx, temp2 = mx;
			temp1 = this.count1(tl.leftChild,tl.rightChild,tr);
				if(mx>temp1.ans) {mx=temp1.ans,ans=temp1};
			temp2 = this.count1(tl.rightChild,tl.leftChild,tr);
				if(mx>temp2.ans) {mx=temp2.ans,ans=temp2};

			// console.log("temp answer is: ");
			// console.log(ans.ans);
			// console.log(this.M[ans.ans_l][ans.ans_r].list);

			// console.timeEnd("dealing " + rt.index);
			return ans;
		}else{//both are internal nodes
			// console.log("both internal!!!!!!!!!!!!");
			// console.time("dealing " + rt.index);	
			// console.log("&&&&&&&&&&&&&&&&&&&&&&&& " + tl.index + " and " + tr.index + " are both internal nodes");
			var mx = 100000000;
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

			// console.timeEnd("dealing " + rt.index);
			return ans;	
		}
		
	}
} 
