<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		
		<script type="text/javascript" src="http://spaceify.net/games/g/gamelib.min.js"></script>
		<script type="text/javascript">	
			
		//Group name for development use
				
		var GROUP_NAME = "own_group";
		
		var SERVER_ADDRESS = {host: "spaceify.net", port: 1979};
		var WEBRTC_CONFIG = {"iceServers":[{url:"stun:kandela.tv"},{url :"turn:kandela.tv", username:"webrtcuser", credential:"jeejeejee"}]};
			
			
		function TestScreen()
			{
			var self = this;
			
			var gameClient = new GameClient();
			
			var buttonPressCounter = 0;
			
			
			self.onButtonPressed = function(x, y, callerId, connectionId, callback)
				{
				buttonPressCounter++;
				console.log("TestSreen::onButtonPressed() x: "+x+" y: "+y+" callerId: "+callerId+" connectionId: "+connectionId);
				document.getElementById("message").innerHTML = "Button pressed "+buttonPressCounter;
				};
				
			self.connect = function()
				{
				gameClient.exposeRpcMethod( "onButtonPressed", self, self.onButtonPressed);			
				
				gameClient.connect(SERVER_ADDRESS.host, SERVER_ADDRESS.port, "screen", GROUP_NAME, function(){});
				
				// Connect for deployment
				//gameClient.connectAsScreen("phaseroid", document.getElementById("url"), document.getElementById("qr"), function() {});	
				};
			}
		
		var screen = new TestScreen();
			
		window.onload = function()
			{
			screen.connect();
			}
				
		</script>
		<title>
			TestScreen for communicationhub
		</title>
	</head>
<body>
	<h2>
		TestScreen for communicationhub
	</h2>
	<h3>
		Please open the browser console to see what is happening!
	</h3>
	<h3>
		Message from the controller: <span id="message"></message>
	</h3>
	
	<!-- Uncomment for deployment
	<h3 id="url">
		Here should appear the controller URL
	</h3>
	<img id="qr"></img>
	-->
	
</body>
</html>