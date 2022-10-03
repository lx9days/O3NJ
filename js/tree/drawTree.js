function treeNodeColor(c, x) {
    let color = mapColor(parseInt(c));
    return color;
}

function drawTree(input_tree_root, tree_structure, leaf_amount, tree_container, nodesToMerge = new Array(), leaf_order = new Array(), D = new Array()) {
    var svg = $("#" + tree_container);

    if (document.getElementById(tree_container + "_bg") == null) {
        let bgg = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        bgg.setAttribute("id", tree_container + "_bgg");
        bgg.setAttribute("x", 0);
        bgg.setAttribute("y", 0);
        bgg.setAttribute("width", 500);
        bgg.setAttribute("height", 700);
        svg.append(bgg);

        // let bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        // bg.setAttribute("id", tree_container+"_bg");
        // bg.setAttribute("x", 0);
        // bg.setAttribute("y", 0);
        // bg.setAttribute("width", 500);
        // bg.setAttribute("height", 700);
        // if(tree_container == "ori-tree-container"){
        // 	bg.setAttribute("fill", "#f6f3f7");
        // }else{
        // 	bg.setAttribute("fill", "#fff");
        // }
        // bg.onclick = function(){
        // 	startSelectLeaf = false;
        // 	rangeStart = -1;
        // 	rangeEnd = -1;

        // 	for(let i = 1; i <= leaf_amount; i++){
        // 		$("#scatter"+tree_structure[i].taxa).css("fill", "rgba(0, 0, 0, 0.1)");
        // 		$("#label-ordered-tree-container-node-"+tree_structure[i].index).css("stroke-width", 0);
        // 	}

        // 	rangeStart = rangeEnd = -1;
        // }

        // bgg.append(bg);
    }

    if (deletingNode) {
        svg.empty();
    }

    //draw branches
    drawBranches(input_tree_root, svg, tree_container);
    //draw nodes
    for (var i = 1; i < tree_structure.length; i++) {
        if (document.getElementById(tree_container + "-node-" + tree_structure[i].index) == null) {
            var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute("id", tree_container + "-node-" + tree_structure[i].index);
            if (i <= leaf_amount) {//leaf nodes
                let strokeColor = tree_container == "radial-tree-container" ?
                    treeNodeColor(tree_structure[i].classify, nodeXs.get(tree_structure[i].taxa)) :
                    treeNodeColor(tree_structure[i].classify, tree_structure[i].x);
                let fillColor = tree_container == "ori-tree-container" ? "#f6f3f7" : "#fff";
                circle.setAttribute("class", "leaf");
                circle.setAttribute("r", 6);
                // circle.setAttribute("fill", "#888");
                circle.setAttribute("fill", treeNodeColor(tree_structure[i].classify, tree_structure[i].x))
                circle.setAttribute("stroke", "#000");
                circle.setAttribute("alt", tree_structure[i].index);
                circle.setAttribute("stroke-width", 0);
                circle.onclick = function () {
                    let nodeIndex = this.id.split("-")[this.id.split("-").length - 1];
                     alert(nodeIndex);
                    if (startSelectLeaf) {
                        startSelectLeaf = false;
                        rangeEnd = nodeIndex;
                        highlightSelection(leaf_order, tree_structure);
                    } else {
                        startSelectLeaf = true;
                        rangeStart = nodeIndex;
                    }
                }
                circle.onmouseover = function () {
                    let nodeIndex = parseInt(this.id.split("-")[this.id.split("-").length - 1]);
                    $("#label-ordered-tree-container-node-" + tree_structure[nodeIndex].index).css({
                        "stroke": "#000",
                        "stroke-width": 2,
                    })
                    // console.log("#scatter"+tree_structure[nodeIndex].taxa);
                    // console.log(tree_structure[nodeIndex]);
                    // console.log($("#scatter"+tree_structure[nodeIndex].taxa));
                    $("#scatter" + tree_structure[nodeIndex].taxa).css("fill", "rgba(0, 0, 0, 0.8)");
                }
                circle.onmouseout = function () {
                    let nodeIndex = parseInt(this.id.split("-")[this.id.split("-").length - 1]);
                    $("#label-ordered-tree-container-node-" + tree_structure[nodeIndex].index).css({
                        "stroke-width": 0,
                    })
                    $("#scatter" + tree_structure[nodeIndex].taxa).css("fill", "rgba(0, 0, 0, 0.1)");
                }
            } else {
                circle.setAttribute("class", "internal");
                if (changingRoot) {
                    circle.setAttribute("r", 3);
                    circle.setAttribute("fill", "#555");
                    circle.setAttribute("stroke", "#fff");
                    circle.setAttribute("stroke-width", 1);
                } else {
                    if (i == tree_structure.length - 1) {
                        circle.setAttribute("r", 3);
                        circle.setAttribute("fill", "#fff");
                        circle.setAttribute("stroke", "#888");
                        circle.setAttribute("stroke-width", 2);
                    } else {
                        circle.setAttribute("r", 3);
                        circle.setAttribute("fill", "#eee");
                        circle.setAttribute("stroke-width", 0);
                    }
                }

                circle.setAttribute("alt", tree_structure[i].index);
            }
            circle.setAttribute("cx", tree_structure[i].x);
            circle.setAttribute("cy", tree_structure[i].y);

            svg.append(circle);
        } else {
            var circle = document.getElementById(tree_container + "-node-" + tree_structure[i].index);
            $("#" + tree_container + "-node-" + tree_structure[i].index).css({
                "stroke-width": 0,
            })
            d3.select(circle).transition()
                .duration(1500)
                .ease(d3.easeCubic)
                .attr("cx", tree_structure[i].x)
                .attr("cy", tree_structure[i].y)
                .attr("fill", function () {
                    if (i <= leaf_amount) {
                        let strokeColor = tree_container == "radial-tree-container" ?
                            treeNodeColor(tree_structure[i].classify, nodeXs.get(tree_structure[i].taxa)) :
                            treeNodeColor(tree_structure[i].classify, tree_structure[i].x);
                        return strokeColor;
                    }
                    return "#888";
                });
        }
    }

    //draw signs
    if (leaf_amount < showTxt) {
        for (var i = 1; i <= leaf_amount; i++) {
            if (document.getElementById(tree_container + "-txt" + tree_structure[i].index) == null) {
                var txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                txt.setAttribute("id", tree_container + "-txt" + tree_structure[i].index);
                txt.setAttribute("class", "text " + tree_structure[i].index);
                txt.setAttribute("x", tree_structure[i].x + 10);
                txt.setAttribute("y", tree_structure[i].y + 4);
                txt.setAttribute("fill", "#888");
                txt.setAttribute("font-family", "Arial");
                txt.setAttribute("style", "font-size:10px;");
                txt.innerHTML = tree_structure[i].taxa;
                svg.append(txt);
            } else {
                var txt = document.getElementById(tree_container + "-txt" + tree_structure[i].index);
                d3.select(txt).transition()
                    .duration(1500)
                    .ease(d3.easeCubic)
                    .attr("x", tree_structure[i].x + 10)
                    .attr("y", tree_structure[i].y + 4);
            }
        }
    }

}

