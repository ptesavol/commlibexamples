"use strict";
/*global window */
/*global document */
/*global console */
/*global $ */
var gameClient;

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || 
					navigator.mozVibrate || navigator.msVibrate || function () 
						{
						//this.shootSound = new Howl({urls: ['assets/shoot.wav'] }); 
						};



function getURLParameter(name) 
	{
  	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
	}

function HtmlPhone()
{
var self = this;

var prizes = [];

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
var playerScore =0;

var gameJoined = false;
var controllerObject = null;
var controllerDisabler = null;
var isOrienting = false;
var isResizing = false;

var scoreDisplay = null;

var playerId = null;
var ipAddress = "";

var connectionType = "";

self.screenId = 0;

self.start = function() 
	{

	playerId = getCookie("userid");

	
	$("#emailbutton").click(function(){
		var mail = $("#emailtext").val();

    
    	//client.coms.call('setMail', [mail], null, null);
    	gameClient.notifyScreens("setPlayerMail", [mail]);

    	$("#email").hide();

	});
	
	self.loadPrizes();

	var prompt = $.prompt({state0:
		{
		title: "Welcome to play! Please enter your nickname.",
		html:'<input style="width: 100%;" type="text" name="fname" value="">',
		focus: "input[name='fname']",
		submit: function(e,v,m,f)
			{
			console.log("submitted");
			if (f.fname && f.fname.length>0)
				{
				//console.log(f);

				e.preventDefault();
				$.prompt.close();
				self.continueStart(f.fname);
				}
			else
				{
				e.preventDefault();
				$.prompt.goToState('state0');
				}
			}
		}});	//using Impromptu lib
	};
	
self.continueStart = function(name)
	{
	playerName = name;	
    connectingDiv = document.getElementById('connecting');
    disconnectedDiv = document.getElementById('disconnected');
    container = document.getElementById('container');
	playerNameDisplay = document.getElementById('playerName');
	scoreDisplay = document.getElementById('playerScore');
	
	playerNameDisplay.innerHTML = playerName;
	
	canvas = container; 	/* need to trick controllers because they rely on canvas for dimensions */
    canvas.width = container.offsetWidth;
    width = canvas.width;
    canvas.height = container.offsetHeight;
    height = canvas.height;
   	playerScore = 0;
   	  
	window.orientationchange = function () 
		{
		self.onOrientationChange();
		};
	
	window.onresize = function() 
		{
		self.onResize();
		};

   

	self.initializeControllerDisplay();
	
	//self.startComs(0);

	gameClient = new GameClient(); 

	gameClient.setScreenConnectionListener(self, self.onScreenConnected);
	gameClient.setScreenDisconnectionListener(self, self.onScreenDisconnected);

	gameClient.setScreenConnectionTypeListener(self, self.onScreenConnectionTypeUpdated);

	var groupId = getURLParameter("gid");
	if (groupId == null)
		{
		// Normal server way
		gameClient.connectAsController(self.clientConnected);   
	}
	else
		{
		// For local debugging use ONLY (if gid GET parameter is given)
		gameClient.connect(SERVER_ADDRESS.host, SERVER_ADDRESS.port, "controller", groupId, self.clientConnected);
		}

	// Add keyboard support
	$(document).keydown(self.onKeyDown);
	$(document).keyup(self.onKeyUp);
	};

self.onKeyDown = function(e)
	{
	if (controllerObject && controllerObject.onKeyDown(e) == true)
		return;

	switch(e.which)
		{
		//case 32: // space
		//break;

		default: return; // exit this handler for other keys
		}
		e.preventDefault(); // prevent the default action (scroll / move caret)
	};

self.onKeyUp = function(e)
	{
	if (controllerObject && controllerObject.onKeyUp(e) == true)
		return;

	switch(e.which)
		{
		//case 32: // space
		//break;

		default: return; // exit this handler for other keys
		}
		e.preventDefault(); // prevent the default action (scroll / move caret)
	};

self.clientConnected = function() {
	console.log("htmlPhone::clientConnected()"+self);
	
	self.showController();
	self.loadController("ThumbStick", null);

	//setTimeout(function() {gameClient.notifyScreens("setPlayerName", [playerName]); }, 1000);

	//self.showDisconnected();

};

self.onScreenConnected = function(id){

	console.log("htmlPhone::onScreenConnected()"+id);
	self.screenId = id;

	gameClient.exposeRpcMethod("addPrize", self, self.addPrize);
	gameClient.exposeRpcMethod("askMail", self, self.askMail);
	gameClient.exposeRpcMethod("setScore", self, self.setScore);
	gameClient.exposeRpcMethod("rtt", self, self.rtt);
	
	gameClient.notifyScreens("setPlayerName", [playerName]);


};

self.onScreenDisconnected = function(id){
	console.log("htmlPhone::onScreenDisconnected()"+id);


	self.showDisconnected();



};

self.onScreenConnectionTypeUpdated = function(newConnectionType, screenId){
       console.log("htmlPhone::onScreenConnectionTypeUpdated - ConnectionMethod " +newConnectionType);
       connectionType = newConnectionType;

};

    
self.showConnecting = function() 
	{
	disconnectedDiv.style.display = 'none';
	connectingDiv.style.display = 'block';
	};
	
self.showDisconnected = function() 
	{
    connectingDiv.style.display = 'none';
	disconnectedDiv.style.display = 'block';
	};
	
self.showController = function() 
	{
    connectingDiv.style.display = 'none';
    disconnectedDiv.style.display = 'none';
	console.debug("htmlPhone::showController - displaying controller");
    };

/*
self.onConnectionOpened = function(error, ok) 
	{
	client.coms.exposeRpcMethod('resetScore', this, this.resetScore);
	client.coms.exposeRpcMethod('askMail', this, this.askMail);
	
	if (ok) 
		{
		console.log("htmlPhone::onConnectionOpened - connection established, trying to join game");
		client.coms.call('joinGame', [USERID, playerName], this, function (rpc_id, rpc_error, retval) 
			{
			self.loadController(retval[0], retval[1]);
			gameJoined = true;
			self.showController();
			});
            
        } 
    else if (gameJoined) 
		{
		console.error("htmlPhone::onConnectionOpened - midgame error", error);
		self.showDiconnected();
        } 
	else 
		{
		self.openComs();
		self.showConnecting();
        }

	sendServerCommand("ip", function(ip)
		{

		ipAddress = ip;
		client.coms.call('setIP', [ip], null, null);
        });

	var login = getURLParameter('method');
        //console.log(login);

	if(login != undefined && login != null)
		{
		client.coms.call('setLogin', [login], null, null);
        }

    client.coms.call('setID', [playerId], null, null);

    
    //setInterval(function(){  controllerObject.rtt(); }, 100);
    //console.log(qr);
	};

	*/
	
self.onConnectionClosed = function() 
	{
	self.showDisconnected();
    };

/*
self.startComs = function(timeout) 
	{
	window.setTimeout(function () 
		{
		client.coms.open(
			function (error, ok) 
				{
				self.onConnectionOpened(error, ok);
				},
        	function ()
        		{
            	self.onConnectionClosed();
            	});
        }, 
        (timeout || RECONNECT_TIMEOUT));
    };

    */
    
self.loadController = function (type, playerData) 
	{

	console.log("htmlPhone::loadController()"+type);
	
	if (!client.loadedTypes[type]) 
		{
        console.error("trying to enable unregistered controller type ", type);
        throw new Error("trying to enable unregistered controller type: " + type);
        }
	
	//controllerObject = client.loadedTypes[type];
	
	var constr = client.loadedTypes[type];
	//console.log(client.loadedTypes[type]);
	//console.log(constr);
	controllerObject = new constr(container, canvas, self, null, 20);
	
	controllerObject.init();
	
	//document.getElementById('crosshairImg').src = playerData.crosshairURL;

	if (typeof controllerDisabler === 'function') 
		{
		controllerDisabler();
		controllerDisabler = null;
        }

	controllerDisabler = controllerObject.destroy;
    };

self.onOrientationChange = function () 
	{
	if (isOrienting === false) 
		{
		isOrienting = true;
		setTimeout(function ()
			{
			self.onResize();
			self.isOrienting = false;
            }, 
            50);
		}
    };
    
self.onResize = function () 
	{
	if (isResizing === false) 
		{
        isResizing = true;
        setTimeout(function () 
        	{
			console.debug("htmlPhone::onResize - performing resize");
			canvas.width = container.offsetWidth;
			width = canvas.width;
			canvas.height = container.offsetHeight;
			height = canvas.height;
			
			if (controllerObject !== null && controllerObject.onResize !== undefined) 
				{
				console.debug("htmlPhone::onResize - calling controller onResize");
				controllerObject.onResize();
				}
            isResizing = false;
            }, 
            100);
		}
	};

self.loadPrizes = function()
	{
	// TODO: cookie size 4096 doesn't fit all the prizes, last time only 2k chars could be written.
	/*var prizesJson = getCookie("net.spaceify.portableducks.prizes");
	if (prizesJson != null)
		{
		prizes = JSON.parse(prizesJson);
		}
	else
		{
		prizes = [];
		}*/
	// hack for demo
	prizes = [];
	self.updatePrizesHtml();
	};

self.savePrizes = function()
	{
	// TODO: cookie size 4096 doesn't fit all the prizes, last time only 2k chars could be written.
	/*var prizesJson = JSON.stringify(prizes);
	setCookie("net.spaceify.portableducks.prizes", prizesJson, 365);*/
	};

self.updatePrizesHtml = function()
	{
	var div = $("#prizesList");

	
	// For testing HTML generation
	/*prizes = [];
	var prize1 = { name: "MATTE LIPSTICK -10%", description: "Load your lips with plush, pigment-rich color choosing from 12 brand new shades of Matte Lipstick our shockingly smooth lip color that glides right on and stays in place with a silky matte finish that never feels dry. Now available in a range of fresh new hues, these playful pops of color are just what your spring wardrobe needs!", logo: "assets/Promotion/01/image/logo.jpg", couponUrl: "assets/Promotion/01/index.html" };
	var prize2 = { name: "Colour Correction Concealer Wheel -50%", description: "A palette with 5 different shades of concealer and calibrated textures to minimize the appearance of blemishes and enhance the skin tone with 5 specific results. Enclosed in a practical case with a mirror, Colour Correction Concealer Wheel allows the creation of a perfectly even and luminous complexion at any moment.", logo: "assets/Promotion/02/image/logo.jpg", couponUrl: "assets/Promotion/02/index.html" };
	prizes.push(prize1);
	prizes.push(prize2);
	prizes.push(prize2);
	prizes.push(prize1);
	prizes.push(prize1);
	prizes.push(prize2);
	prizes.push(prize1);
	prizes.push(prize2);
	prizes.push(prize1);
	prizes.push(prize2);*/

	div.empty();
	
	var html = '';
	html += "<table>";
	for (var i=0; i<prizes.length; i++)
		{
		html += "<tr>";
		html += "<td class=\"prizesImg\">"+
			"<a class=\"prizesLink\" href=\""+prizes[i].couponUrl+"\" target=\"_blank\">"+
			"<img class=\"prizesImage\" src=\""+prizes[i].logo+"\" />"+
			"</a></td>";
		html += "<td class=\"prizesDescription\">"+
			"<a class=\"prizesLink\" href=\""+prizes[i].couponUrl+"\" target=\"_blank\">"+
			prizes[i].description+
			"</a></td>";
		html += "</tr>";
		}
	html += "</table>";
	div.append(html);
	
	
	
	
	/*
	for (var i=0; i<prizes.length; i++)
		{
		ul.append("<li><a href=\""+prizes[i].couponUrl+"\" target=\"_blank\">"+
			"<img src=\""+prizes[i].logo+"\" />&nbsp;"+
			"<span>"+prizes[i].description+"</span>"+
			"</a></li>");
		}
	*/
	//<li>
	//	<a href="assets/Promotion/01/" target="_blank">
	//		<img src="assets/Promotion/01/image/logo.jpg" />
	//		&nbsp;
	//		<span>Shoot 5 Reply logos to win a free Reply t-shirt!</span>
	//	</a>
	//</li>
	}

self.addPrize = function(prize)
	{
	var found = false;
	for (var i=0; i<prizes.length; i++)
		{
		if (prizes[i].name.valueOf() == prize.name)
			{
			found = true;
			break;
			}
		}

	if (found == false)
		{
		prizes.push(prize);
		self.savePrizes();
		self.updatePrizesHtml();
		}
	};

self.askMail = function () 
	{
	//$("#email").show();
    };

self.hitTargetVibrate = function(err, hitTarget){

	console.log("htmlPhone::hitTargetVibrate() "+hitTarget);

	if(hitTarget)
	{
		navigator.vibrate(150);
	}
	else
	{
		navigator.vibrate(50);
	}
};

self.setScore = function(playerScore){
	

	console.log("htmlPhone::setScore() "+playerScore);
	if (playerScore < 0)
		{
		scoreDisplay.innerHTML = playerScore;
		}
	else if (playerScore < 10)
		{
		scoreDisplay.innerHTML = '00' + playerScore;
		} 
	else if (playerScore < 100) 
		{
		scoreDisplay.innerHTML = '0' + playerScore;
		} 
	else 
		{
		scoreDisplay.innerHTML = playerScore;
		}

};
    
self.initializeControllerDisplay = function () 
	{

    };


self.getIp = function(){ return ipAddress;};

self.getPlayerId = function(){return playerId;};



self.rtt = function() 
{
	console.log("htmlPhone::rtt() ");
	gameClient.notifyScreens("rttReturned", [connectionType]);
 
};

}

var client = client || {};
client.htmlPhone = new HtmlPhone();
window.onload=function(){client.htmlPhone.start();};
/*
addWindowOnload(function () 
	{
    client.htmlPhone.start();
	});*/