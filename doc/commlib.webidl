// The Callbacks used in the interface of the GameClient class

/**
 * @brief This callback is fired when GameLib has connected to the Spaceify cloud server successfully
 */

callback ConnectionReadyCallback = void ();

/**
 * @brief This is the signature of the callback function that RPC methods may use for returning return values or errors
 * 
 * @parameter error Error to be returned to the caller. Should be set to null if no error occured.
 *
 * @parameter data Data to be returned to the caller.
 *
 */

callback RPCMethodReturnCallback = void (any error, any data);

/**
 * @brief This is the signature of an RpcMethod that can be exposed using the exposeRpcMethod() call
 * 
 * @param params Parameters of the method. 
 * This parameter is actually a placeholder for "varargs", type "any" is used because webidl does not have varargs type.
 *
 * @param callerId The global id of the client that is calling this RpcMethod
 *
 * @param connectionId The id of the connection this call arrived from 
 *
 * @param callback The callback this method may use for returning a return value or error
 *
 */ 

callback RpcMethod = void (any params, DOMString callerId, DOMString connectionId, RPCMethodReturnCallback callback);


/**
 * @brief This callback is fired when a connection to a controller is established.
 *
 * @param controllerId The global Id of the controller.
 *
 */

callback ControllerConnectedCallback = void (DOMString controllerId);

/**
 * @brief This callback is fired when a connection to a controller is lost.
 *
 * @param controllerId The global Id of the controller.
 *
 */

callback ControllerDisconnectedCallback = void (DOMString controllerId);

/**
 * @brief This callback is fired when a connection to a screen is established.
 *
 * @param screenId The global Id of the screen.
 *
 */
 
callback ScreenConnectedCallback = void (DOMString screenId);

/**
 * @brief This callback is fired when a connection to a screen is lost.
 *
 * @param screenId The global Id of the screen.
 *
 */

callback ScreenDisconnectedCallback = void (DOMString screenId);

/**
 * @brief This callback is fired when the connectiontype to a screen changes.
 *
 * @param The new connection type. May be "Cloud", "WebRTC", or "LocalHub" 
 *
 * @param screenId The global Id of the screen.
 *
 */

callback ScreenConnectionTypeCallback = void (DOMString newConnectionType, DOMString screenId);

/**
 * @brief This is the main class for interacting with the Spaceify Connectivity Platform API.
 * 
 */

[Constructor]
interface GameClient
{
/** 
 * @brief Connect method for Development use. Connects the GameClient to a specific CommunicationHub
 * with a specified client type and specified commmunication group id.
 *
 * @param host Hostname or ip address of the CommunicationHub to be connected.
 *
 * @param port Port of the CommunicationHub to be connected.
 *
 * @param clientType Client type to connect as ("screen", or "controller" )
 *
 * @param groupId The id of the communication group to be connected.
 *
 * @param callback The callback function that gets called when the connection to the CommunicationHub is ready.
 *
 */

void connect( DOMString host, DOMString port, DOMString clientType, DOMString groupId,  ConnectionReadyCallback callback );

/**
 * @brief Screen Connect method to be used in real deployments. This method first queries communication
 * details from the Spaceify Games server using the game name. The Game server returns
 * the hostname and the port number of the CommunicationHub that should be connected, along with the
 * the short URL and the QR code URL that the users can use for connecting to this screen.   
 * The server also returns a new communication group id that is used for connecting to the CommunicatioHub 
 * if one is not found in a cookie. In effect this means that there is one semi-persistent session per game 
 * per web browser running the screen.  
 *
 * @param gameName The name of the game to be joined. Must be available on the Spaceify games server.
 * 
 * @param urlTag the HTML DOM element the short URL will be displayed in
 *
 * @param qrCodeTag the HTML DOM element the QR code will be displayed in
 *
 * @param callback The callback that gets called when the connection to the CommunicationHub is ready.
 *
 */

void connectAsScreen(DOMString gameName, any urlTag, any qrCodeTag,  ConnectionReadyCallback callback );

/**
 * @brief The Controller Connect method to be used in real deployments. Takes
 * Takes the communication group id, CommunicationHub hostname and port 
 * from HTTP get parameters "id", "host", and "port", respectively.
 * 
 * @param callback The callback that gets called when the connection to the CommunicationHub is ready.
 *
 */

void connectAsController (ConnectionReadyCallback callback );

/** 
 * @brief Sends a JSONRPC notification (= calls a void-returning RPC method) to all connected screens. 
 * 
 * @methodName
 *
 * @
 */
 
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