function highlightSelection(leaf_order, tree_structure) {
    let startIndex = leaf_order.indexOf(parseInt(rangeStart));
    let endIndex = leaf_order.indexOf(parseInt(rangeEnd));
    let tmpMin = Math.min(startIndex, endIndex);
    let tmpMax = Math.max(startIndex, endIndex);

    let highlightParrel = new Array();
    for (let i = tmpMin; i <= tmpMax; i++) {
        let nodeIndex = leaf_order[i];
        highlightParrel.push(nodeIndex);
        $("#scatter" + tree_structure[nodeIndex].taxa).css("fill", "rgba(0, 0, 0, 0.8)");
        $("#label-ordered-tree-container-node-" + tree_structure[nodeIndex].index).css("stroke-width", 2);
    }
}

function animateTree(tree_internal, tree_leaf, tree_branch, tree_text, tree_structure, layout) {
    var circleDivide = 1000;
    for (var i = 0; i < tree_branch.length; i++) {
        $(tree_branch[i]).fadeOut(0);
    }
    for (var i = 0; i < tree_text.length; i++) {
        $(tree_text[i]).fadeOut(0);
    }
    for (var i = 0; i < tree_internal.length; i++) {
        $(tree_internal[i]).fadeOut(0);
        var tree_structure_index = tree_internal[i].getAttribute("alt");
        var tree_structure_x = tree_structure[tree_internal[i].getAttribute("alt")].x;
        var tree_structure_y = tree_structure[tree_internal[i].getAttribute("alt")].y;

        $(tree_internal[i]).attr("cx", tree_structure_x);
        $(tree_internal[i]).attr("cy", tree_structure_y);
        if (typeof (tree_branch[tree_structure_index]) != "undefined") {
            var anc = tree_structure[tree_structure_index].ancestor;
            var self = tree_structure[tree_structure_index];
            if (anc.x < self.x) {//ancestor is on the left side of children
                $(tree_branch[tree_structure_index]).attr("points", anc.x + "," + anc.y + " " + anc.x + "," + self.y + " " + self.x + "," + self.y);
            } else { //ancestor is on the right side
                $(tree_branch[tree_structure_index]).attr("points", self.x + "," + self.y + " " + anc.x + "," + self.y + " " + anc.x + "," + anc.y);
            }
        }
    }

    setTimeout(function () {
        for (var i = 0; i < tree_leaf.length; i++) {
            var tree_structure_index = tree_leaf[i].getAttribute("alt");
            var tree_structure_x = tree_structure[tree_leaf[i].getAttribute("alt")].x;
            var tree_structure_y = tree_structure[tree_leaf[i].getAttribute("alt")].y;
            $(tree_leaf[i]).animate({ cx: tree_structure_x }, 700);
            $(tree_leaf[i]).animate({ cy: tree_structure_y }, 700);
            if (typeof (tree_text[tree_structure_index]) != "undefined") {
                $(tree_text[tree_structure_index]).attr("x", tree_structure_x + 5);
                $(tree_text[tree_structure_index]).attr("y", tree_structure_y + 4);
            }
            if (typeof (tree_branch[tree_structure_index]) != "undefined") {
                var anc = tree_structure[tree_structure_index].ancestor;
                var self = tree_structure[tree_structure_index];
                $(tree_branch[tree_structure_index]).attr("points", anc.x + "," + anc.y + " " + anc.x + "," + self.y + " " + self.x + "," + self.y);
            }
        }
    }, 100);
    setTimeout(function () {
        for (var i = 0; i < tree_branch.length; i++) {
            $(tree_branch[i]).fadeIn(200);
        }
        for (var i = 0; i < tree_text.length; i++) {
            $(tree_text[i]).fadeIn(200);
        }
        for (var i = 0; i < tree_internal.length; i++) {
            $(tree_internal[i]).fadeIn(200);
        }
    }, 1700);
}

