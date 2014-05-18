/*
	WHHA Map: Flight of the Madisons
	Author: Karl Floersch
*/

var loadedImagesCounter = 0;
var imageList = [];
var c;
var ctx;

var jamesMapLength = jamesMapCoordinates.length;


var mapIconPath = "images/map-icon.gif";

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

	var bannerTop = new Image();
	bannerTop.onload = function(){
		imageLoadedCounter();
	};
	bannerTop.src = "images/banner-top.jpg";
	imageList.push(bannerTop);

	var bannerBottom = new Image();
	bannerBottom.onload = function(){
		imageLoadedCounter();
	};
	bannerBottom.src = "images/banner-bottom.jpg";
	imageList.push(bannerBottom);
});

// When all images are loaded, the magic starts
function imageLoadedCounter(){
	loadedImagesCounter ++;

	if(loadedImagesCounter == 3){
		drawBackground();
		addMarkers();
	}
}

function drawBackground() {
	ctx.drawImage(imageList[0], mapPos.x, (mapPos.y-.13)*c.height, 1.5*c.width, 1.44*c.height);
	ctx.drawImage(imageList[1], 0, 0, c.width, .078 * c.height);
	ctx.drawImage(imageList[2], 0, .9*c.height, c.width, .1*c.height);
}



function addMarkers() {



	for (var i = 0; i < jamesMapLength; i++) {
		var $panelIcon = $('<img>')
			.attr('src', mapIconPath)
			.attr('width', (.045 * c.width))
			.attr('height', (.05 * c.height));
    	var $panelTitle = $('<h5>')
			.css({
				left: (.075 * c.width),
				top: (-.020 * c.height),
			}).append(jamesMapCoordinates[i].title);

		var $contentPanel = $('<span>')
			.attr('class', 'icon-background')
			.attr('id', jamesMapCoordinates[i].id)
			.css({
				left: (jamesMapCoordinates[i].x-mapPos.x) * c.width,
				top: (jamesMapCoordinates[i].y-mapPos.y) * c.height,
				width: (.23 * c.width),
				height: (.05 * c.height),
				"font-size": (.025 * c.height)
			});

		$contentPanel.append($panelIcon);
		$contentPanel.append($panelTitle);
		$("#map-container").append($contentPanel);

		console.log(jamesMapCoordinates[i].x);

		$("#" + jamesMapCoordinates[i].id).click(function(){
			var id = $(this).attr('id');
			for (var i = 0; i < jamesMapLength; i++) {
				if(jamesMapCoordinates[i].id == id){
					moveMapTo(i, -jamesMapCoordinates[i].x + .1, -jamesMapCoordinates[i].y + .2);
				}
			}
		});
	}
				

	// console.log("x " + (jamesMapCoordinates[0].x-mapPos.x) + " y " + (jamesMapCoordinates[0].y-mapPos.y));
	


}

function removeMarkers() {
	for (var i = 0; i < jamesMapLength; i++) {
		$("#" + jamesMapCoordinates[i].id).remove();
	}
}

function moveMapTo(i, xPos, yPos) {
	
	setTimeout(function () {

		var isDone = true;

		if (xPos - mapPos.x > .01){
			mapPos.x += .0005 + (xPos-mapPos.x)*.1;
			isDone = false;
		}else if(xPos - mapPos.x < -.01){
			mapPos.x -= -.0005 - (xPos-mapPos.x)*.1;
			isDone = false;
		}
		if (yPos - mapPos.y > .01){
			mapPos.y += .0005 + (yPos-mapPos.y)*.1;
			isDone = false;
		}else if(yPos - mapPos.y < -.01){
			mapPos.y -= -.0005 - (yPos-mapPos.y)*.1;
			isDone = false;
		}



		ctx.drawImage(imageList[0], mapPos.x*c.width, (mapPos.y-.13)*c.height, 1.5*c.width, 1.44*c.height);
		ctx.drawImage(imageList[1], 0, 0, c.width, .078 * c.height);
		ctx.drawImage(imageList[2], 0, .9*c.height, c.width, .1*c.height);

		for (var j = 0; j < jamesMapLength; j++) {
			$("#"+jamesMapCoordinates[j].id).css("left", (jamesMapCoordinates[j].x+mapPos.x) * c.width);
			$("#"+jamesMapCoordinates[j].id).css("top",(jamesMapCoordinates[j].y+mapPos.y) * c.height);
			console.log(jamesMapCoordinates[j].id);
		}
		if (!isDone){
			moveMapTo(i, xPos, yPos);
		}else{
			for (var j = 0; j < jamesMapLength; j++) {
				if(j != i){
					$("#"+jamesMapCoordinates[j].id).fadeOut();
				}
			}
			showContentBox(i);
		}
	}, 10);
	//console.log(mapPos.x + " " + mapPos.y); 370  x 100
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
