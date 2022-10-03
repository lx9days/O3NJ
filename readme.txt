Our system has two panels: a control panel (left) and a dashboard (right). The three views from left to right are the O3NJ tree, the distilled hierarchy, and the MDS projection.

When initialized, the NJ tree is optimally ordered and the hierarchy is automatically distilled with default values for our two thresholds. The color of the nodes in the tree and MDS plots encode their class labels in the data. For the distilled cluster tree, we colorize each leaf with the color of class who has outnumbered leaves in the corresponding leaf sequence in NJ tree. Meanwhile, the leaf correspond to all outliers are represented with a red ring.

There are two kinds of interactions: i) thresholding to reorder the NJ tree and redistill the cluster hierarchy; ii) manually cut the NJ tree to investigate the relationship between it and the MDS plot:

i) the two slide bars in the control panel allow to modify the thresholds Alpha and Beta in our algorithm. Alpha is in charge of reordering the NJ tree; Beta for grading persistence. 

ii) There are two slide bars beside and below the NJ tree. The slide bar below NJ tree is for cutting the tree using its geometric representation, use the buttons "-V" and "+V" for  adding/deleting sliders in this slide bar; the slide bar on the left cuts the tree based on its topological features, use "-H", "+H" buttons are for adding/deleting sliders.

Nodes in all three views support brushing & linking interactions.