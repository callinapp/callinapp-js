const savedUser = localStorage.getItem('sample_user');
let user =  savedUser ? JSON.parse(savedUser): null;

let activeCall = null;
let activeConference = null;
let timer = null;
let retry = 0;
let client = null;


if (user) {
  login();
}

function onLoginClicked(e) {
  user = {
    wssUrl: document.getElementById('wss-url-input').value,
    extension: document.getElementById('extension-input').value,
    domain: document.getElementById('domain-input').value,
    password: document.getElementById('password-input').value,
    callOptions: {
      callerIdName: document.getElementById('caller-id-name-input').value,
      callerIdNumber: document.getElementById('caller-id-number-input').value
    },
    userInfo: {
      email: document.getElementById('email-input').value
    }
  };
  logOut();
  login();
}

function login() {
  client = new CallInAppSession(user);
  client.on(CallInAppEvent.ON_READY, () => {
    console.log('[App] Ready');
  });

  client.on(CallInAppEvent.ON_RETRYING, (err, data) => {
    console.log('[App] Login retry', ++retry);
  });

  client.on(CallInAppEvent.ON_ERROR, (err, data) => {
    console.log('[App] Error', err);
  });

  client.on(CallInAppEvent.ON_CLOSED, (err, data) => {
    console.log('[App] Closed');
  });

  client.on(CallInAppEvent.ON_LOGIN_ERROR, (err, data) => {
    console.log('[App] Login Error');
  });

  client.on(CallInAppEvent.ON_LOGIN_SUCCESS, (err, data) => {
    console.log('[App] Login Success', data);
    document.getElementById('login-container').hidden = true;
    document.getElementById('logged-in-container').hidden = false;
    localStorage.setItem('sample_user', JSON.stringify(user));
    retry = 0;
  });

  client.on(CallInAppEvent.ON_SPEED_CHANGE, (err, data) => {
    console.log('[App] Speed change', data);
  });

  client.on(CallInAppEvent.ON_USER_MEDIA_ERROR, (err) => {
    console.error('[App] User Media', err);
  });

  client.on(CallInAppEvent.ON_USER_PEER_ERROR, (err) => {
    console.error('[App] User Peer', err);
  });

  client.on(CallInAppEvent.ON_INCOMING_CALL, (err, call) => {
    console.log('[App] Incoming call', call);
    // let t = setTimeout(() => {
    //   answerCall(call);
    //   clearTimeout(t);
    // }, 5000);
    let answer = confirm(`${call.options.callerIdName || call.options.callerIdNumber} is calling you`);
    if (answer) {
      answerCall(call);
    } else {
      call.hangup();
    }
  });

  client.on(CallInAppEvent.ON_RECOVERY_CALL, (err, call) => {
    console.debug('[App] Call need recovery', call);

    let t = setTimeout(() => {
      answerCall(call);
      clearTimeout(t);
    }, 5000);
  });

  client.on(CallInAppEvent.ON_CALL_LOCAL_STREAM, (err, call) => {
    console.debug('[App] Call local stream', call);
    const localVideoTag = document.getElementById('local');
    localVideoTag.muted = true;
    localVideoTag.srcObject = call.localStream;
  });

  client.on(CallInAppEvent.ON_CALL_REMOTE_STREAM, (err, call) => {
    console.debug('[App] Call remote stream', call);
    document.getElementById('remote').srcObject = call.remoteStream;
  });

  client.on(CallInAppEvent.ON_CONFERENCE_JOINED, (err, conference) => {
    document.getElementById('local').hidden = true;
    console.debug('[App] Conference joined', conference);
    activeConference = conference;
  });

  client.on(CallInAppEvent.ON_CONFERENCE_LEFT, (err, conference) => {
    document.getElementById('local').hidden = false;
    console.debug('[App] Conference left', conference);
    activeConference = null;
  });

  client.on(CallInAppEvent.ON_CONFERENCE_MEMBER_JOINED, (err, [conference, member]) => {
    console.debug('[App] Conference member joined', conference, member);
  });

  client.on(CallInAppEvent.ON_CONFERENCE_MEMBER_LEFT, (err, [conference, member]) => {
    console.debug('[App] Conference member left', conference, member);
  });

  client.on(CallInAppEvent.ON_CONFERENCE_MEMBER_UPDATED, (err, [conference, member]) => {
    console.debug('[App] Conference member updated', conference, member);
  });

  client.on(CallInAppEvent.ON_CONFERENCE_MEMBER_CLEARED, (err, [conference, members]) => {
    console.debug('[App] Conference member cleared', conference, members);
  });

  client.on(CallInAppEvent.ON_CONFERENCE_CHAT_MESSAGE, (err, [conference, message]) => {
    console.debug('[App] Conference chat message', conference, message);
    showConferenceMessage(conference, message);
  });

  client.on(CallInAppEvent.ON_CHAT_MESSAGE, (err, message) => {
    console.debug('[App] Normal chat message', message);
    showUserMessage(message);
  });

  client.on(CallInAppEvent.ON_CALL_STATE_UPDATE, (err, call) => {
    console.debug('[App] Call state', call.state);
    switch (call.state) {
      case CallState.TRYING:
        activeCall = call;
        break;
      case CallState.RINGING:
        startRinging();
        break;
      case CallState.ACTIVE:
        activeCall = call;
        stopRinging();
        document.getElementById('call-info-container').hidden = false;
        startTimer();
        break;
      case CallState.DESTROYED:
        stopRinging();
        activeCall = null;
        document.getElementById('call-info-container').hidden = true;
        stopTimer();
        break;
      default:
        break;
    }
  });

  client.connect();
}

