//Group name for development use
				
var GROUP_NAME = "petridebug";
				
var SERVER_ADDRESS = {host: "spaceify.net", port: 1979};
var WEBRTC_CONFIG = {"iceServers":[{url:"stun:kandela.tv"},{url :"turn:kandela.tv", username:"webrtcuser", credential:"jeejeejee"}]};
		
var screenId = null;


navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || 
					navigator.mozVibrate || navigator.msVibrate || function () 
						{
						//this.shootSound = new Howl({urls: ['assets/shoot.wav'] }); 
						};



function getURLParameter(name) 
	{
  	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
	}
			
function AController()
{
var self = this;
			
var gameClient = null;
	
	
var playerName = null;
var RECONNECT_TIMEOUT = 500;
var isResizing = false;
var controllerType = null;

var playerName= null;

var connectingDiv = null;
var disconnectedDiv = null;
var container = null;
var playerNameDisplay = null;

var canvas = null;
var width = null;
var height = null;
var playerScore = 0;

var gameJoined = false;
var controllerObject = null;
var controllerDisabler = null;
var isOrienting = false;
var isResizing = false;

var scoreDisplay = null;

var playerId = null;
var ipAddress = "";

var connectionType = "";


//------------------------------------------------

//From Thumbstick code


var drawDot = false;
var	x = null;
var	y = null;
        
var stickID = null;
var r = 10;

var buttonCont = null;
var buttonImg = null;
var stickCont = null;
var stickImg = null;

var stickMaxX = 0;
var stickMaxY = 0;
var stickCenterY = 0;
var stickCenterX = 0;
var input = {};

var controlsLeft = false;
var controlsRight = false;
var controlsUp = false;
var controlsDown = false;

var OFFSET_X = 0.5;
var OFFSET_Y = 1;

self.setThumbStickPos = function (x, y) 
	{
	

	if (x <= 1) {
        input.x = x;
    }
    
    input.x = x - OFFSET_X;
    input.y = y - OFFSET_Y;

	gameClient.notifyScreens("playerMove", [input]);



	if (stickImg !== null) 
		{
		y = ((y - OFFSET_Y) * stickMaxY) + stickCenterY;
		x = ((x - OFFSET_X) * stickMaxX) + stickCenterX;
		
		stickImg.style.top = y + "px";
		stickImg.style.left = x + "px";
		}
	};

    

self.draw = function (context) 
	{
	if (drawDot === true) 
		console.log("inside drawfunction")
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
	
self.hitTargetVibrate = function(err, hitTarget)
	{
	console.log("AController::hitTargetVibrate() "+hitTarget);

	if(hitTarget)
		{
		navigator.vibrate(150);
		}
	else
		{
		navigator.vibrate(50);
		}
	};
	
	
var touchStartListener = function(event) 
	{ 
	//console.log("----------------------------------------- inside touchStartListener");
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
            
            gameClient.callClientRpc(screenId, "playerShoot", [], self, self.hitTargetVibrate);

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
            self.setThumbStickPos(OFFSET_X, OFFSET_Y);
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
		gameClient.callClientRpc(screenId, "playerShoot", [], self, self.hitTargetVibrate);
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


var hexToRgb = function(hex) 
	{
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) 
    	{
        return r + r + g + g + b + b;
    	});

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    	} : null;
	};

self.onColourSelected = function(colour) 
	{
	console.log("AController::onColourSelected()");
		
	var rgb = hexToRgb(colour);
	var rgbString = rgb.r + "," + rgb.g + "," + rgb.b + ",";
	console.log("color: " + rgbString);
	$("#padStick").css("background", "linear-gradient(rgba(" + rgbString + "0.82),rgba(" + rgbString + " 0.82)), url('../assets/controller/controller_move.png') no-repeat");
	};



self.onConnected = function()
	{
	// Add keyboard support
	$(document).keydown(self.onKeyDown);
	$(document).keyup(self.onKeyUp);
	self.onResize();
	};
			

