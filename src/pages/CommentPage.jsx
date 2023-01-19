import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { CommentBlock } from '../components/CommentBlock';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import { Loader } from '../components/Loader';
import { ModalWindow } from '../components/Modal';
import { Context } from '../context';

export const CommentPage = () => {
  const [currComment, setCurrComment] = useState();
  const { id } = useParams();
  const { show, setShow, socketResponse } = useContext(Context);
  const [currId, setCurrId] = useState();

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch('http://localhost:5000/comments/' + id)
      ).json();
      // set state when the data received
      setCurrComment(data);
    };

    dataFetch();
  }, [socketResponse]);

  const handleAddMain = () => {
    setShow(true);
    setCurrId(currComment.id);
  };

  return !currComment ? <Loader /> : (
    <div>
      <Card>
        <Card.Body>
        {currComment.file && (<img src={currComment.file} height='80px' alt='picture'/>)} 
          <Card.Title>{currComment.user_name}</Card.Title>
          <Card.Text>{currComment.text}</Card.Text>
          <Button variant='primary' onClick={handleAddMain}>Send answer</Button>
      {currComment.subComments && <CommentBlock subComments={currComment.subComments} setCurrId={setCurrId}/>}
      </Card.Body>
      </Card>
      <Link className='col' to='/'>
        <button type='button' className='btn btn-primary'>
          Go Back
        </button>
      </Link>
      <ModalWindow show={show} setShow={setShow} parent={currId}/>
    </div>
  );
};
