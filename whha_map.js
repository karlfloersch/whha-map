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
	var addIconBgHTML = '<span class="icon-background"'
					+ '" style="left:' + (jamesMapCoordinates[0].x-mapPos.x) * c.width
					+ 'px; top:' + (jamesMapCoordinates[0].y-mapPos.y) * c.height
					+ 'px; width:' + (.23 * c.width)
					+ 'px; height:' + (.05 * c.height)
					+ 'px;" id="' + jamesMapCoordinates[0].id + '-bg"></div>';

	var addIconHTML = '<img src="' + jamesMapCoordinates[0].src
					+ '" style="left:' + (jamesMapCoordinates[0].x-mapPos.x) * c.width
					+ 'px; top:' + (jamesMapCoordinates[0].y-mapPos.y) * c.height
					+ 'px;" width="' + (.2 * c.width)
					+ '" height="' + (.05 * c.height)
					+ '" id="' + jamesMapCoordinates[0].id + '">';

	$("#map-container").append(addIconBgHTML);			
	$("#map-container").append(addIconHTML);

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
	//console.log(mapPos.x + " " + mapPos.y);
}

function showContentBox() {
	setTimeout(function () {

		var isWidthDone = true;
		var isHeightDone = true;

		var w = $("#"+jamesMapCoordinates[0].id+"-bg").width();
		var h = $("#"+jamesMapCoordinates[0].id+"-bg").height();

		if(w < .79 * c.width){
			w += .00001 * c.width + (c.width-w)*.01;
			isWidthDone = false;
			isHeightDone = false;
		}
		if(h < .53 * c.height && isWidthDone){
			h += .00001 * c.height + (c.height-h)*.01;
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










