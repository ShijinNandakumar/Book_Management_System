import React, { useState } from 'react';
import {
  useGetBooksQuery,
  useDeleteBookMutation,
} from '../../app/api';
import BookForm from './BookForm';

export default function BookTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [editingBook, setEditingBook] = useState(null);

  const { data, isLoading, error, refetch } = useGetBooksQuery({
    page,
    search,
    sort,
    order,
    limit: 10,
  });

  const [deleteBook] = useDeleteBookMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Delete this book?')) {
      await deleteBook(id);
      refetch();
    }
  };

  const handleEdit = (book) => setEditingBook(book);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading books.</p>;

  return (
    <div>
      <h2>Books</h2>
      <input
        type="text"
        placeholder="Search by title/author/ISBN"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button onClick={() => setPage(1)}>Search</button>
      <button onClick={() => setEditingBook({})}>Add Book</button>
      <table border="1" cellPadding="6" style={{ width: '100%', marginTop: 12 }}>
        <thead>
          <tr>
            <th>
              <button onClick={() => { setSort('title'); setOrder(order === 'asc' ? 'desc' : 'asc'); }}>
                Title {sort === 'title' ? (order === 'asc' ? '▲' : '▼') : ''}
              </button>
            </th>
            <th>
              <button onClick={() => { setSort('author'); setOrder(order === 'asc' ? 'desc' : 'asc'); }}>
                Author {sort === 'author' ? (order === 'asc' ? '▲' : '▼') : ''}
              </button>
            </th>
            <th>ISBN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.books.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.ISBN}</td>
              <td>
                <button onClick={() => handleEdit(book)}>Edit</button>
                <button onClick={() => handleDelete(book._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 10 }}>
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span> Page {data.page} of {data.pages} </span>
        <button onClick={() => setPage((p) => Math.min(data.pages, p + 1))} disabled={page === data.pages}>Next</button>
      </div>
      {editingBook && (
        <BookForm
          book={editingBook}
          onClose={() => { setEditingBook(null); refetch(); }}
        />
      )}
    </div>
  );
}