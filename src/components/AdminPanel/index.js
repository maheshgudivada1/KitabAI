import React, { useState, useEffect } from 'react';
import './index.css';

const AdminPanel = () => {
  const [books, setBooks] = useState([]); // Stores the list of books
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggles form visibility
  const [newBook, setNewBook] = useState({
    image: '',
    author: '',
    publisher: '',
    description: '',
    category: '',
  });
  const [isEditing, setIsEditing] = useState(false); // Track if we're editing a book
  const [editIndex, setEditIndex] = useState(null); // Store the index of the book being edited

  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem('books'));
    if (storedBooks) {
      setBooks(storedBooks);
    }
  }, []);

  const saveBooksToLocalStorage = (updatedBooks) => {
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
  };

  const handleInputChange = (e) => {
    setNewBook({
      ...newBook,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewBook({
        ...newBook,
        image: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleAddOrUpdateBook = () => {
    if (newBook.author && newBook.publisher && newBook.description && newBook.category) {
      if (isEditing) {
        const updatedBooks = books.map((book, index) =>
          index === editIndex ? newBook : book
        );
        saveBooksToLocalStorage(updatedBooks); 
        setIsEditing(false);
        setEditIndex(null);
      } else {
        const updatedBooks = [...books, newBook];
        saveBooksToLocalStorage(updatedBooks); 
      }

      setNewBook({
        image: '',
        author: '',
        publisher: '',
        description: '',
        category: '',
      });
      setIsFormVisible(false);
    } else {
      alert('Please fill out all fields');
    }
  };

  const handleDeleteBook = (index) => {
    const updatedBooks = books.filter((_, i) => i !== index);
    saveBooksToLocalStorage(updatedBooks); 
  };

  const handleEditBook = (index) => {
    setNewBook(books[index]); 
    setIsFormVisible(true); 
    setIsEditing(true); 
    setEditIndex(index); 
  };

  const handleToggleForm = () => {
    setIsFormVisible(!isFormVisible);
    setIsEditing(false); 
  };

  return (
    <div className="admin-panel-container">
      <h1 className='heading'>Admin Panel</h1>

      <div className="admin-book-list">
        {books.length === 0 ? (
          <p>No books available. Add a new book using the "+" icon.</p>
        ) : (
          books.map((book, index) => (
            <div key={index} className="admin-book-item">
              <img src={book.image} alt="Book Cover" className="admin-book-image" />
              <div className="admin-book-details">
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Publisher:</strong> {book.publisher}</p>
                <p><strong>Description:</strong> {book.description}</p>
                <p><strong>Category:</strong> {book.category}</p>
              </div>
              <div className="admin-book-actions">
                <button onClick={() => handleEditBook(index)}>Edit</button>
                <button onClick={() => handleDeleteBook(index)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {isFormVisible && (
        <div className="admin-book-form">
          <h2>{isEditing ? 'Edit Book' : 'Add New Book'}</h2>
          <input type="file" onChange={handleImageChange} />
          <input
            type="text"
            name="author"
            value={newBook.author}
            onChange={handleInputChange}
            placeholder="Author Name"
          />
          <input
            type="text"
            name="publisher"
            value={newBook.publisher}
            onChange={handleInputChange}
            placeholder="Publisher"
          />
          <textarea
            name="description"
            value={newBook.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <input
            type="text"
            name="category"
            value={newBook.category}
            onChange={handleInputChange}
            placeholder="Category"
          />
          <button onClick={handleAddOrUpdateBook}>
            {isEditing ? 'Update Book' : 'Post Book'}
          </button>
        </div>
      )}

      <button className="admin-plus-icon" onClick={handleToggleForm}>+</button>
    </div>
  );
};

export default AdminPanel;
