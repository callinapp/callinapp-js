# Introductions:
Call In App JavaScript SDK for integrating the Call In App features to your web app.

# A click & conference - testing site
**[https://test.callinapp.com/j/9999?PWD=test](https://test.callinapp.com/j/9999?PWD=test)**

- You can change 9999 to any number e.i 8888, 1234,... that will be your unique conferenceId, sharing the link to anyone to join your meeting. 
- It supports high-quality video conference with maximum 64 participants
- It supports in-call snap chats, desktop sharing
- As Admin, you can fully control the conference to mute/unmute, noice adjustment, or kick participants out of it.
- It supports to record the call as well
- Vice versa

# SDK usage guidelines:
Main components:

- **CallInAppSession**: For initializing session from client to Call In App server.
    
    - **Constructor**:
    
        CallInAppSession(user)
     
        - `user` options:
        
            + wssUrl: Socket URL to the Call In App Server
              
            + extension: Extenstion name
              
            + domain: Domain name
              
            + password: Plain password
              
            + callOptions: {
              
                    callerIdName: Caller Id Name
              
                    callerIdNumber: Call Id Number
                }
              
            + userInfo: {
                
                    // Other info here. Ex. email
               
                }
            
            + autoReconnect: Default: true
            
            + autoRecoveryCall: Auto recovery the call when browser tab closed unexpectedly. Default: true

    - **Properties**:
        - isLoggedIn: Whether user logged in.
    - **Methods**:
        - connect(): Connect to the Call In App server with `user` options
        - close(): Close the connection to the Call In App server.
        - on(EVENT_NAME, callback): Start listening a **CallInAppEvent**:
            + EVENT_NAME: CallInAppEvent event
            + callback(err, data): Callback function for handling the event.
        - off(EVENT_NAME[, callback]): Stop listening a **CallInAppEvent**
        - testSpeed(): Test connection speed to the Call In App server. The data will be returned into Promise object or sent to  **CallInAppEvent.ON_SPEED_CHANGE**.
            + Return: `Promise({ upDur, downDur, upKps, downKps })`
            + `on(CallInAppEvent.ON_SPEED_CHANGE, (err, { upDur, downDur, upKps, downKps } ))`
        - newCall(options):
            + options:
            
                {
                
                    destinationNumber: (required) Extension or number
                    callerIdName: (optional)
                    callerIdNumber: (optional)
                    useVideo: (optional) true/false/MediaTrackConstraints
                    useAudio: (optional) true/false/MediaTrackConstraints
                }
                
        **- Please refer the detailed docs for [MediaTrackConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints) if you really want to use `useVideo` and `useVideo`.**

- **CallInAppEvent**: Events will be emitted during the Call In App Session.
    We can catch those events with callback functions:
    
    **- Ex:**
    
        const session = new CallInAppSession(user);
        session.on(CallInAppEvent.<EVENT_NAME>, (err, data) => {
            console.log(err, data);
        })
    
    - `ON_READY`: On connection ready.
    - `ON_CLOSED`: On connection closed.
    - `ON_ERROR`: On connection failed.
    - `ON_RETRYING`: On connection retrying after disconnected.
    - `ON_LOGIN_ERROR`: On log in to Call In App server failed.
    - `ON_LOGIN_SUCCESS`: On log in in successfully
    - `ON_SPEED_CHANGE`: On speed response after `testSpeed()` called.
    - `ON_USER_MEDIA_ERROR`: On permission to get your camera or mic not allowed
    - `ON_USER_PEER_ERROR`: On RTC connection to server failed.
    - `ON_INCOMING_CALL`: On incoming call.
    - `ON_RECOVERY_CALL`: On call recovered after browser/app closed unexpectedly.
    - `ON_CALL_LOCAL_STREAM`: On local stream attached on a call.
    - `ON_CALL_REMOTE_STREAM`: On remote stream attached on a call.
    - `ON_CALL_STATE_UPDATE`: On call state updated
    - `ON_CONFERENCE_JOINED`: On your presence on a conference.
    - `ON_CONFERENCE_LEFT`: On your leave on a conference.
    - `ON_CONFERENCE_MEMBER_JOINED`: On a new member joined your conference.
    - `ON_CONFERENCE_MEMBER_LEFT`: On a member left your conference.
    - `ON_CONFERENCE_MEMBER_UPDATED`: On a member in your conference update info.
    - `ON_CONFERENCE_MEMBER_CLEARED`: On all member in your conference left.
    - `ON_CONFERENCE_CHAT_MESSAGE`: On a message sent to your conference.
    - `ON_CHAT_MESSAGE`: Not supported currently
    
- **CallState**:
    - `NEW`
    - `REQUESTING`
    - `TRYING`
    - `RECOVERING`
    - `RINGING`
    - `ANSWERING`
    - `EARLY`
    - `ACTIVE`
    - `HELD`
    - `HANGUP`
    - `DESTROYED`
    - `PURGE`
    
- **CallInAppUtil**: Some utility functions:
    - mediaDevices:
        - enumerateDevices(kind)
            + kind: `audioinput`, `videoinput`, `audiooutput` or `undefined`
        - checkUserMediaPermission(constraints):
            + constraints: Refer to [MediaStreamConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints)

- **Call**:
    - **Properties**:
        + id: Call ID
        + localStream: your local MediaStream
        + remoteStream: Remote MediaStream
        + state: **CallState**: Get call state
        + activeTime: Active time in milliseconds since January 1, 1970 (midnight UTC/GMT).
        + screenShareCall: Sharing call if you're sharing screen
        + callType: inbound/outbound
        + options: Call options
        + isConference: Whether call is a conference.
    - **Functions**
        + answer(options): Answer a call
        + hangup(options): Hang up call
        + toggleMuteMic()
        + muteMic()
        + unmuteMic()
        + toggleMuteCam()
        + muteCam()
        + unmuteCam()
        + sendDtmf(): Send DTFM code
        + toggleHold()
        + hold()
        + unhold()
        + startScreenShare(): Start screen share
        + stopScreenShare(): Stop screen share

- **Conference**:
    - **Properties**:
        + id: Conference id
        + members: Conference members
        + role: Conference role: `moderator/participant`
    - **Functions**
        + sendChat(message, type = 'message'): Send a chat message to conference channel.
    - **Moderator Funtions**
        + listVideoLayouts()
        + setVideoLayout(layoutName)
        + kick(memberId)
        + muteMic(memberId)
        + muteCam(memberId)
        + videoFloor(memberId)
        + volumeDown(memberId)
        + volumeUp(memberId)
        
#
### **Examples**:
   Please refer to [examples](examples) for detailed usage.
   
   If you need an account for running the example, please email to [Call In App Team](mailto:hoan@callinapp.com?cc=baopn.hcmup@gmail.com,pdtoanstock@gmail.com&subject=[CallInApp]Example%20Account%20Request).

#
### **TypeScript** support: Currently the SDK does not support TypeScript. We'll add it soon.