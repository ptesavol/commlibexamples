# commlibexamples
Examples of using the Spaceify Communication Platform API

The Ducks and Pirates controller is now available in the folder "www/duckscontroller".
You can open it for development using an URL of the format:

```html
http://localhost/~ptesavol/comm/duckscontroller/controller.html?host=spaceify.net&port=1979&gid=petris_own_group
```

Remember to replace the path with your own path, and the "gid" parameter with your group id.
See the javascript console of your screen browser see what kind of RPC calls the controller tries to make,
and implement them in your screen code.

The RPC methods you need to implement and expose in the screen are the following (in WebIDL format):

```
void setPlayerName(DOMString name, DOMString callerId);

void playerMove(dictionary coordinates {float x,float y}, DOMString callerId);

```

You can use the Spaceify Communication Platform API in your code by adding the following
script tag to your page:

```html
<script type="text/javascript" src="http://spaceify.net/games/g/gamelib.min.js"></script>
```

The API is used through the simple _GameClient_ class. 
Below you can find the complete decription of the _GameClient_ class in WebIDL format.
For better-formatted version see https://github.com/ptesavol/commlibexamples/blob/master/doc/commlib.webidl

## The Callbacks used in the interface of the GameClient class

callback ConnectionReadyCallback = void ();

callback RpcMethod = void (any params, DOMString callerId, DOMString connectionId, callback);

callback RPCMethodReturnCallback = void (any error, any data);

callback ControllerConnectedCallback = void (DOMString controllerId);

callback ControllerDisconnectedCallback = void (DOMString controllerId);

callback ScreenConnectedCallback = void (DOMString screenId);

callback ScreenDisconnectedCallback = void (DOMString screenId);

callback ScreenConnectionTypeCallback = void (DOMString newConnectionType, DOMString screenId);

## The GameClient class

[Constructor]
interface GameClient

{

// Connect method for Development

void connect( DOMString host, DOMString port, DOMString clientType, DOMString groupId,  ConnectionReadyCallback callback );

// Connect methods for Deployment

void connectAsScreen(DOMString gameName, any urlTag, any qrCodeTag,  ConnectionReadyCallback callback );

void connectAsController (ConnectionReadyCallback callback );

// Methods for calling an RPC function that returns nothing

void notifyScreens( DOMString methodName, any[] params );

void notifyController( DOMString controllerId, DOMString methodName, any[] params );

// Method for calling an RPC function with return value, will call the callback on returning

void callClientRpc( DOMString clientId, methodName, any[] params, any thisParam, RPCMethodReturnCallback callback );


// Method for exposing an RPC method towards all connected clients 

void exposeRpcMethod( DOMString methodName, any thisParam, RPCMethod method );


// Setters for listeners 

setter void setControllerConnectionListener( any thisParam, ControllerConnectedCallback listenerFunction );

setter void setControllerDisconnectionListener( any thisParam, ControllerDisconnectedCallback listenerFunction );

setter void setScreenConnectionListener( any thisParam, ScreenConnectedCallback listenerFunction );

setter void setScreenDisconnectionListener( any thisParam, ScreenDisconnectedCallback listenerFunction );

setter void setScreenConnectionTypeListener( any thisParam, ScreenConnectionTypeCallback listenerFunction );	
};