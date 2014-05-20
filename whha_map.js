/*
	WHHA Map: Flight of the Madisons
	Author: Karl Floersch
*/

var loadedImagesCounter = 0;
var mapImage;
var map;
var mapsList = [];
var mapsDict = {};
var c;
var ctx;

var jamesMapLength = jamesMapCoordinates.length;


var mapIconPath = "images/map-icon.gif";
var mapImagePath = "images/map.gif";

var startingMapPos = {
	"x" : 0,
	"y" : -.13
};


$(document).ready(function(){
	// Get the context
	c = $("#map-canvas")[0];
	ctx = c.getContext("2d");
	c.width = 960;
    c.height = c.width * .75;

	// Load the map
	mapImage = new Image();
	mapImage.onload = function(){
		imageLoadedCounter();
	};
	mapImage.src = mapImagePath;

});

// When all images are loaded, the magic starts
function imageLoadedCounter(){
	loadedImagesCounter ++;

	if(loadedImagesCounter == 1){
		addMap();
		addMapDiv();
		addMarkers();
	}
}

function addMap() {
	map = new Map(startingMapPos.x, startingMapPos.y);
	console.log(map);
	map.draw();

}

function addMapDiv() {
	var $map = $('<span>')
		.attr('id', "map")
		.css({
			left: map.x*c.width,
			top: (map.y)*c.height,
			width: (1.5*c.width),
			height: (1.44*c.height)
		});
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





// *****	MAP CLASS: USED DRAWING A MAP AND PATHS TO THE CANVAS	***** //
function Map (x, y)
{
	this.x 	= 	x;
	this.y 	= 	y;
}
Map.prototype.draw = function ()
{
	$("#map").css({
		left: this.x*c.width,
		top: this.y*c.height
	});

	ctx.drawImage(mapImage, this.x*c.width, (this.y)*c.height, 1.5*c.width, 1.44*c.height);

	// TODO: Add paths that are drawn too.
	function drawShape(ctx, xoff, yoff) {
		ctx.beginPath();
		ctx.moveTo(219 + xoff, 88 + yoff);
		ctx.bezierCurveTo(226 + xoff, 136 + yoff, 158 + xoff, 209 + yoff, 140 + xoff, 197 + yoff);
		ctx.stroke();
	}
}
// ^^^^^	MAP CLASS: USED DRAWING A MAP AND PATHS TO THE CANVAS	^^^^^ //




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
			left: (this.pos.x-map.x) * c.width,
			top: (this.pos.y-map.y) * c.height,
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
		var isDone = false;
		map.x -= .008;
		map.draw();

		if (!isDone){
			self.showPanel();
		}else{
			// Finished the animation
		}
	}, 5);
}
MapElement.prototype.hide = function ()
{
}
// ^^^^^	MAP ELEMENT CLASS: USED FOR DISPLAYING HTML OVER THE MAP	^^^^^ //



























// OLD METHODS TO BE DELT WITH
function scaleMap() {
	c.width = window.innerWidth * .9;
    c.height = window.innerWidth * .74;
    removeMarkers();
    addMarkers();
}

window.onresize = function () {
	// TODO: Make it so that all elements scale with the map.
	// scaleMap();
};

