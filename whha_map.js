/*	HERE IS SOME STUFF THAT MAY OR MAY NOT BE USEFUL
	$("p").click(function(){
		$(this).text(jamesMapCoordinates[0].x.toString());

	});

	$('#map-container').append('<div id="overlap-test">gosh darn</div>');
*/

var loadedImagesCounter = 0;
var imageList = [];
var c;
var ctx;

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
	
	var $panelIcon = $('<img>')
		.attr('src', mapIconPath)
		.attr('width', (.045 * c.width))
		.attr('height', (.05 * c.height));

	var $panelTitle = $('<h3>')
		.css({
			left: (.05 * c.width),
			top: (-.025 * c.height),
		}).append(jamesMapCoordinates[0].title);

	var $contentPanel = $('<span>')
		.attr('class', 'icon-background')
		.attr('id', jamesMapCoordinates[0].id)
		.css({
			left: (jamesMapCoordinates[0].x-mapPos.x) * c.width,
			top: (jamesMapCoordinates[0].y-mapPos.y) * c.height,
			width: (.23 * c.width),
			height: (.05 * c.height),
			"font-size": (.025 * c.height)
		});

	$contentPanel.append($panelIcon);
	$contentPanel.append($panelTitle);


	// var addIconBgHTML = '<span class="icon-background"'
	// 				+ '" style="left:' + (jamesMapCoordinates[0].x-mapPos.x) * c.width
	// 				+ 'px; top:' + (jamesMapCoordinates[0].y-mapPos.y) * c.height
	// 				+ 'px; width:' + (.23 * c.width)
	// 				+ 'px; height:' + (.05 * c.height)
	// 				+ 'px; font-size:' + (.025 * c.height)
	// 				+ 'px;" id="' + jamesMapCoordinates[0].id + '">'
	// 				+ addIconHTML + addTitleHTML + '</div>';

	

	$("#map-container").append($contentPanel);			
	// $("#map-container").append(addIconHTML);

	console.log("x " + (jamesMapCoordinates[0].x-mapPos.x) + " y " + (jamesMapCoordinates[0].y-mapPos.y));
	$("#" + jamesMapCoordinates[0].id).click(function(){
		moveMapTo(-jamesMapCoordinates[0].x + .1, -jamesMapCoordinates[0].y + .2);
	});
}

function removeMarkers() {
	$("#" + jamesMapCoordinates[0].id).remove();
	$("#" + jamesMapCoordinates[0].id + "-bg").remove();
}

// TODO: Remove tempElement and instead itterrate over all elements
function moveMapTo(xPos, yPos) {
	
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

		$("#"+jamesMapCoordinates[0].id).css("left", (jamesMapCoordinates[0].x+mapPos.x) * c.width);
		$("#"+jamesMapCoordinates[0].id).css("top",(jamesMapCoordinates[0].y+mapPos.y) * c.height);

		$("#"+jamesMapCoordinates[0].id+"-bg").css("left", (jamesMapCoordinates[0].x+mapPos.x) * c.width);
		$("#"+jamesMapCoordinates[0].id+"-bg").css("top",(jamesMapCoordinates[0].y+mapPos.y) * c.height);

		if (!isDone){
			moveMapTo(xPos, yPos);
		}else{
			showContentBox();
		}
	}, 10);
	//console.log(mapPos.x + " " + mapPos.y); 370  x 100
}

var fullContentBox = {
	"width" : 0.79,
	"height" : 0.53,
	"steadyVel" : .002,
	"scaledVel" : .08
}

function showContentBox() {
	setTimeout(function () {

		var isWidthDone = true;
		var isHeightDone = true;

		var w = $("#"+jamesMapCoordinates[0].id+"-bg").width();
		var h = $("#"+jamesMapCoordinates[0].id+"-bg").height();

		console.log("w: " + w + " contentBoxW: " + fullContentBox.width);

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

		$("#"+jamesMapCoordinates[0].id+"-bg").width(w);
		$("#"+jamesMapCoordinates[0].id+"-bg").height(h);

		
		if (!isWidthDone || !isHeightDone){
			showContentBox();
		}else{
		}
	}, 10);
}

function scaleMap() {
	c.width = window.innerWidth * .9;
    c.height = window.innerWidth * .74;
    drawBackground();
    removeMarkers();
    addMarkers();


}

window.onresize = function () {
	scaleMap();
};










