/*
	WHHA Map: Flight of the Madisons
	Author: Karl Floersch
*/

var loadedImagesCounter = 0;
var imageList = [];
var mapsList = [];
var mapsDict = {};
var c;
var ctx;

var jamesMapLength = jamesMapCoordinates.length;


var mapIconPath = "images/map-icon.gif";
var mapImagePath = "images/temp-map.jpg";

var mapPos = {
	"x" : 0,
	"y" : 0
};


$(document).ready(function(){
	// Get the context
	c = $("#map-canvas")[0];
	ctx = c.getContext("2d");
	c.width = window.innerWidth * .9;
    c.height = window.innerWidth * .74;

	// Load the map
	var mapImage = new Image();
	mapImage.onload = function(){
		imageLoadedCounter();
	};
	mapImage.src = "images/temp-map.jpg";
	imageList.push(mapImage);

});

// When all images are loaded, the magic starts
function imageLoadedCounter(){
	loadedImagesCounter ++;

	if(loadedImagesCounter == 1){
		drawBackground();
		addMarkers();
	}
}

function drawBackground() {
	// TODO: Replace this with map class
	var $map = $('<span>')
		.attr('id', "map")
		.css({
			left: mapPos.x*c.width,
			top: (mapPos.y-.13)*c.height,
			width: (1.5*c.width),
			height: (1.44*c.height)
		});

	var $mapImage = $('<img>')
		.attr('src', mapImagePath)
		.attr('id', "map-image")
		.attr('width', (1.5*c.width))
		.attr('height', (1.44*c.height));


	$map.append($mapImage);
	$("#map-container").append($map);

}



function addMarkers() {



	for (var i = 0; i < jamesMapLength; i++) {
		mapsList.push(new MapElement(jamesMapCoordinates[i]));

	}
				

	


}

function removeMarkers() {
	for (var i = 0; i < jamesMapLength; i++) {
		$("#" + jamesMapCoordinates[i].id).remove();
	}
}

function moveMapTo(i, xPos, yPos) {
	
	setTimeout(function () {

		var isDone = false;
		
		if (!isDone){
			moveMapTo(i, xPos, yPos);
		}else{
			// Finished the animation
		}
	}, 10);
}

var fullContentBox = {
	"width" : 0.79,
	"height" : 0.53,
	"steadyVel" : .003,
	"scaledVel" : .08
}

function showContentBox(i) {
	setTimeout(function () {

		var isWidthDone = true;
		var isHeightDone = true;

		var w = $("#"+jamesMapCoordinates[i].id).width();
		var h = $("#"+jamesMapCoordinates[i].id).height();

		// console.log("w: " + w + " contentBoxW: " + fullContentBox.width);

		if(w < fullContentBox.width * c.width){
			w += fullContentBox.steadyVel * c.width + 
				(fullContentBox.width*c.width-w)*fullContentBox.scaledVel;
			isWidthDone = false;
			isHeightDone = false;
		}
		if(h < fullContentBox.height * c.height && isWidthDone){
			h += fullContentBox.steadyVel * c.height + 
			(fullContentBox.height*c.height-h)*fullContentBox.scaledVel;
			isHeightDone = false;
		}

		$("#"+jamesMapCoordinates[i].id).width(w);
		$("#"+jamesMapCoordinates[i].id).height(h);

		
		if (!isWidthDone || !isHeightDone){
			showContentBox(i);
		}else{
		}
	}, 10);
}

window.onresize = function () {
	// TODO: Make it so that all elements scale with the map.
	// scaleMap();
};



// *****	MAP ELEMENT CLASS: USED FOR DISPLAYING HTML OVER THE MAP	***** //
function MapElement (vars)
{
	this.title 	= 	vars.title;
	this.id 	= 	vars.id;
	this.pos 	= 	{"x" : vars.x, "y" : vars.y};
	this.init();
}
MapElement.prototype.init = function ()
{
	var $panelIcon = $('<img>')
		.attr('src', mapIconPath)
		.attr('width', (starIcon.width * c.width))
		.attr('height', (starIcon.height * c.height));

	var $panelTitleContainer = $('<span>')
		.attr('class', "title-text")
		.css({
			left: (.075 * c.width),
			top: (-.020 * c.height)
		});

	var $panelTitle = $('<h5>')
		.css({
			left: (.075 * c.width),
			top: (-.020 * c.height)
		}).append(this.title);

	var $contentPanel = $('<span>')
		.attr('class', 'icon-background')
		.attr('id', this.id)
		.css({
			left: (this.pos.x-mapPos.x) * c.width,
			top: (this.pos.y-mapPos.y) * c.height,
			width: (.23 * c.width),
			height: (.05 * c.height),
			"font-size": (.025 * c.height)
		});

	$contentPanel.append($panelIcon);
	$contentPanel.append($panelTitle);
	$("#map").append($contentPanel);

	$("#" + this.id).click(this.onClk.bind(this));
}
MapElement.prototype.onClk = function()
{
	this.showPanel();
}
MapElement.prototype.showPanel = function ()
{
	var self = this;
	
	setTimeout(function () {
		console.log(this.id);
		var isDone = false;
		mapPos.x -= 10;
		$("#map").css({
			left: mapPos.x
		});
		self.showPanel();

		if (!isDone){
		}else{
			// Finished the animation
		}
	}, 10);
}
MapElement.prototype.hide = function ()
{
}



// ^^^^^	MAP ELEMENT CLASS: USED FOR DISPLAYING HTML OVER THE MAP	^^^^^ //



























// OLD METHODS TO BE DELT WITH
function scaleMap() {
	c.width = window.innerWidth * .9;
    c.height = window.innerWidth * .74;
    drawBackground();
    removeMarkers();
    addMarkers();
}
