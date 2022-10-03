function generateTree(tree_data, usingOrder, usingLabel, layout, treeType, D, rootNum) {
    var childParent = new Array();
    var allWeight = new Array();
    var leafClassify = new Array();
    var leafTaxa = new Array();
    for (var i = 0; i < tree_data.nodes.length; i++) {
        var childParentPair = new Array();
        childParentPair[0] = tree_data.nodes[i].index;
        childParentPair[1] = tree_data.nodes[i].parent;
        childParent.push(childParentPair);

        allWeight[tree_data.nodes[i].index - 1] = tree_data.nodes[i].weight;
        if (tree_data.nodes[i].classify >= 0) {
            leafClassify[tree_data.nodes[i].index - 1] = tree_data.nodes[i].classify;
            leafTaxa[tree_data.nodes[i].index - 1] = tree_data.nodes[i].taxa;
        }
    }
    allWeight.push(0);
    // generate 3 trees
    switch (treeType) {
        case 2:
            tree_label = new Tree(childParent, allWeight, leafClassify, leafTaxa, allWeight.length, usingOrder, D, rootNum);//allWeight.length is the root index
            tree_label.finalTree(usingOrder, usingLabel, layout, treeType);
            findMinMaxInOrder(tree_label.currentLeafOrder, D);
            break;
    }
}

function findMinMaxInOrder(order, D) {
    for (let i = 0, len = order.length - 1; i < len; i++) {
        let tmpd = D[order[i] - 1][order[i + 1] - 1];
        if (tmpd < minDinOrder) {
            minDinOrder = tmpd;
        }
        if (tmpd > maxDinOrder) {
            maxDinOrder = tmpd;
        }
    }
}