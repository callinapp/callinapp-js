import React, { useCallback, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import Login from './Login';
import Dialpad from './Dialpad';
import InCall from './InCall';
import CallInAppService from './call-in-app/CallInAppService';
import { useSelector } from 'react-redux';

const cia = CallInAppService.getInstance();

function App() {
  const user = useSelector(state => state.user || {});
  const call = useSelector(state => state.call || {});

  const login = useCallback((user) => {
    cia.login(user);
    console.log(user);
  }, []);

  const handleLogin = (user) => {
    login(user);
  };

  const handleMakeCall = (destinationNumber) => {
    cia.makeCall(destinationNumber);
  };

  const handleLogout = () => {
    cia.logout();
  };

  useEffect(() => {
    cia.user && login(cia.user);
  }, [login]);

  return (
    <Container>
      <div className={'py-3 row'}>
        <div className={'col-7'}>
          <div>Connection Status: <span className={'text-primary'}>{user.connectionStatus}</span></div>
          <div>User Status: <span className={'text-primary'}>{user.userStatus}</span></div>
        </div>
        {
          user.user ? (<div className={'col-5 d-flex justify-content-end align-items-center'}>
            <Button type="button" variant="danger" onClick={handleLogout}>Logout</Button>
          </div>) : null
        }
      </div>

      { !user.user ? <Login handleLogin={handleLogin} user={cia.user}/> : null }
      { (user.user && !call.call) ? <Dialpad handleMakeCall={handleMakeCall}/> : null }
      { call.call ? <InCall call={call.call} /> : null }
    </Container>
  );
}

export default App;
