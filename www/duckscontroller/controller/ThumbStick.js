"use strict";

/*jslint browser: true*/
/*global peliAudio: true*/
/*global client: false*/

var DB_LOGGING = false;

//client.loadedTypes.ThumbStick = function (container, canvas, phone, coms, crosshair) {

function ThumbStick(container, canvas, phone, coms, crosshair) 
{

console.log("ThumbStick::()");

var self = this;

var drawDot = false;
var	x = canvas.width / 2;
var	y = canvas.width / 2;
        
var stickID = null;
var r = 10;

var buttonCont = document.getElementById('padButton');
var buttonImg = document.getElementById('padButtonImg');
var stickCont = document.getElementById("padStick");
var stickImg = document.getElementById("padStickImg");

var stickMaxX = 0;
var stickMaxY = 0;
var stickCenterY = 0;
var stickCenterX = 0;
var input = {};

var controlsLeft = false;
var controlsRight = false;
var controlsUp = false;
var controlsDown = false;

   
self.setThumbStickPos = function (x, y) 
	{
	

	if (x <= 1) {
        input.x = x;
    }
    
    input.x = x - 0.5;
    input.y = y -1;

	gameClient.notifyScreens("playerMove", [input]);



	if (stickImg !== null) 
		{
		y = ((y - 1) * stickMaxY) + stickCenterY;
		x = ((x - 0.5) * stickMaxX) + stickCenterX;
		
		stickImg.style.top = y + "px";
		stickImg.style.left = x + "px";
		}
	};

    

self.draw = function (context) 
	{
	if (drawDot === true) 
		{
		context.strokeStyle = "#FF0000";
		context.fillStyle = "#FFFF00";
		context.beginPath();
		context.arc(x, y, r, 0, Math.PI * 2, true);
		context.closePath();
		context.stroke();
		context.fill();
		}
    };

self.onResize = function() 
	{
	if (buttonCont !== undefined && buttonCont !== null) 
		{
		stickMaxX = (buttonCont.offsetWidth * 0.4);
		stickMaxY = (buttonCont.offsetHeight * 0.4);
		stickCenterX = Math.floor((stickCont.offsetWidth - stickImg.width) / 2);
		stickCenterY = Math.floor((stickCont.offsetHeight - stickImg.height) / 2);
		buttonImg.style.left = Math.floor((buttonCont.offsetWidth - buttonImg.width) / 2) + "px";
		buttonImg.style.top = Math.floor((buttonCont.offsetHeight - buttonImg.height) / 2) + "px";
		stickImg.style.left = stickCenterX + "px";
		stickImg.style.top = stickCenterY + "px";
		}
	};
	
var touchStartListener = function(event) 
	{
    event.preventDefault();
	for (var i = 0; i < event.targetTouches.length; i++) 
		{
		if (drawDot === false && event.targetTouches[i].pageX < (canvas.width / 2)) 
			{
			drawDot = true;
			stickID = event.targetTouches[i].identifier;
			self.setThumbStickPos(
                    (event.targetTouches[i].pageX / canvas.width) * 2,
                    (event.targetTouches[i].pageY / canvas.height) * 2
                    );
            }
            
        else 
        	{
            
            gameClient.callClientRpc(client.htmlPhone.screenId, "playerShoot", [], client.htmlPhone, client.htmlPhone.hitTargetVibrate);

            }
		}
	};


var touchMoveListener = function (event) 
	{
	event.preventDefault();
	for (var i = 0; i < event.targetTouches.length; i++) 
		{
        if (event.targetTouches[i].identifier === stickID) 
        	{
			self.setThumbStickPos(
                    (event.targetTouches[i].pageX / canvas.width) * 2,
                    (event.targetTouches[i].pageY / canvas.height) * 2
                    );
			}
		}
	};

var touchEndListener = function(event) 
	{
    event.preventDefault();
	for (var i = 0; i < event.changedTouches.length; i++) 
		{
		if (event.changedTouches[i].identifier === stickID) 
			{
			drawDot = false;
			stickID = null;
            self.setThumbStickPos(0.5, 1);
        	}
    	}
	};

self.updateThumbStickPosBasedOnKeyboard = function()
	{
	var tx = 0;
	var ty = 0;

	if (controlsLeft == true && controlsRight == false)
		{
		tx = 0;
		}
	else if (controlsLeft == false && controlsRight == true)
		{
		tx = 1;
		}
	else
		{
		tx = 0.5;
		}

	if (controlsUp == true && controlsDown == false)
		{
		ty = 0.5;
		}
	else if (controlsUp == false && controlsDown == true)
		{
		ty = 1.5;
		}
	else
		{
		ty = 1;
		}

	self.setThumbStickPos(
		tx,//(event.targetTouches[i].pageX / canvas.width) * 2,
		ty //(event.targetTouches[i].pageY / canvas.height) * 2
		);
	};

self.onKeyDown = function(e)
	{
	var processed = false;

	switch(e.which)
		{
		case 37: // left
		controlsLeft = true;
		processed = true;
		break;

		case 38: // up
		controlsUp = true;
		processed = true;
		break;

		case 39: // right
		controlsRight = true;
		processed = true;
		break;

		case 40: // down
		controlsDown = true;
		processed = true;
		break;

		case 32: // space
		gameClient.callClientRpc(client.htmlPhone.screenId, "playerShoot", [], client.htmlPhone, client.htmlPhone.hitTargetVibrate);
		return true;
		break;

		default: return false; // exit this handler for other keys
		}

	if (processed == true)
		{
		self.updateThumbStickPosBasedOnKeyboard();
		return true;
		}
	};

self.onKeyUp = function(e)
	{
	var processed = false;

	switch(e.which)
		{
		case 37: // left
		controlsLeft = false;
		processed = true;
		break;

		case 38: // up
		controlsUp = false;
		processed = true;
		break;

		case 39: // right
		controlsRight = false;
		processed = true;
		break;

		case 40: // down
		controlsDown = false;
		processed = true;
		break;

		default: return false; // exit this handler for other keys
		}

	if (processed == true)
		{
		self.updateThumbStickPosBasedOnKeyboard();
		return true;
		}
	};

self.init = function()
	{
	console.log("ThumbStick::init()");
	canvas.addEventListener("touchstart", touchStartListener, false);
	canvas.addEventListener("touchmove", touchMoveListener, false);
	canvas.addEventListener("touchend", touchEndListener, false);
	if (buttonCont !== null) 
		{
		buttonCont.style.display = 'block';
		stickCont.style.display = 'block';
		self.onResize();

    	/*
		buttonImg.style.left = Math.floor((buttonCont.offsetWidth - buttonImg.width) / 2) + "px";
		buttonImg.style.top = Math.floor((buttonCont.offsetHeight - buttonImg.height) / 2) + "px";
    	stickImg.style.left = Math.floor((stickCont.offsetWidth - stickImg.width) / 2) + "px";
    	stickImg.style.top = Math.floor((stickCont.offsetHeight - stickImg.height) / 2) + "px";
    	*/
    	}
	
	};
	
self.destroy = function() 
	{
    canvas.removeEventListener("touchstart", touchStartListener, false);
    canvas.removeEventListener("touchmove", touchMoveListener, false);
    canvas.removeEventListener("touchend", touchEndListener, false);
	};
};


var client = client || {};
client.loadedTypes = client.loadedTypes || {};
client.loadedTypes["ThumbStick"] = ThumbStick;
