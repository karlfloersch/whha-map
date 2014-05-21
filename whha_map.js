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
var locationSelected = false;

var jamesMapLength = jamesMapCoordinates.length;


var mapIconPath = "images/map-icon.gif";
var selectedMapIconPath = "images/map-icon-selected.gif";
var exitIconPath = "images/exit-button.gif";
var videoIconPath = "images/picon-video.gif";
var audioIconPath = "images/picon-audio.gif";
var slidesIconPath = "images/picon-slides.gif";
var summaryIconPath = "images/picon-summary.gif";
var googleMapIconPath = "images/picon-map.gif";
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
    c.height = c.width * .77;

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
		mapsList.push(new MapElement(jamesMapCoordinates[i],jamesMapInformation[i]));

	}
}

function hideMarkers(exception_id){
	var i = 0;
	for(i = 0; i < jamesMapLength; ++i){
		if(mapsList[i].id != exception_id){
			mapsList[i].hide();
		}
	}
}

function showMarkers(exception_id){
	var i = 0;
	for(i = 0; i < jamesMapLength; ++i){
		if(mapsList[i].id != exception_id){
			mapsList[i].show();
		}
	}
}

function removeMarkers() {
	for (var i = 0; i < jamesMapLength; i++) {
		$("#" + jamesMapCoordinates[i].id).remove();
	}
}

