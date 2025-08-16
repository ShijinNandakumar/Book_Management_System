const express = require('express');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /books - get all books (with optional search, pagination, and sorting)
router.get('/', auth, async (req, res) => {
  let { page = 1, limit = 10, search = '', sort = 'createdAt', order = 'desc' } = req.query;

  // Defensive conversion and fallback
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { ISBN: { $regex: search, $options: 'i' } }
        ]
      }
    : {};

  try {
    const books = await Book.find(query)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Book.countDocuments(query);

    res.json({ books, total: count, page, pages: Math.ceil(count / limit) });
  } catch (err) {
    // Log error for debugging
    console.error('Error in GET /books:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}); // <----- THIS LINE WAS MISSING

// POST /books - add a new book
router.post('/', auth, async (req, res) => {
  const { title, author, ISBN } = req.body;
  try {
    const book = new Book({ title, author, ISBN, user: req.user.id });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: 'Error adding book.' });
  }
});

// PUT /books/:id - update a book
router.put('/:id', auth, async (req, res) => {
  const { title, author, ISBN } = req.body;
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    // Optionally: only allow owner to edit
    // if (book.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized.' });

    book.title = title || book.title;
    book.author = author || book.author;
    book.ISBN = ISBN || book.ISBN;
    await book.save();

    res.json(book);
  } catch (err) {
    res.status(400).json({ message: 'Error updating book.' });
  }
});

// DELETE /books/:id - delete a book
router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });

    // Optionally: only allow owner to delete
    // if (book.user.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized.' });

    await book.deleteOne();
    res.json({ message: 'Book deleted.' });
  } catch (err) {
    res.status(400).json({ message: 'Error deleting book.' });
  }
});

module.exports = router;