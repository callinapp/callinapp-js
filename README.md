## Introductions:
The Call In App JavaScript SDK for integrating the Call In App features to your web app.

## SDK usage guidelines:
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
                
        ** Please refer the detailed docs for [MediaTrackConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints) if you really want to use `useVideo` and `useVideo`.

- **CallInAppEvent**: Events will be emitted during the Call In App Session.
    We can catch those events with callback functions:
    
    **- Ex:**
    
        const session = new CallInAppSession(user);
        session.on(CallInAppEvent.<EVENT_NAME>, (err, data) => {
            console.log(err, data);
        })
    
    - ON_READY
    - ON_CLOSED
    - ON_ERROR
    - ON_RETRYING
    - ON_LOGIN_ERROR
    - ON_LOGIN_SUCCESS
    - ON_SPEED_CHANGE: 
    - ON_USER_MEDIA_ERROR
    - ON_USER_PEER_ERROR
    - ON_INCOMING_CALL
    - ON_RECOVERY_CALL
    - ON_CALL_LOCAL_STREAM
    - ON_CALL_REMOTE_STREAM
    - ON_CALL_STATE_UPDATE
    - ON_CONFERENCE_JOINED
    - ON_CONFERENCE_LEFT
    - ON_CONFERENCE_MEMBER_JOINED
    - ON_CONFERENCE_MEMBER_LEFT
    - ON_CONFERENCE_MEMBER_UPDATED
    - ON_CONFERENCE_MEMBER_CLEARED
    - ON_CONFERENCE_CHAT_MESSAGE
    - ON_CHAT_MESSAGE
    
- **CallState**:
    - NEW
    - REQUESTING
    - TRYING
    - RECOVERING
    - RINGING
    - ANSWERING
    - EARLY
    - ACTIVE
    - HELD
    - HANGUP
    - DESTROYED
    - PURGE
    
- **CallInAppUtil**: Some utility functions:
    - mediaDevices:
        - enumerateDevices(kind)
            + kind: `audioinput`, `videoinput`, `audiooutput`
        - checkUserMediaPermission(constraints):
            + constraints: Refer to [MediaStreamConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints)

- **Call**:
    - **Properties**:
        + id
        + localStream
        + remoteStream
        + state: **CallState**
        + activeTime: Active time in milliseconds since January 1, 1970 (midnight UTC/GMT).
        + screenShareCall
        + callType: inbound/outbound
        + options
        + isConference: Whether call is a conference.
    - **Functions**
        + answer(options)
        + hangup(options)
        + toggleMuteMic()
        + muteMic()
        + unmuteMic()
        + toggleMuteCam()
        + muteCam()
        + unmuteCam()
        + sendDtmf()
        + toggleHold()
        + hold()
        + unhold()
        + startScreenShare()
        + stopScreenShare()

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
        
##Examples:
   Please refer to [examples](examples) for detailed usage.
   
   If you need an account for running the example, please email to [Call In App Team](mailto:hoan@callinapp.com?subject=[CallInApp]%Example%20Account%20Request).

##
*** **TypeScript** support: Currently the SDK does not support TypeScript. We'll add it soon.