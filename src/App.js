import { useEffect, useState } from 'react';
import './App.css';
import { db } from './config/firebase';
import { getDocs, collection, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Button, Card, Container, Modal, Navbar } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, Route, Routes } from 'react-router-dom';
import QuillEditor from './Components/QuillEditor';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [todoList, setTodoList] = useState([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDescription, setTodoDescription] = useState('');

  const todoCollectionRef = collection(db, 'todos');

  const deleteTodo = async (id) => {
    const todoDoc = doc(db, 'todos', id);
    await deleteDoc(todoDoc);
    const updatedTodoList = todoList.filter((todo) => todo.id !== id);
    setTodoList(updatedTodoList);
  };

  const getTodoList = async () => {
    const data = await getDocs(todoCollectionRef);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setTodoList(filteredData);
  };

  const postData = async () => {
    try {
      const newDocRef = await addDoc(todoCollectionRef, {
        title: todoTitle,
        description: '',
      });
      const newTodo = { title: todoTitle, description: '', id: newDocRef.id };
      setTodoList([...todoList, newTodo]);
      handleClose();
      toast.success('Document added successfully', { autoClose: 2000 });
    } catch (error) {
      console.error('Error adding document:', error);
      toast.error('An error occurred while adding the document');
    }
  };

  const updateTodo = async (id, newTitle) => {
    const todoDoc = doc(db, 'todos', id);
    await updateDoc(todoDoc, { title: newTitle });
    const updatedList = todoList.map((todo) => {
      if (todo.id === id) {
        todo.title = newTitle;
      }
      return todo;
    });
    setTodoList(updatedList);
    setEditingTodo(null);
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    getTodoList();
  }, []);

  return (
    <>
      <Navbar className={`bg-${darkMode ? 'dark' : 'light'} w-100`} style={{ width: '100%' }}>
        <Container>
          <Navbar.Brand>
            <i className={`fa-solid fa-file fa-beat-fade text-${darkMode ? 'light' : 'dark'}`}></i> Doc App
          </Navbar.Brand>
          <i className={`fa-solid ${darkMode ? 'fa-bolt' : 'fa-moon'} fs-2`} onClick={toggleDarkMode}></i>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/quil/:id" element={<QuillEditor />} />
      </Routes>
      <div className='d-flex w-100 align-items-center justify-content-center flex-column mt-5' style={{ width: '100%' }}>
        <button className='btn btn-outline-dark p-2' onClick={handleShow}><i className="fa-solid fa-plus me-2"></i>Add a Document</button>
        <div className='row mt-5'>
          <div className=''>
            <div className='d-flex justify-content-center p-5'>
            {todoList.map((todo) => (
              <Card style={{ width: '20rem', margin: '20px' }} key={todo.id}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    {editingTodo === todo.id ? (
                      <div>
                        <input
                          type="text"
                          className='w-100'
                          value={editingTitle || todo.title} // Use the editingTitle state when editing, otherwise use the original title
                          onChange={(e) => setEditingTitle(e.target.value)}
                        />
                        <Button variant='primary' onClick={() => updateTodo(todo.id, editingTitle)}>
                          Save
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Card.Title>{todo.title}</Card.Title>
                        <div>
                          <i
                            className="fa-regular fa-pen-to-square me-2"
                            onClick={() => {
                              setEditingTitle(todo.title); // Set editingTitle to the current title when you start editing
                              setEditingTodo(todo.id);
                            }}
                          ></i>
                          <i
                            onClick={() => deleteTodo(todo.id)}
                            className="fa-solid fa-trash text-danger me-2"
                          ></i>
                        </div>
                      </>
                    )}
                  </div>
                  <Link
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    to={`/quil/${todo.id}`}
                  >
                    <div style={{ widows: '100%', minHeight: '30px' }} dangerouslySetInnerHTML={{ __html: todo.description }} />
                  </Link>
                </Card.Body>
              </Card>
            ))}

            </div>
          </div>
        </div>
        <Modal style={{ position: 'absolute', top: '35vh' }} show={show} onHide={handleClose} backdrop="static" keyboard={false}>
          <Modal.Body style={{ height: '20vh' }}>
            <div className='d-flex flex-column align-items-center justify-content-center w-100 h-100'>
              <input
                type="text"
                className='w-100 p-1 rounded'
                placeholder='Document title'
                value={todoTitle}
                onChange={(e) => setTodoTitle(e.target.value)}
              />
              <button
                className='mt-3 rounded ps-5 pe-5'
                variant="secondary"
                onClick={postData}
              >
                Add
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