function logOut() {
  if (client) {
    client.close();
    client = null;
    localStorage.removeItem('sample_user');

    document.getElementById('login-container').hidden = false;
    document.getElementById('logged-in-container').hidden = true;
  }
}

function startRinging() {
  document.getElementById('ringing').play();
}

function stopRinging() {
  const ringingElement = document.getElementById('ringing');
  ringingElement.pause();
  ringingElement.currentTime = 0;
}

function answerCall(call) {
  // Hangup the old call
  if (activeCall && call.id !== activeCall.id) {
    hangupCall();
  }

  call.answer();
}

function makeCall() {
  // Hangup the old call
  hangupCall();

  let number = document.getElementById('number-input').value;

  // CallInAppUtil.mediaDevices.enumerateDevices().then((devices) => {
  //   const audioDevices = devices.filter(d => d.kind === 'audioinput');
  //   const videoDevices = devices.filter(d => d.kind === 'videoinput');
  //   console.log('Device', audioDevices, videoDevices);
  //   if (number) {
  //     console.log('Calling to', number);
  //     client.newCall({
  //       //callerIdName: user.callOptions.callerIdName || user.extension,
  //       //callerIdNumber: user.callOptions.callerIdNumber || user.extension,
  //       destinationNumber: number,
  //       useAudio: audioDevices.length > 0 ? {
  //         deviceId: audioDevices[0].deviceId,
  //         groupId: audioDevices[0].groupId
  //       } : false,
  //       useVideo: videoDevices.length > 0 ? {
  //         deviceId: videoDevices[0].deviceId,
  //         groupId: videoDevices[0].groupId
  //       } : false,
  //     });
  //   }
  // });

  console.log('Calling to', number);
  client.newCall({
    //callerIdName: user.callOptions.callerIdName || user.extension,
    //callerIdNumber: user.callOptions.callerIdNumber || user.extension,
    destinationNumber: number
  });
}

function hangupCall() {
  if (activeCall) {
    activeCall.hangup();
  }
}

function toggleMuteMic() {
  if (activeCall) {
    let micMuted = activeCall.toggleMuteMic();
    console.log('Mic muted:', micMuted);
  }
}

function toggleMuteCam() {
  if (activeCall) {
    let camMuted = activeCall.toggleMuteCam();
    console.log('Cam muted:', camMuted);
  }
}

let hold = false;
function toggleHold() {
  if (activeCall) {
    hold = !hold;
    activeCall.toggleHold();
    // if (hold) {
    //   activeCall.hold();
    // } else {
    //   activeCall.unhold();
    // }
  }
}

function sendDtmf() {
  if (activeCall) {
    const dtmfDigits = document.getElementById('dtmf-input').value;
    dtmfDigits && activeCall.sendDtmf(dtmfDigits);
  }
}

function sendChatMessage() {
  const message = document.getElementById('message-input').value;
  const destination = document.getElementById('number-input').value;

  if (message) {
    if (!activeConference) {
      if (!destination) {
        alert('Please input destination number');
        return;
      }

      client.sendChat({
        to: destination,
        body: message
      }).then(re => console.log('[App] Send normal chat to result', re));
    } else {
      activeConference.sendChat(message).then(re => {
        console.log('[App] Send conference chat result', re);
      });
    }
  }
}

function startScreenShare() {
  if (activeCall) {
    activeCall.startScreenShare();
  }
}


function stopScreenShare() {
  if (activeCall) {
    activeCall.stopScreenShare();
  }
}

function startTimer() {
  timer = setInterval(() => {
    if (activeCall) {
      const time = Math.round((Date.now() - activeCall.activeTime)/1000);
      document.getElementById('timer').innerText = `${time}s`;
    }
  }, 1000);
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function showConferenceMessage(conference, message) {
  showMessageNotification(message.from, message.message);
}

function showUserMessage(message) {
  showMessageNotification(message.from, message.body);
}

function showMessageNotification(from, text) {
  let message = `${from}: ${text}`;
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(message);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(message);
      }
    });
  }
}
// CallInAppUtil.mediaDevices.enumerateDevices().then((devices) => {
//   console.log('[Devices]', devices)
// });

// CallInAppUtil.mediaDevices.checkUserMediaPermission({ audio: true, video: false }).then((result) => {
//   console.log('[CheckUserMediaPermission]', result)
// });
