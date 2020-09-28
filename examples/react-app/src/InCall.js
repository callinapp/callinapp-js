import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';

export default function InCall(props) {

  const localVideoElementRef = useRef();
  const remoteVideoElementRef = useRef();
  const { call } = props;
  const { localStream, remoteStream, timeElapsed, conference } = useSelector(state => state.call);
  const [ dtmfDigits, setDtmfDigits ] = useState('');
  const [ message, setMessage ] = useState('');

  const onHangup = () => {
    call && call.hangup();
  };

  const onToggleMuteMic = () => {
    if (call) {
      let micMuted = call.toggleMuteMic();
      console.log('Mic muted:', micMuted);
    }
  }

  const onToggleMuteCam = () => {
    if (call) {
      let camMuted = call.toggleMuteCam();
      console.log('Cam muted:', camMuted);
    }
  }

  const onToggleHold = () => {
    if (call) {
      call.toggleHold();
    }
  }

  const sendDtmf = () => {
    if (call && dtmfDigits) {
      call.sendDtmf(dtmfDigits);
    }
  }

  const sendMessage = () => {
    if (conference && message) {
      conference.sendChat(message);
    }
  }

  const startScreenShare = () => {
    if (call) {
      call.startScreenShare();
    }
  }


  const stopScreenShare = () => {
    if (call) {
      call.stopScreenShare();
    }
  }

  useEffect(() => {
    localVideoElementRef.current && (localVideoElementRef.current.srcObject = localStream);
  },[localVideoElementRef, localStream]);

  useEffect(() => {
    remoteVideoElementRef.current && (remoteVideoElementRef.current.srcObject = remoteStream);
  },[remoteVideoElementRef, remoteStream]);

  return (<div>
    <div className={'border row'}>
      <video hidden={!!conference} className={'col-6'} autoPlay={true} ref={localVideoElementRef} muted={true}/>
      <video className={conference ? 'col-12' : 'col-6'} autoPlay={true} ref={remoteVideoElementRef}/>
    </div>
    <div>
      { timeElapsed ? <Button type="button" variant="primary">{timeElapsed && `${timeElapsed}s`}</Button> : null }
      <Button type="button" variant="danger" onClick={onHangup}>Hangup</Button>
      <Button type="button" onClick={onToggleMuteMic}>Toggle Mic</Button>
      <Button type="button" onClick={onToggleMuteCam}>Toggle Cam</Button>
      <Button type="button" onClick={onToggleHold}>Toggle Hold</Button>
    </div>
    <div className={'input-group my-3'}>
      <input className={'form-control'} placeholder="DTMF here" type="tel" value={dtmfDigits} onChange={e => setDtmfDigits(e.target.value)}/>
      <div className={'input-group-append'}>
        <button className={'btn btn-primary'} onClick={sendDtmf}>Send DTMF</button>
      </div>
    </div>
    <div className={'input-group my-3'}>
      <input className={'form-control'} placeholder="Message here" type="text" value={message} onChange={e => setMessage(e.target.value)}/>
      <div className={'input-group-append'}>
        <button className={'btn btn-primary'} onClick={sendMessage}>Send Message</button>
      </div>
    </div>
    <div className={'my-3'}>
      <button hidden={call && call.screenShareCall} className={'btn btn-primary'} onClick={startScreenShare}>Start Screen Share</button>
      <button hidden={!call || !call.screenShareCall} className={'btn btn-danger'} onClick={stopScreenShare}>Stop Screen Share</button>
    </div>
  </div>);
};
