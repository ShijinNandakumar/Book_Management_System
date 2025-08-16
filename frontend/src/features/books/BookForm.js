import React, { useState, useEffect } from 'react';
import {
  useAddBookMutation,
  useUpdateBookMutation,
} from '../../app/api';

export default function BookForm({ book = {}, onClose }) {
  const [title, setTitle] = useState(book.title || '');
  const [author, setAuthor] = useState(book.author || '');
  const [ISBN, setISBN] = useState(book.ISBN || '');

  const [addBook] = useAddBookMutation();
  const [updateBook] = useUpdateBookMutation();

  useEffect(() => {
    setTitle(book.title || '');
    setAuthor(book.author || '');
    setISBN(book.ISBN || '');
  }, [book]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (book._id) {
      await updateBook({ id: book._id, title, author, ISBN });
    } else {
      await addBook({ title, author, ISBN });
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#f5f5f5', padding: 12, margin: 12 }}>
      <h3>{book._id ? 'Edit Book' : 'Add Book'}</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        required
        onChange={(e) => setTitle(e.target.value)}
      /><br/>
      <input
        type="text"
        placeholder="Author"
        value={author}
        required
        onChange={(e) => setAuthor(e.target.value)}
      /><br/>
      <input
        type="text"
        placeholder="ISBN"
        value={ISBN}
        required
        onChange={(e) => setISBN(e.target.value)}
      /><br/>
      <button type="submit">{book._id ? 'Update' : 'Add'}</button>
      <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
    </form>
  );
}