var isMapMoving = false;
function moveMapTo(xPos, yPos) {
	setTimeout(function () {
		var isDone = true;

		if (xPos - map.x > .01){
			map.x += .0005 + (xPos-map.x)*.1;
			isDone = false;
		}else if(xPos - map.x < -.01){
			map.x -= -.0005 - (xPos-map.x)*.1;
			isDone = false;
		}
		if (yPos - map.y > .01){
			map.y += .0005 + (yPos-map.y)*.1;
			isDone = false;
		}else if(yPos - map.y < -.01){
			map.y -= -.0005 - (yPos-map.y)*.1;
			isDone = false;
		}

		map.draw();
		
		if (!isDone){
			moveMapTo(xPos, yPos);
			isMapMoving = true;
		}else{
			isMapMoving = false;
		}
	}, 10);	
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
function MapElement (basicInfo, panelInfo)
{
	this.title 	= 	basicInfo.title;
	this.id 	= 	basicInfo.id;
	this.imgId	= 	basicInfo.id + "-img";
	this.panelId = 	basicInfo.id + "-panel";
	this.slidersId = basicInfo.id + "-content"
	this.x 		=	basicInfo.x;
	this.y 		= 	basicInfo.y;
	this.sliderX = 	0;
	this.sliderY = 	0.052;
	this.isSliding = false;
	this.panelInfo = panelInfo;
	this.init();
}
MapElement.prototype.init = function ()
{
	var $panelIcon = $('<img>')
		.attr('id', this.imgId)
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
			left: (this.x-map.x) * c.width,
			top: (this.y-map.y) * c.height,
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
	if(!locationSelected){
		this.changeSelected(true);
		this.moveMapToPanel();
		locationSelected = true;
	}
	
}
MapElement.prototype.showPanel = function ()
{
	var self = this;

	setTimeout(function () {

		var isWidthDone = true;
		var isHeightDone = true;

		// var $myElement = $("#"+self.id);

		var w = $("#"+self.id).width();
		var h = $("#"+self.id).height();

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

		$("#"+self.id).width(w);
		$("#"+self.id).height(h);

		
		if (!isWidthDone || !isHeightDone){
			self.showPanel();
		}else{
			// self.hidePanel();
		}
	}, 10);

}
MapElement.prototype.moveMapToPanel = function ()
{
	var self = this;
	xPos = -this.x + .07;
	yPos = -this.y + .03;

	setTimeout(function () {
		var isDone = true;

		if (xPos - map.x > .01){
			map.x += .0005 + (xPos-map.x)*.1;
			isDone = false;
		}else if(xPos - map.x < -.01){
			map.x -= -.0005 - (xPos-map.x)*.1;
			isDone = false;
		}
		if (yPos - map.y > .01){
			map.y += .0005 + (yPos-map.y)*.1;
			isDone = false;
		}else if(yPos - map.y < -.01){
			map.y -= -.0005 - (yPos-map.y)*.1;
			isDone = false;
		}

		map.draw();

		if (!isDone){
			self.moveMapToPanel();
		}else{
			self.buildContentPane();
			self.showPanel();
		}
	}, 10);
}
MapElement.prototype.moveMapTo = function (xPos, yPos)
{
	var self = this;

	setTimeout(function () {
		var isDone = true;

		if (xPos - map.x > .01){
			map.x += .0005 + (xPos-map.x)*.1;
			isDone = false;
		}else if(xPos - map.x < -.01){
			map.x -= -.0005 - (xPos-map.x)*.1;
			isDone = false;
		}
		if (yPos - map.y > .01){
			map.y += .0005 + (yPos-map.y)*.1;
			isDone = false;
		}else if(yPos - map.y < -.01){
			map.y -= -.0005 - (yPos-map.y)*.1;
			isDone = false;
		}

		map.draw();

		if (!isDone){
			self.moveMapTo(xPos, yPos);
		}else{
			locationSelected = false;
		}
	}, 10);
}
MapElement.prototype.closePanel = function ()
{
	this.hidePanel();
}
MapElement.prototype.hidePanel = function ()
{
	var self = this;

	setTimeout(function () {

		var isWidthDone = true;
		var isHeightDone = true;

		// var $myElement = $("#"+self.id);

		var w = $("#"+self.id).width();
		var h = $("#"+self.id).height();

		if(h > smallContentBox.height * c.height){
			h += smallContentBox.steadyVel * c.height + 
			(smallContentBox.height*c.height-h)*smallContentBox.scaledVel;
			isHeightDone = false;
			isWidthDone = false;
		}

		if(w > smallContentBox.width * c.width  && isHeightDone){
			w += smallContentBox.steadyVel * c.width + 
				(smallContentBox.width*c.width-w)*smallContentBox.scaledVel;
			isWidthDone = false;
		}
		

		$("#"+self.id).width(w);
		$("#"+self.id).height(h);

		
		if (!isWidthDone || !isHeightDone){
			self.hidePanel();
		}else{
			self.changeSelected(false);
			self.destroyContentPane();
			self.moveMapTo(startingMapPos.x, startingMapPos.y);

		}
	}, 10);
}
MapElement.prototype.changeSelected = function (selected)
{
	if(selected){
		$("#"+this.imgId).attr("src", selectedMapIconPath);
		$("#"+this.id).css({
			'background-color'	: '#283573',
			'background-image'	: 'none',
			'color'	   			: '#ffffff'
		});
		hideMarkers(this.id);
	}else{
		$("#"+this.imgId).attr("src", mapIconPath);
		$("#"+this.id).css({
			'background-image'	: 'url("images/tile-paper-bg.jpg")',
			'color'				: '#444444'
		});
		showMarkers();

	}
}
MapElement.prototype.hide = function ()
{
	$("#"+this.id).hide(300);
}
MapElement.prototype.show = function ()
{
	$("#"+this.id).show(300);
}
// THIS MAY BE AN INSANE METHOD
MapElement.prototype.buildContentPane = function ()
{
	var $contentPanelBody = $('<span>')
		.attr('id', this.panelId);

	var $exitButton = $('<img>')
		.attr('src', exitIconPath)
		.attr('width', (exitIcon.width * c.width))
		.attr('height', (exitIcon.height * c.height))
		.css({
			left : (exitIcon.left * c.width),
			top : (exitIcon.top * c.height)
		});
	$exitButton.click(this.closePanel.bind(this));
	$contentPanelBody.append($exitButton);

	$("#" + this.id).append($contentPanelBody);


	// FIRST BUILD THE SLIDER BUTTONS
	this.buildSliderButtons();

	// NEXT BUILD THE CONTENT WINDOWS
	this.buildSliderWindows();
	


	
}
MapElement.prototype.buildSliderWindows = function ()
{
	var $panelBody = $('<span>')
		.attr('id', this.slidersId)
		.css({
			top: this.sliderY * c.height,
			width : (slider.width * c.width),
			height : (slider.height * c.height),
			'background-color'	: '#f5f3ea',
			position : 'absolute'
		});


	// **** Video Slide **** //
	var $videoSlide = $('<span>')
	.css({
		left : (this.sliderX + 0*slider.offset) * c.width,
		position : "absolute"
	});

	var videoHTML = '<iframe width="'+ videoPlayer.width * c.width +
	'" height="' + videoPlayer.height * c.height +
	'" src="' + this.panelInfo.video_src +
	'" frameborder="0" allowfullscreen></iframe>';

	setTimeout(function () {
		$videoSlide.append(videoHTML);
	}, 700);

	$panelBody.append($videoSlide);
	// ^^^^ Video Slide ^^^^ //



	// **** Audio Slide **** //
	var $audioSlide = $('<span>')
	.css({
		left : (this.sliderX  + 1*slider.offset) * c.width,
		width : (slider.width * c.width),
		height : (slider.height * c.height),
		'background-color'	: '#f5f3ea',
		position : "absolute"
	});

	var audioHTML = '<iframe width="'+ videoPlayer.width * c.width +
	'" height="' + videoPlayer.height * c.height +
	'" src="' + this.panelInfo.audio_src +
	'" frameborder="0" allowfullscreen></iframe>';

	setTimeout(function () {
		$audioSlide.append(audioHTML);
	}, 750);

	$panelBody.append($audioSlide);
	// ^^^^ Audio Slide ^^^^ //

	// **** Slides Slide **** //
	var $slidesSlide = $('<span>')
	.css({
		left : (this.sliderX  +2*slider.offset) * c.width,
		width : ((slider.width - 2*slider.paddingSize) * c.width),
		height : ((slider.height  - 2*slider.paddingSize) * c.height),
		'background-color'	: '#f5f3ea',
		'padding-x' : (slider.paddingSize * c.width),
		'padding-y' : (slider.paddingSize * c.height),
		"overflow-y" : "scroll",
		padding : "10px",
		color : "#222222",
		position : "absolute"
	});

	$slidesSlide.append(this.panelInfo.summary_text);

	$panelBody.append($slidesSlide);
	// ^^^^ Slides Slide ^^^^ //



	// **** Summary Slide **** //
	var $slidesSlide = $('<span>')
	.css({
		left : (this.sliderX  +3*slider.offset) * c.width,
		width : ((slider.width - 2*slider.paddingSize) * c.width),
		height : ((slider.height  - 2*slider.paddingSize) * c.height),
		'background-color'	: '#f5f3ea',
		'padding-x' : (slider.paddingSize * c.width),
		'padding-y' : (slider.paddingSize * c.height),
		"overflow-y" : "scroll",
		padding : "10px",
		color : "#222222",
		position : "absolute"
	});

	$slidesSlide.append(this.panelInfo.summary_text);

	$panelBody.append($slidesSlide);
	// ^^^^ Summary Slide ^^^^ //


	// **** Map Slide **** //
	var $mapSlide = $('<span>')
	.css({
		left : (this.sliderX + 4*slider.offset) * c.width,
		position : "absolute"
	});

	var mapHTML = '<iframe width="'+ videoPlayer.width * c.width +
	'" height="' + videoPlayer.height * c.height +
	'" src="' + this.panelInfo.map_src +
	'" frameborder="0" style="border:0"></iframe>';

	setTimeout(function () {
		$mapSlide.append(mapHTML);
	}, 900);

	$panelBody.append($mapSlide);
	// ^^^^ Map Slide ^^^^ //


	$("#"+this.panelId).append($panelBody);


}
MapElement.prototype.moveSlider = function (slideIndex)
{
	var self = this;

	xPos = -slider.offset * slideIndex;

	self.isSliding = true;

	setTimeout(function () {
		var isDone = true;

		if (xPos - self.sliderX > .005){
			self.sliderX += .007 + (xPos-self.sliderX)*.1;
			isDone = false;
		}else if(xPos - self.sliderX < -.005){
			self.sliderX -= .007 - (xPos-self.sliderX)*.1;
			isDone = false;
		}else{
			self.sliderX = xPos;
		}

		self.drawSliders();
		
		if (!isDone){
			self.moveSlider(slideIndex)
		}else{
			// I'm done!
			self.isSliding = false;
		}
	}, 10);
}
MapElement.prototype.buildSliderButtons = function ()
{
	var $contentPanelBody = $("#"+this.panelId);

	var $videoButton = $('<img>')
		.attr('src', videoIconPath)
		.attr('width', (videoIcon.width * c.width))
		.attr('height', (videoIcon.height * c.height))
		.css({
			left : (videoIcon.left * c.width),
			top : (videoIcon.top * c.height)
		});

	// $videoButton.click(this.moveSlider.bind(this, slideIndex = 0));

	$videoButton.click(function(){
		if(!this.isSliding)
			this.moveSlider(0);
	}.bind(this));

	$contentPanelBody.append($videoButton);

	var $audioButton = $('<img>')
		.attr('src', audioIconPath)
		.attr('width', (audioIcon.width * c.width))
		.attr('height', (audioIcon.height * c.height))
		.css({
			left : (audioIcon.left * c.width),
			top : (audioIcon.top * c.height)
		});

	$audioButton.click(function(){
		if(!this.isSliding)
			this.moveSlider(1);
	}.bind(this));
	$contentPanelBody.append($audioButton);

	var $slidesButton = $('<img>')
		.attr('src', slidesIconPath)
		.attr('width', (slidesIcon.width * c.width))
		.attr('height', (slidesIcon.height * c.height))
		.css({
			left : (slidesIcon.left * c.width),
			top : (slidesIcon.top * c.height)
		});

	$slidesButton.click(function(){
		if(!this.isSliding)
			this.moveSlider(2);
	}.bind(this));
	$contentPanelBody.append($slidesButton);

	var $summaryButton = $('<img>')
		.attr('src', summaryIconPath)
		.attr('width', (summaryIcon.width * c.width))
		.attr('height', (summaryIcon.height * c.height))
		.css({
			left : (summaryIcon.left * c.width),
			top : (summaryIcon.top * c.height)
		});

	$summaryButton.click(function(){
		if(!this.isSliding)
			this.moveSlider(3);
	}.bind(this));
	$contentPanelBody.append($summaryButton);

	var $googleMapButton = $('<img>')
		.attr('src', googleMapIconPath)
		.attr('width', (googleMapIcon.width * c.width))
		.attr('height', (googleMapIcon.height * c.height))
		.css({
			left : (googleMapIcon.left * c.width),
			top : (googleMapIcon.top * c.height)
		});

	$googleMapButton.click(function(){
		if(!this.isSliding)
			this.moveSlider(4);
	}.bind(this));
	$contentPanelBody.append($googleMapButton);


}
MapElement.prototype.drawSliders = function ()
{
	$("#" + this.slidersId).css({
		"left" : this.sliderX * c.width
	});
}
MapElement.prototype.destroyContentPane = function ()
{
	this.sliderX = 0;
	$("#"+this.panelId).remove();
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

