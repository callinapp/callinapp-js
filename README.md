## Introductions:
The Call In App SDK for JavaScript for integrating the Call In App features to your web app.

## SDK usage guidelines:
Main components:
- **CallInAppSession**: For initializing session from client to Call In App server.
    
    - **Constructor**:
    
        CallInAppSession(user)
     
        - `user` options:
        
            wssUrl: Socket URL to the Call In App Server
              
            extension: Extenstion name
              
            domain: Domain name
              
            password: Plain password
              
            callOptions: {
              callerIdName: Caller Id Name
              callerIdNumber: Call Id Number
            },
              
            userInfo: {
                // Other info here. Ex. email
            }
            
            autoReconnect: Default: true
            
            autoRecoveryCall: Auto recovery the call when browser closed unexpectedly. Default: true

    - **Properties**:
    - **Methods**:

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
        - enumerateDevices
        - checkUserMediaPermission

##Examples
   Please refer to [example](examples) for detailed usage.


*** **TypeScript** support: Currently the SDK does not support TypeScript. We'll add it soon.