function drawBranches(t, _svg, tree_container) {
    if (t.leftChild != "" && t.rightChild != "" && typeof (t.leftChild) != "undefined" && typeof (t.rightChild) != "undefined") {
        //judge if the branch is already in the svg
        if (document.getElementById(tree_container + "-branch" + t.leftChild.index) == null) {
            //this branch is not in svg
            var polyLineLeft = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            polyLineLeft.setAttribute("class", "branch");
            polyLineLeft.setAttribute("id", tree_container + "-branch" + t.leftChild.index);
            polyLineLeft.setAttribute("points", t.x + "," + t.y + " " + t.x + "," + t.leftChild.y + " " + t.leftChild.x + "," + t.leftChild.y);
            polyLineLeft.setAttribute("fill", "none");
            polyLineLeft.setAttribute("stroke", "#aaa");
            polyLineLeft.setAttribute("stroke-width", 1);
            polyLineLeft.setAttribute("display", "block");
            _svg.append(polyLineLeft);
        } else {
            var polyLineLeft = document.getElementById(tree_container + "-branch" + t.leftChild.index);
            d3.select(polyLineLeft).transition()
                .duration(1500)
                .ease(d3.easeCubic)
                .attr("points", t.x + "," + t.y + " " + t.x + "," + t.leftChild.y + " " + t.leftChild.x + "," + t.leftChild.y);
        }

        if (document.getElementById(tree_container + "-branch" + t.rightChild.index) == null) {
            var polyLineRight = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            polyLineRight.setAttribute("class", "branch");
            polyLineRight.setAttribute("id", tree_container + "-branch" + t.rightChild.index);
            polyLineRight.setAttribute("points", t.x + "," + t.y + " " + t.x + "," + t.rightChild.y + " " + t.rightChild.x + "," + t.rightChild.y);
            polyLineRight.setAttribute("fill", "none");
            polyLineRight.setAttribute("stroke", "#aaa");
            polyLineRight.setAttribute("stroke-width", 1);
            polyLineRight.setAttribute("display", "block");
            _svg.append(polyLineRight);
        } else {
            var polyLineRight = document.getElementById(tree_container + "-branch" + t.rightChild.index);
            d3.select(polyLineRight).transition()
                .duration(1500)
                .ease(d3.easeCubic)
                .attr("points", t.x + "," + t.y + " " + t.x + "," + t.rightChild.y + " " + t.rightChild.x + "," + t.rightChild.y);
        }

        drawBranches(t.leftChild, _svg, tree_container);
        drawBranches(t.rightChild, _svg, tree_container);
    }
}

