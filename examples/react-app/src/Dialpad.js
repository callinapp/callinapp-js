import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';

export default function Dialpad(props) {
  const [destinationNumber, setDestinationNumber] = useState('');
  const { handleMakeCall } = props;

  const onMakeCall = () => {
    if (destinationNumber) {
      handleMakeCall(destinationNumber)
    }
  };

  return (<Container className={['border', 'py-3']}>
    <Form.Group controlId="wssUrlInput">
      <Form.Label>Destination Number</Form.Label>
      <Form.Control type="text" required placeholder="1111 or +10123456789" value={destinationNumber} onChange={e => setDestinationNumber(e.target.value)}/>
    </Form.Group>
    <Button type="button" onClick={onMakeCall}>Call</Button>
  </Container>);
};
