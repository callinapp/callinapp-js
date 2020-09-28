import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function Login(props) {
  const { handleLogin, user } = props;

  const [wssUrl, setWssUrl] = useState(user ? user.wssUrl : '');
  const [extension, setExtension] = useState(user? user.extension : '');
  const [domain, setDomain] = useState(user ? user.domain : '');
  const [password, setPassword] = useState(user ? user.password: '');
  const [callerIdName, setCallerIdName] = useState((user && user.callOptions) ? user.callOptions.callerIdName : '');
  const [callerIdNumber, setCallerIdNumber] = useState((user && user.callOptions) ? user.callOptions.callerIdNumber: '');
  const [email, setEmail] = useState((user && user.userInfo) ? user.userInfo.email : '');

  const onSubmit = (evt => {
    evt.preventDefault();

    const user = {
      wssUrl,
      extension,
      domain,
      password,
      callOptions: {
        callerIdName,
        callerIdNumber,
      },
      userInfo: {
        email
      }
    };

    handleLogin(user);
  });

  return (<Form onSubmit={onSubmit}>
    <Form.Group controlId="wssUrlInput">
      <Form.Label>WSS URL</Form.Label>
      <Form.Control type="text" required placeholder="wss://domain.com:8082" value={wssUrl} onChange={e => setWssUrl(e.target.value)}/>
    </Form.Group>

    <Form.Group controlId="extensionInput">
      <Form.Label>Extension</Form.Label>
      <Form.Control type="text" required placeholder="1234" value={extension} onChange={e => setExtension(e.target.value)}/>
    </Form.Group>

    <Form.Group controlId="domainInput">
      <Form.Label>Domain</Form.Label>
      <Form.Control type="text" required placeholder="domain.com" value={domain} onChange={e => setDomain(e.target.value)}/>
    </Form.Group>

    <Form.Group controlId="passwordInput">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" required autoComplete={'current-password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
    </Form.Group>

    <Form.Group controlId="callerIdNameInput">
      <Form.Label>Caller ID Name</Form.Label>
      <Form.Control type="text" placeholder="Caller ID Name" value={callerIdName} onChange={e => setCallerIdName(e.target.value)}/>
    </Form.Group>

    <Form.Group controlId="callerIdNumberInput">
      <Form.Label>Caller ID Number</Form.Label>
      <Form.Control type="text" placeholder="Caller ID Number" value={callerIdNumber} onChange={e => setCallerIdNumber(e.target.value)}/>
    </Form.Group>

    <Form.Group controlId="emailInput">
      <Form.Label>Email</Form.Label>
      <Form.Control type="email" autoComplete={'email'} placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)}/>
    </Form.Group>

    <Button variant="primary" type="submit">
      Login
    </Button>
  </Form>);
};
