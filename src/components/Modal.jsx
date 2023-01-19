import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ReCAPTCHA from 'react-google-recaptcha';
import io from 'socket.io-client';
import { Context } from '../context';

const socket = io.connect('http://localhost:5000/');

export const ModalWindow = ({ show, setShow, parent }) => {
  const [newObj, setNewObj] = useState({});
  const [verified, setVerified] = useState(false);
  const { setSocketResponse } = useContext(Context);
  const handleSubmit = () => {
    if (newObj.user_name && newObj.text) {
      setShow(false);

      fetch('http://localhost:5000/comments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newObj, parent_id: parent }),
      }).then(() => {
        console.log('New Added');
      });

      setNewObj();
    }

    socket.emit('sendMess', JSON.stringify({ ...newObj, parent_id: parent }));
  };

  socket.on('addMess', (arg) => {
    setSocketResponse(arg);
  });

  const handleClose = () => {
    setShow(false);
  };

  const onChange = () => {
    setVerified(true);
  };

  const handleAddFile = async (event) => {
    console.log(event.target.files[0].type);
    if (
      ((event.target.files[0].type === 'image/png' ||
        event.target.files[0].type === 'image/gif' ||
        event.target.files[0].type === 'image/jpeg') &&
      event.target.files[0].size < 9731)
      || (event.target.files[0].type === 'text/plain')
    ) {
      const base64 = await convertToBase64(event.target.files[0]);
      setNewObj({ ...newObj, file: base64 });
    } else {
      alert(
        'You can add only .png, .jpg, .gif and size must be less than "320x240"',
      );
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enter your comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={true}>
            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>User Name</Form.Label>
              <Form.Control
                required
                type='text'
                placeholder='Enter User Name'
                onChange={(event) =>
                  setNewObj({ ...newObj, user_name: event.target.value })
                }
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                required
                onChange={(event) =>
                  setNewObj({ ...newObj, email: event.target.value })
                }
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Home Site</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Home Site'
                onChange={(event) =>
                  setNewObj({ ...newObj, home_page: event.target.value })
                }
              />
              <Form.Text className='text-muted'>Optional</Form.Text>
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Your Comment</Form.Label>
              <FloatingLabel controlId='floatingTextarea2' label='Comments'>
                <Form.Control
                  required
                  as='textarea'
                  placeholder='Leave a comment here'
                  style={{ height: '100px' }}
                  onChange={(event) =>
                    setNewObj({ ...newObj, text: event.target.value })
                  }
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group controlId='formFile' className='mb-3'>
              <Form.Label>Choose your file</Form.Label>
              <Form.Control
                type='file'
                name='file'
                onChange={(event) => {
                  handleAddFile(event);
                }}
              />
            </Form.Group>

            <ReCAPTCHA
              sitekey='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
              onChange={onChange}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={handleSubmit} disabled={!verified}>
            Post your message
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
