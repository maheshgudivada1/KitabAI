import "./index.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaBars, FaTimes } from "react-icons/fa";
import AdminDashboard from "../AdminDashboard"

const Feedback = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookList, setShowBookList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [coverPageFile, setCoverPageFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [searchType, setSearchType] = useState("title");
  const [errorMessage, setErrorMessage] = useState("");
  const [originalBooks, setOriginalBooks] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [files, setFiles] = useState([]);
  const [bookDetails, setBookDetails] = useState({
    _id: "",
    title: "",
    category: "",
    startRating: 0,
    totalPages: "",
    description: "",
    reviews: "",
    mrp: "",
    discount: "",
    discountedPrice: "",
    author: "",
    publisher: "",
    isbnNumber: "",
    popularity: "Low",
    coverPageUrl: ""
  });
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const apiUrl = "https://kitabai-books.onrender.com/getbooks";

  const categories = [
    "Art & Design",
    "Autobiography",
    "Biography",
    "Business & Economics",
    "Children’s Books",
    "Classics",
    "Competitive Exam",
    "Cookbooks",
    "Fantasy",
    "Fiction",
    "Graphic Novels/Comics",
    "Health & Wellness",
    "History",
    "Mystery/Thriller",
    "Non-fiction",
    "Philosophy",
    "Poetry",
    "Religion",
    "Romance",
    "Science Fiction",
    "Self-help",
    "Spirituality",
    "Sports",
    "Technology",
    "Travel",
    "Others"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCoverPageFile(e.target.files[0]);
  };
  const displaySingleBook = (book) => {
    setSelectedBook(book);
    setShowBookList(false);
  };



  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const presignedUrlResponse = await axios.post(
        `https://kitabai-books.onrender.com/coverpagepresignedurl`,
        {
          folderName: 'Books',
          fileName: bookDetails.title,
        }
      );
      const presignedUrl = presignedUrlResponse.data.url;
      await axios.put(presignedUrl, coverPageFile, {
        headers: { 'Content-Type': coverPageFile.type },
      });

      const response = await axios.post(
        `$https://kitabai-books.onrender.com/uploadbooks`,
        {
          ...bookDetails,
          coverPageUrl: presignedUrl.split('?')[0],
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      // Fetch and show the updated book list (with the QR code)
      fetchBooks();
      setSuccess(true);
      setIsPopupOpen(false);

      console.log('Book uploaded successfully, QR code generated:', response.data.book.qrCodeUrl);
    } catch (error) {
      console.error('Error uploading book:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let updatedBookDetails = { ...bookDetails };

      if (coverPageFile) {
        const presignedUrlResponse = await axios.post(`https://kitabai-books.onrender.com/coverpagepresignedurl`, {
          folderName: 'Books',
          fileName: bookDetails.title,
        });

        const presignedUrl = presignedUrlResponse.data.url;

        await axios.put(presignedUrl, coverPageFile, {
          headers: {
            'Content-Type': coverPageFile.type,
          },
        });

        updatedBookDetails = {
          ...updatedBookDetails,
          coverPageUrl: presignedUrl.split('?')[0]
        };
      }

      const response = await axios.put(
        `$https://kitabai-books.onrender.com/updatebook/${bookDetails._id}`,
        updatedBookDetails
      );

      // Update the book list state with the new book details
      setBooks(books.map(book => book._id === bookDetails._id ? response.data.book : book));
      fetchBooks()
      setSuccess(true);
      setIsEditPopupOpen(false);
      alert("Book Updated Successfully");
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Error updating book:", error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch('https://kitabai-books.onrender.com/getbooks');
      const data = await response.json();
      setOriginalBooks(data);
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filterBooks = (category, query, type) => {
    let filteredBooks = originalBooks;
    if (category) {
      filteredBooks = filteredBooks.filter((book) => book.category === category);
    }
    if (query) {
      filteredBooks = filteredBooks.filter((book) => {
        const title = book.title?.toLowerCase() || "";
        const author = book.author_name?.toLowerCase() || "";
        const isbn = book.isbn?.toLowerCase() || "";
        return type === "title"
          ? title.includes(query.toLowerCase())
          : type === "author"
            ? author.includes(query.toLowerCase())
            : isbn.includes(query.toLowerCase());
      });
    }
    setBooks(filteredBooks);
  };

  const toggleMenu = (bookId) => {
    setOpenMenu(openMenu === bookId ? null : bookId);
  };

  const handleEdit = (book) => {
    setBookDetails(book);
    setIsEditPopupOpen(true);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `https://kitabai-books.onrender.com/deletebook/${bookToDelete._id}`
      );

      if (response.status === 200) {
        // Update the book list state to reflect the deletion
        setBooks(books.filter(book => book._id !== bookToDelete._id));
        setIsDeletePopupOpen(false);
        alert("Book deleted successfully");
      } else {
        alert("Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Error deleting book:", error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedMenu = event.target.closest(".dropdown-menu");
      if (clickedMenu) {
        const bookId = clickedMenu.dataset.bookId;
        if (bookId !== openMenu?.toString()) {
          setOpenMenu(null);
        }
      } else {
        setOpenMenu(null);
      }
    };

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  const handleFileChanges = (e) => {
    const selectedFiles = Array.from(e.target.files).map((file, index) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            details: file.name,
            type: file.type,
            date: new Date().toLocaleString(),
            sNo: files.length + index + 1,
            data: reader.result.split(',')[1], // Extract base64 content
            url: URL.createObjectURL(file),
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(selectedFiles).then((filesWithContent) => {
      setFiles([...files, ...filesWithContent]);
    });
  };

  const handleFileUpload = async () => {
    try {
      const response = await fetch(`https://kitabai-books.onrender.com/addFilesToBook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: selectedBook._id,
          files: files,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Files added successfully');
        setFiles([]); // Clear the files state after successful upload
        fetchBooks()
      } else {
        alert('Error adding files');
      }
    } catch (err) {
      console.error('Error uploading files:', err);
      alert('Error uploading files');
    }
  };

  // Clear files state
  const clearFiles = () => {
    setFiles([]);
  };

  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="app-container">
      {isSidebarOpen?<AdminDashboard/>:null}
      <aside className="categorys">
        <button onClick={toggleSidebar} className="hamburger-button">
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h4 style={{ color: "black" }}>Book Categories</h4>
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category} className="category-item">
              <button
                onClick={() => {
                  setSelectedCategory(category);
                  filterBooks(category, searchQuery, searchType);
                }}
                className="category-button"
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="main-content">


        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            filterBooks(selectedCategory, searchQuery, searchType);
          }}
        >
          <label htmlFor="search-input" className="search-label">
            Search:
          </label>
          <input
            type="text"
            id="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter title, author, or ISBN"
            className="search-input"
            required
          />
          <label htmlFor="search-type" className="search-label">
            Search by:
          </label>
          <select
            id="search-type"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-select"
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="isbn">ISBN</option>
          </select>
          <button type="submit" className="search-button">
            Search
          </button>
          <button
            onClick={() => {
              setIsPopupOpen(true);
            }}
            className="upload-button"
          >
            Upload Book
          </button>
        </form>

        {isPopupOpen && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h1 className="popup-title">Upload Book</h1>
              {success && <p className="success-message">Book uploaded successfully!</p>}
              <button
                className="close-button"
                onClick={() => setIsPopupOpen(false)}
              >
                Close
              </button>
              <form onSubmit={handleUpload} className="upload-form">
                <input
                  type="text"
                  name="title"
                  placeholder="Book Title"
                  value={bookDetails.title}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Book Category"
                  value={bookDetails.category}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <input
                  type="number"
                  name="startRating"
                  placeholder="Start Rating"
                  value={bookDetails.startRating}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <input
                  type="number"
                  name="totalPages"
                  placeholder="Total Pages"
                  value={bookDetails.totalPages}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={bookDetails.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                />
                <textarea
                  name="reviews"
                  placeholder="Reviews"
                  value={bookDetails.reviews}
                  onChange={handleInputChange}
                  className="form-textarea"
                />
                <input
                  type="number"
                  name="mrp"
                  placeholder="MRP"
                  value={bookDetails.mrp}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <input
                  type="number"
                  name="discount"
                  placeholder="Discount"
                  value={bookDetails.discount}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <input
                  type="number"
                  name="discountedPrice"
                  placeholder="Discounted Price"
                  value={bookDetails.discountedPrice}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <input
                  type="text"
                  name="author"
                  placeholder="Author"
                  value={bookDetails.author}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  name="publisher"
                  placeholder="Publisher"
                  value={bookDetails.publisher}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  name="isbnNumber"
                  placeholder="ISBN Number"
                  value={bookDetails.isbnNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <select
                  name="popularity"
                  value={bookDetails.popularity}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="form-file"
                  required
                />
                <button type="submit" className="upload-button">
                  Upload
                </button>
              </form>
            </div>
          </div>
        )}

        {isEditPopupOpen && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h1 className="popup-title">Edit Book Details</h1>
              <button
                className="close-button"
                onClick={() => setIsEditPopupOpen(false)}
              >
                Close
              </button>
              <form onSubmit={handleUpdate} className="upload-form">
                <input
                  type="text"
                  name="title"
                  placeholder="Book Title"
                  value={bookDetails.title}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Book Category"
                  value={bookDetails.category}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <input
                  type="number"
                  name="startRating"
                  placeholder="Start Rating"
                  value={bookDetails.startRating}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <input
                  type="number"
                  name="totalPages"
                  placeholder="Total Pages"
                  value={bookDetails.totalPages}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  value={bookDetails.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                />
                <textarea
                  name="reviews"
                  placeholder="Reviews"
                  value={bookDetails.reviews}
                  onChange={handleInputChange}
                  className="form-textarea"
                />
                <input
                  type="number"
                  name="mrp"
                  placeholder="MRP"
                  value={bookDetails.mrp}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <input
                  type="number"
                  name="discount"
                  placeholder="Discount"
                  value={bookDetails.discount}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <input
                  type="number"
                  name="discountedPrice"
                  placeholder="Discounted Price"
                  value={bookDetails.discountedPrice}
                  onChange={handleInputChange}
                  className="form-input"
                />
                <input
                  type="text"
                  name="author"
                  placeholder="Author"
                  value={bookDetails.author}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  name="publisher"
                  placeholder="Publisher"
                  value={bookDetails.publisher}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <input
                  type="text"
                  name="isbnNumber"
                  placeholder="ISBN Number"
                  value={bookDetails.isbnNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <select
                  name="popularity"
                  value={bookDetails.popularity}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="form-file"
                />
                <button type="submit" className="upload-button">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}

        {isDeletePopupOpen && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h1 className="popup-title">Confirm Deletion</h1>
              <p>Are you sure you want to delete this book?</p>
              <button className="confirm-button" onClick={handleDelete}>
                Confirm
              </button>
              <button
                className="cancel-button"
                onClick={() => setIsDeletePopupOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showBookList && (
          <div className="book-list">
            <div className="book-grid">
              {books.map((book) => (
                <div key={book._id} className="book-card">
                  <div className="menu">
                    <button
                      className="menu-dots"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(book._id);
                      }}
                    >
                      ...
                    </button>
                    {openMenu === book._id && (
                      <div
                        className="dropdown-menu"
                        data-book-id={book._id}
                      >
                        <button
                          onClick={() => {
                            handleEdit(book);
                            setOpenMenu(null);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setBookToDelete(book);
                            setIsDeletePopupOpen(true);
                            setOpenMenu(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="book-card-header" onClick={() => displaySingleBook(book)}>
                    <img src={book.coverUrl} alt={book.title} className="book-cover" />
                  </div>

                  <div>
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">{book.author}</p>
                    <p className="book-category">{book.category}</p>
                    <p className="book-rating">Rating: {book.starRating}</p>
                    <p className="book-price">Price: ₹{book.discountedPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedBook && !showBookList && (
          <div className="book-details-container">
            <div className="book-details">
              <div className="book-details-left">
                <img
                  src={selectedBook.coverUrl}
                  alt={selectedBook.title}
                  className="book-details-cover"
                />
              </div>
              <div className="qr-code-container">
                {/* QR Code Image */}
                <img src={selectedBook.qrCodeUrl} alt="QR Code for Book" className="qr-code-image" />
                
                {/* Download Button */}
                <a href={selectedBook.qrCodeUrl} download="book-qr-code.png" className="qr-download-link">
                  <button className="qr-download-button" type="button">Download QR Code</button>
                </a>
              </div>

              <div className="book-details-right">
                <h2 className="book-details-title">{selectedBook.title}</h2>
                <p className="book-details-info">
                  <strong>Category:</strong> {selectedBook.category}
                </p>
                <p className="book-details-info">
                  <strong>Author:</strong> {selectedBook.author}
                </p>
                <p className="book-details-info">
                  <strong>Description:</strong> {selectedBook.description}
                </p>
                <p className="book-details-info">
                  <strong>Rating:</strong> <span className="star-rating">{renderStarRating(selectedBook.starRating)}</span>
                </p>
                <p className="book-details-info">
                  <strong>Pages:</strong> {selectedBook.totalPage}
                </p>
                <p className="book-details-info">
                  <strong>MRP:</strong> ₹{selectedBook.MRP}
                </p>
                <p className="book-details-info">
                  <strong>Discounted Price:</strong> ₹{selectedBook.discountedPrice}
                </p>
                <p className="book-details-info">
                  <strong>ISBN:</strong> {selectedBook.isbn}
                </p>
                <p className="book-details-info">
                  <strong>Publisher:</strong> {selectedBook.publisher}
                </p>
                <p className="book-details-info">
                  <strong>Reviews:</strong> {selectedBook.reviews.join(", ")}
                </p>

                {/* Check if the book has files */}
                {selectedBook.files && selectedBook.files.length > 0 && (
                  <div className="book-files-container">
                    <h3 className="book-files-title">Associated Files</h3>
                    <ul className="book-files-list">
                      {selectedBook.files.map((file, index) => (
                        <li key={file._id} className="book-file-item">
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            {file.name}
                          </a>
                          <p className="file-info">
                            <strong>Type:</strong> {file.type}
                          </p>
                          <p className="file-info">
                            <strong>Uploaded On:</strong> {new Date(file.date).toLocaleString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="add-files-container">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChanges}
                  />
                  <button
                    className="add-files-button btn btn-primary"
                    onClick={handleFileUpload}
                  >
                    Add Files
                  </button>
                </div>

                <button className="back-button" onClick={() => setShowBookList(true)}>
                  Back to List
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Feedback;