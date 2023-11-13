// DocumentList.js
import React, { useEffect, useState } from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { Card, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { db } from '../config/firebase';

function DocumentList({ darkMode }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [todoList, setTodoList] = useState([]);
  const [todoTitle, setTodoTitle] = useState('');

  const todoCollectionRef = collection(db, "todos");

  const getTodoList = async () => {
    const data = await getDocs(todoCollectionRef);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTodoList(filteredData);
  };

  useEffect(() => {
    getTodoList();
  }, []);

  const postData = async () => {
    try {
      await addDoc(todoCollectionRef, {
        title: todoTitle,
      });
      handleClose();
      toast.success('Document added successfully', { autoClose: 2000 });
    } catch (error) {
      console.error('Error adding document:', error);
      toast.error('An error occurred while adding the document');
    }
  }

  return (
    <div className={`d-flex w-100 align-items-center justify-content-center flex-column mt-5 ${darkMode ? 'text-light' : 'text-dark'}`} style={{ width: '100%' }}>
      <button className='btn btn-outline-dark p-2' onClick={handleShow}><i className="fa-solid fa-plus me-2"></i>Add a Document</button>
      <div className='row mt-5'>
        <div className='col-lg-9'>
          <div className='d-flex p-5'>
            {todoList.map((todo) => (
              <Card style={{ width: '25rem', margin: '20px' }}>
                <Card.Body>
                  <div className={`d-flex justify-content-between align-items-center `}>
                    <Card.Title className={`text-${darkMode ? 'light' : 'dark'}`}>{todo.title}</Card.Title>
                    <div>
                      <i className="fa-regular fa-pen-to-square me-2"></i>
                      <i className="fa-solid fa-trash text-danger me-2"></i>
                    </div>
                  </div>
                  <Card.Text>{todo.description}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Modal style={{ position: 'absolute', top: '35vh' }} show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Body style={{ height: '20vh' }}>
          <div className='d-flex flex-column align-items-center justify-content-center w-100 h-100'>
            <input type="text" className='w-100 p-1 rounded' placeholder='Document title' value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} />
            <button className='mt-3 rounded ps-5 pe-5' variant="secondary" onClick={postData}>
              Add
            </button>
          </div>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}
export default DocumentList;
