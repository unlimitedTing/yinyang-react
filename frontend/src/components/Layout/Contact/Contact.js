import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearErrors, submitContactForm } from '../../../actions/contactAction';
import { CLEAR_CONTACT } from '../../../constants/contactConstants';
import MetaData from '../MetaData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faPaperclip,
  faComment
} from '@fortawesome/free-solid-svg-icons';

const ContactForm = () => {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector(state => state.contact);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success('Contact form submitted successfully');
      dispatch({ type: CLEAR_CONTACT });
    }
  }, [dispatch, error, success]);

  const submitFormHandler = e => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set('name', name);
    myForm.set('email', email);
    myForm.set('subject', subject);
    myForm.set('message', message);

    dispatch(submitContactForm(myForm));
  };

  return (
    <Fragment>
      <MetaData title='Contact Us' />
      <div className='newContactContainer p-4'>
        <form className='createContactForm' onSubmit={submitFormHandler}>
          <h1 className='text-3xl font-bold mb-4'>Contact Us</h1>

          <div className='flex items-center mb-4'>
            <FontAwesomeIcon icon={faUser} className='mr-2' />
            <input
              type='text'
              placeholder='Your Name'
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className='border border-gray-300 rounded-md p-2 w-full'
            />
          </div>
          <div className='flex items-center mb-4'>
            <FontAwesomeIcon icon={faEnvelope} className='mr-2' />
            <input
              type='email'
              placeholder='Your Email'
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='border border-gray-300 rounded-md p-2 w-full'
            />
          </div>

          <div className='flex items-center mb-4'>
            <FontAwesomeIcon icon={faPaperclip} className='mr-2' />
            <input
              type='text'
              placeholder='Subject'
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className='border border-gray-300 rounded-md p-2 w-full'
            />
          </div>

          <div className='flex items-center mb-4'>
            <FontAwesomeIcon icon={faComment} className='mr-2' />
            <textarea
              placeholder='Your Message'
              value={message}
              onChange={e => setMessage(e.target.value)}
              cols='30'
              rows='5'
              className='border border-gray-300 rounded-md p-2 w-full'
            ></textarea>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300'
          >
            Submit
          </button>
        </form>
      </div>
    </Fragment>
  );
};

export default ContactForm;
