import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Context } from '../context';
import { BsFillFileEarmarkMedicalFill } from "react-icons/bs";

export const CommentBlock = ({ subComments, setCurrId }) => {

  const { setShow } = useContext(Context);
  
  const handleShow = () => {
    setCurrId(subComments[0].id);
    setShow(true);
  };

  return (
    <>
    {subComments.map(sub => (<Card key={sub.id}>
        <Card.Body >
        {sub.file && <img src={sub.file} height='80px' alt='picture'/>}
          <Card.Title>{sub.user_name}</Card.Title>
          <Card.Text>{sub.text}</Card.Text>
          <Button variant='primary' onClick={handleShow}>Send answer</Button>
          {sub.subComments && (
            <CommentBlock subComments={sub.subComments} setCurrId={setCurrId}/>
          )}
        </Card.Body>
      </Card>))}
    </>
  );
};
