import { useEffect, useState } from 'react';
import { useQuill } from 'react-quilljs';
import { doc, updateDoc, collection, getDoc } from 'firebase/firestore'; // Import Firestore functions
import 'quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom'; // Import useParams
import { db } from '../config/firebase';

function QuillEditor() {
  const { quill, quillRef } = useQuill();
  const [value, setValue] = useState('');
  const todoCollection = collection(db, 'todos'); // Reference to the "todos" collection
  const { id } = useParams(); // Get the id from the URL

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        const newValue = quillRef.current.firstChild.innerHTML;
        setValue(newValue);
      });
    }
  }, [quill]);

  useEffect(() => {
    if (value) {
      const todoDoc = doc(todoCollection, id);

      const updateDocument = async () => {
        try {
          await updateDoc(todoDoc, { description: value });
        } catch (error) {
          console.error('Error updating document:', error);
        }
      };

      updateDocument();
    }
  }, [value, id]);

  useEffect(() => {
    const fetchData = async () => {
      const todoDoc = doc(todoCollection, id);
      const docSnap = await getDoc(todoDoc);

      if (docSnap.exists()) {
        const description = docSnap.data().description;
        if (quill && description) {
          quill.clipboard.dangerouslyPasteHTML(description); // Update this line
        }
      } else {
        console.log('No such document!');
      }
    };

    fetchData();
  }, [id, quill]);

  return (
    <div style={{ width: '100%', maxWidth: 8000, margin: 'auto', height: '50vh' }}>
      <div ref={quillRef} />
    </div>
  );
}

export default QuillEditor;
