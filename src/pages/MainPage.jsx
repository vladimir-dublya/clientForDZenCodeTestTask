import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ModalWindow } from '../components/Modal';
import Button from 'react-bootstrap/Button';
import { Loader } from '../components/Loader';
import { Context } from '../context';

export const MainPage = () => {
  const [comments, setComments] = useState([]);
  const { show, setShow, socketResponse } = useContext(Context);

  const handleShow = () => setShow(true);

  useEffect(() => {
    const dataFetch = async () => {
      const data = await (
        await fetch('https://papaya-concha-993cdf.netlify.app/comments/')
      ).json();

      // set state when the data received
      setComments(data);
    };

    console.log('Socket ', socketResponse);

    dataFetch();
  }, [socketResponse]);

  return !comments ? (
    <Loader />
  ) : (
    <div className='container text-center'>
      <div className='row row-cols-5'>
        {comments.map((comment) => {
          return (
            <Link
              className='col'
              to={`/commentPage/${comment.id}`}
              key={comment.id}
            >
              <div className='card'>
                <div className='card-body'>
                  {comment.file && (
                    <img src={comment.file} height='80px' alt='picture' />
                  )}
                  <h5 className='card-title'>{comment.user_name}</h5>
                  <p className='card-text'>{comment.text}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <Button variant='primary' onClick={handleShow}>
        Add Comment
      </Button>
      <ModalWindow show={show} setShow={setShow} parent={null} />
    </div>
  );
};
