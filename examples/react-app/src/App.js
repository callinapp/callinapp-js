import React, { useCallback, useEffect } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';
import Login from './Login';
import Dialpad from './Dialpad';
import InCall from './InCall';
import CallInAppService from './call-in-app/CallInAppService';
import { useSelector } from 'react-redux';

const cia = CallInAppService.getInstance();

function App() {
  const ciaUser = useSelector(state => state.user || {});
  const ciaCall = useSelector(state => state.call || {});

  const login = useCallback((user) => {
    cia.login(user);
    console.log(user);
  }, []);

  const logout = useCallback(() => {
    cia.logout();
  }, []);

  const handleLogin = (user) => {
    login(user);
  };

  const handleMakeCall = (destinationNumber) => {
    cia.makeCall(destinationNumber);
  };

  const handleLogout = () => {
    logout();
  };

  const rejectIncomingCall = () => {
    cia.hangupIncomingCall();
  };

  const answerIncomingCall = () => {
    cia.answerIncomingCall();
  };

  useEffect(() => {
    // Ignore if user has logged in
    if (cia.isLoggedIn) {
      console.log('User has logged in');
      return;
    }

    cia.user && login(cia.user);
  }, [login]);

  return (
    <Container>
      <div className={'py-3 row'}>
        <div className={'col-7'}>
          <div>Connection Status: <span className={'text-primary'}>{ciaUser.connectionStatus}</span></div>
          <div>User Status: <span className={'text-primary'}>{ciaUser.userStatus}</span></div>
        </div>
        {
          ciaUser.user ? (<div className={'col-5 d-flex justify-content-end align-items-center'}>
            <Button type="button" variant="danger" onClick={handleLogout}>Logout</Button>
          </div>) : null
        }
      </div>

      { !ciaUser.user ? <Login handleLogin={handleLogin} user={cia.user}/> : null }
      { (ciaUser.user && !ciaCall.call) ? <Dialpad handleMakeCall={handleMakeCall}/> : null }
      { ciaCall.call ? <InCall call={ciaCall.call} /> : null }

      <Modal show={!!ciaCall.incomingCall}>
        <Modal.Header closeButton={false}>
          <Modal.Title>Incoming Call</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ciaCall.incomingCall ? (ciaCall.incomingCall.options.callerIdName || ciaCall.incomingCall.options.callerIdNumber) : 'Someone'} is calling you...!</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={rejectIncomingCall}>
            Reject
          </Button>
          <Button variant="primary" onClick={answerIncomingCall}>
            Answer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
