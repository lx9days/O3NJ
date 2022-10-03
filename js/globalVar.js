var tree_ori;
var tree_distance;
var tree_label;
var radial_tree;
var HC;
var width = 960;
var height = 1000;//620
var dashboardWidth = 0;
var scatterplotWidth = 0;
var scatterplotHeight = 0;
var treeContainerWidth = 0;
var distillTreeContainerWidth = 0;
var slideBarMarginLeft = 30;
var viewMargin = 15;

var paddingHeight = 40; //the content is 20px away from the top and bottom border
var paddingWidth = 40;
//var nodeColors = [d3.hsl(207, 0.68, 0.50), d3.hsl(36, 0.86, 0.57), d3.hsl(139, 0.70, 0.45), "#743699","#ff5600", "#ff9f00", "#0f4fa8", "#00aa72", "#ff8040", "#bf8930", "#284c7e", "#207f60", "#bf6030", "#ffb740"];
// var nodeColors = ["black", "orange", "Green", "brown", "red", "steelblue", "purple", "yellow", "Cyan", "Fuchisis", "blue"];
var nodeColors = ["#FFFFE0", "purple", "SaddleBrown", "orange", "green", "red", "steelblue", "Cyan", "blue", "#5D478B", "LawnGreen", "#FF34B3",
"#FFDEAD", "#8B7E66", "#FF6A6A", "#008B8B", "#FFB5C5", "#EE9A49", "#FF00FF", "#FFE4E1", "#836FFF", 
"#FFFFE0", "#CD6600", "#C0FF3E"];
var usingOrdering = true;
var usingLabel = true;
var changingRoot = false;
var maxDepth = 0;
var shownLabel = true;

var minRadialX = 0, maxRadialX = 0, minRadialY = 0, maxRadialY = 0;

var currentDataSet;
var DBackUp;
var dataAttributes = -1; //for drawing data matrix, the number of attibutes
var dataAttributeNames = new Array();

var rooting = 0;//0->rand  1->mid
var clusterDistance = new Map();
var nodeXs = new Map();

var addingNode = false;
var delIdx = -1;
var deletingNode = false;

var addNodeX = 0;
var addNodeY = 0;

var showTxt = 80;
var jnd = 16;

var gridiantRadius = 0;
var minDinOrder = 1000;
var maxDinOrder = -1000;
var minDColor = 50;
var dColorRange = 200;
var barPosiX = 10;
var barWidth = 500;

var bindWeight = 10000;

var startSelectLeaf = false;
var rangeStart = -1;
var rangeEnd = -1;

//for test
var printIndex = 19;

var bigValue = 100;

//for slide bar
var slidingId = "";
var vSlidingId = "";
var sliderX = new Map();
sliderX.set("0", 0);
var vSliderY = new Map();
vSliderY.set("0", 0);
var sliderNum = 1;//start with one slider
var vSliderNum = 1;//start with one slider
var determinedClusterNum = 0;
var selectedGrids = new Map();

// var dataIndex = 0;
var orderThreshHold = 0.1;
var numOrdering = 0;

var distillIdx = 0;

var showTips0 = false;
var isMouseDown0 = false;
var showTips1 = false;
var isMouseDown1 = false;
var showTips2 = false;
var isMouseDown2 = false;
var readme = "<h2>README</h2>Our system has four panels : O3NJ tree, the distilled hierarchy, MDS projection, and a control panel(right bottom corner)<br/><br/>"+
			"When initialized, the NJ tree is optimally ordered and the hierarchy is "+
			"automatically distilled with default values for our three thresholds. "+
			"The color of the nodes in the tree and MDS plots encode their ground truth class labels "+
			"in the data. For the distilled cluster tree, we colorize each leaf with the "+
			"color of class who has outnumbered leaves in the corresponding leaf sequence "+
			"in NJ tree. Meanwhile, the leaf correspond to all outliers are represented with "+
			"a red ring. <br/><br/>"+
			"Interactions: "+
			"<ol><li>Thresholding to reorder the NJ tree and redistill the cluster hierarchy with sliders on control panel;</li>"+
			"<li>Nodes in all three views support brushing & linking interactions.</li>";
var tip0 = "slide this to re-cut the tree, and see changes of outliers.";
var tip1 = "slide this to reorder the tree.";
var tip2 = "slide this to redistill the cluster tree";