self.onScreenConnectionTypeUpdated = function(newConnectionType, screenId)
	{
	console.log("RpcController::onScreenConnectionTypeUpdated() new connection type: " + newConnectionType);
	};
	
self.connect = function()
	{
	gameClient = new GameClient(); 
	gameClient.setScreenConnectionTypeListener(self, self.onScreenConnectionTypeUpdated);
				
	gameClient.setScreenConnectionListener(self, self.onScreenConnected);
	gameClient.setScreenDisconnectionListener(self, self.onScreenDisconnected);
	
	gameClient.exposeRpcMethod( "onColourSelected", self, self.onColourSelected);
	
	var groupId = getURLParameter("gid");
	
	if (groupId == null)
		{
		// Normal server way
		gameClient.connectAsController(self.onConnected);   
		}
	else
		{
		// For local debugging use ONLY (if gid GET parameter is given)
		gameClient.connect(SERVER_ADDRESS.host, SERVER_ADDRESS.port, "controller", groupId, self.onConnected);
		}
		
	};
			
self.sendButtonPress = function()
	{
	console.log("RpcController::sendButtonPress()");
	gameClient.callClientRpc(screenId, "onButtonPressed",[100,200], self, function(err, data)
		{
		document.getElementById("reply").innerHTML= data;
		});
	};
				

			
self.onScreenConnected = function(id)
	{
	console.log("RpcController::onScreenConnected() screenId: " + id);
	screenId = id;
	};

var requestPlayerName = function(callback)
	{
	var prompt = $.prompt({state0:
		{
		title: "Welcome to play! Please enter your nickname.",
		html:'<input style="width: 100%;" type="text" name="fname" value="">',
		focus: "input[name='fname']",
		submit: function(e,v,m,f)
			{
			if (f.fname && f.fname.length>0)
				{
				//console.log(f);

				e.preventDefault();
				$.prompt.close();
				callback(f.fname);
				}
			else
				{
				e.preventDefault();
				$.prompt.goToState('state0');
				}
			}
		}});	//using Impromptu lib
	};
	
var showController = function(callback)
	{
	connectingDiv.style.display = 'none';
    disconnectedDiv.style.display = 'none';
	console.log("APhone::showController() - displaying controller");
	
	canvas.addEventListener("touchstart", touchStartListener, false);
	canvas.addEventListener("touchmove", touchMoveListener, false);
	canvas.addEventListener("touchend", touchEndListener, false);
	
	if (buttonCont !== null) 
		{
		buttonCont.style.display = 'block';
		stickCont.style.display = 'block';
		}
	
	callback();
	};	
	
self.start = function()
	{
	
	connectingDiv = document.getElementById('connecting');
    disconnectedDiv = document.getElementById('disconnected');
    container = document.getElementById('container');
	playerNameDisplay = document.getElementById('playerName');
	scoreDisplay = document.getElementById('playerScore');
	canvas = container; 	
    canvas.width = container.offsetWidth;
    
    buttonCont = document.getElementById('padButton');
	buttonImg = document.getElementById('padButtonImg');
	stickCont = document.getElementById("padStick");
	stickImg = document.getElementById("padStickImg");
    
    width = canvas.width;
    canvas.height = container.offsetHeight;
    height = canvas.height;
   	x = canvas.width / 2;
	y = canvas.width / 2;
   	
   	
   	
   	
   	window.orientationchange = function () { self.onOrientationChange(); };
	window.onresize = function() { self.onResize(); };
   	
   	
   	playerScore = 0;
   	
   	requestPlayerName(function(name)
		{
		playerName = name;
		playerNameDisplay.innerHTML = playerName;	
		
		showController(function() 
			{
			self.connect();		
			});	
		});
	};		
}
		
var controller = null; 
			
window.onload = function()
	{
	controller = new AController();
	controller.start();
	};
				
		