function drawDistilled(distill_tree_structure) {
    var svg = $("#distill-container");
    svg.empty();
    //draw branches
    drawDistillBranch(distill_tree_structure[0], svg);

    //draw nodes
    let rootRadius = 14, minRadius = 6;
    for (var i = 0; i < distill_tree_structure.length; i++) {
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute("id", "distill-node-" + distill_tree_structure[i].index);
        circle.setAttribute("r", minRadius + (rootRadius - minRadius) * distill_tree_structure[i].leaves.length / distill_tree_structure[0].leaves.length);
        circle.setAttribute("cx", distill_tree_structure[i].x);
        circle.setAttribute("cy", distill_tree_structure[i].y);

        //assign color
        if (i == 0) {//root
            circle.setAttribute("fill", "#000");
        } else if (i == 1) {//outlier
            circle.setAttribute("fill", "#fff");
            circle.setAttribute("stroke", "#f00");
            circle.setAttribute("stroke-width", 3);
        } else {
            if (distill_tree_structure[i].children.length == 0) {//leaves
                circle.setAttribute("fill", treeNodeColor(distill_tree_structure[i].classify, distill_tree_structure[i].x));
            } else {//internal
                circle.setAttribute("fill", "#bbb");
            }
        }

        //assign mouse listener
        circle.onmouseover = function () {
            let r = Math.random()*255;
            let g = Math.random()*255;
            let b = Math.random()*255;
            let rgb = r+","+g+","+b;
            let colorMap = ["black", "purple", "brown", "orange", "green", "red", "steelblue", "Cyan", "blue", "Fuchisis", "LawnGreen"];
            let rand = Math.floor(Math.random()*11);
            let nodeIndex = parseInt(this.id.split("-")[this.id.split("-").length - 1]);
            if (nodeIndex == 1) {
                for (let i = 0; i < distill_tree_structure[nodeIndex].leaves.length; i++) {
                    let leafId = distill_tree_structure[nodeIndex].leaves[i];
                    $("#label-ordered-tree-container-node-" + leafId).css({
                        "stroke": "#f00",
                        "stroke-width": 2,
                    })
                    $("#scatterA" + leafId).css("fill", "rgba(0,0,0, 0.8)");
                    // $("#scatterA" + leafId).css("fill", colorMap[rand]);
                    //$("#scatterA" + leafId).css("stroke", "none");
                }
            } else {
                for (let i = 0; i < distill_tree_structure[nodeIndex].leaves.length; i++) {
                    let leafId = distill_tree_structure[nodeIndex].leaves[i];
                    $("#label-ordered-tree-container-node-" + leafId).css({
                        "stroke": "#000",
                        "stroke-width": 2,
                    })
                    $("#scatterA" + leafId).css("fill", "rgba(0,0,0, 0.8)");
                    // $("#scatterA" + leafId).css("fill", colorMap[rand]);
                    //$("#scatterA" + leafId).css("stroke", "none");
                }
            }
        }
        circle.onmouseout = function () {
            let nodeIndex = parseInt(this.id.split("-")[this.id.split("-").length - 1]);
            if (nodeIndex == 1) {
                for (let i = 0; i < distill_tree_structure[nodeIndex].leaves.length; i++) {
                    let leafId = distill_tree_structure[nodeIndex].leaves[i];
                    $("#label-ordered-tree-container-node-" + leafId).css({
                        "stroke": "none",
                        "stroke-width": 2,
                    })
                    $("#scatterA" + leafId).css("fill", "rgba(0,0,0, 0.1)");
                    // $("#scatterA" + leafId).css("fill", colorMap[rand]);
                    //$("#scatterA" + leafId).css("stroke", "none");
                }
            } else {
                for (let i = 0; i < distill_tree_structure[nodeIndex].leaves.length; i++) {
                    let leafId = distill_tree_structure[nodeIndex].leaves[i];
                    $("#label-ordered-tree-container-node-" + leafId).css({
                        "stroke": "none",
                        "stroke-width": 2,
                    })
                    $("#scatterA" + leafId).css("fill", "rgba(0,0,0, 0.1)");
                    // $("#scatterA" + leafId).css("fill", colorMap[rand]);
                    //$("#scatterA" + leafId).css("stroke", "none");
                }
            }
        }
        circle.onclick = function () {
            let nodeIndex = parseInt(this.id.split("-")[this.id.split("-").length - 1]);
            for (let i = 0; i < distill_tree_structure[nodeIndex].leaves.length; i++) {
                let leafId = distill_tree_structure[nodeIndex].leaves[i];
                $("#label-ordered-tree-container-node-" + leafId).css({
                    "stroke-width": 0,
                })
                $("#scatterA" + leafId).css("fill", "rgba(0, 0, 0, 0.1)");
            }
        }

        svg.append(circle);
    }
}

function drawDistillBranch(t, _svg) {
    if (t.children.length > 0) {
        for (let i = 0; i < t.children.length; i++) {
            var polyLineChild = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            polyLineChild.setAttribute("class", "branch");
            polyLineChild.setAttribute("id", "distill-branch" + t.children[i].index);
            polyLineChild.setAttribute("points", t.x + "," + t.y + " " + t.x + "," + t.children[i].y + " " + t.children[i].x + "," + t.children[i].y);
            polyLineChild.setAttribute("fill", "none");
            polyLineChild.setAttribute("stroke", "#bbb");
            polyLineChild.setAttribute("stroke-width", 2);
            polyLineChild.setAttribute("display", "block");
            _svg.append(polyLineChild);

            drawDistillBranch(t.children[i], _svg);
        }
    }
}