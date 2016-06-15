# commlibexamples
Examples of using the Spaceify Communication Platform API


You can use the Spaceify Communication Platform API in your code by adding the following
script tag to your page:

```html
<script type="text/javascript" src="http://spaceify.net/games/g/gamelib.min.js"></script>
```

The API is used through the simple _GameClient_ class. 
The complete description of the _GameClient_ class is available in WebIDL format with comments at 
https://github.com/ptesavol/commlibexamples/blob/master/doc/commlib.webidl


## Analogue gamepad example

An example of implementing an analogue gamepad in HTML5 is now available in the folder "www/duckscontroller".
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

## Local CommunicationHub binary

Local CommunicationHub binary is now available in the "bin" directory. Local CommunicationHub is especially useful for
supporting iOS devices, the browser of which does not support WebRTC.

In order to use the Local CommunicationHub, first do this in your shell:

```bash
cd bin
npm install
chmod u+x localhub.sh
```

Then edit the localhub.sh file and insert there the one of your IP addresses that the mobile devices can see.


Now you are ready to start the local CommunicationHub by issuing the command

```bash
./localhub.sh
```

The CommunicationHub does not print much output to the console. If it does not start, make sure the ip address (--host)
and port (--port) defined in the "localhub.sh" are free on your computer. You can know that the LocalHub is working correctly if
it prints messages about opening and closing connections whenever you refresh the testscreen.html page in your web browser.

  





