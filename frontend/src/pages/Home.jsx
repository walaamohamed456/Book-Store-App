
import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import BookCard from '../components/BookCard.jsx';
import AddBookForm from '../components/AddBookForm.jsx';

export default function Home() {
  const { token, isAuthenticated, isAdmin } = useAuth();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getBooks({ limit: 50 });
      // Defensive extraction — never trust the shape blindly.
      const list = Array.isArray(result?.data) ? result.data : [];
      setBooks(list);
    } catch (err) {
      if (err.status === 0) {
        setError('Failed to load books — could not reach the server.');
      } else if (err.status === 500) {
        setError('Failed to load books — something went wrong on the server.');
      } else {
        setError(err.message || 'Failed to load books.');
      }
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  async function handleDelete(book) {
    const confirmed = window.confirm(`Delete "${book.title}"? This cannot be undone.`);
    if (!confirmed) return;
    try {
      await api.deleteBook(book._id, token);
      setBooks((prev) => prev.filter((b) => b._id !== book._id));
    } catch (err) {
      if (err.status === 401) {
        window.alert('Please log in to delete a book.');
      } else if (err.status === 403) {
        window.alert('You are not authorized to delete this book.');
      } else if (err.status === 404) {
        window.alert('That book was already deleted.');
        setBooks((prev) => prev.filter((b) => b._id !== book._id));
      } else {
        window.alert(`Could not delete: ${err.message}`);
      }
    }
  }

  function handleCreated(newBook) {
    setBooks((prev) => [newBook, ...prev]);
  }

  return (
    <div className="home">
      <header className="home__header">
        <div>
          <h1 className="catalog__title">The Book Store Catalog</h1>
        </div>

        {isAuthenticated ? (
          <AddBookForm onCreated={handleCreated} />
        ) : (
          <p className="home__hint">Log in to add a new book.</p>
        )}
      </header>

      {loading && (
        <div className="state-block">
          <p>Fetching cards from the drawer…</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-block state-block--error">
          <p>Couldn't load the catalog: {error}</p>
          <button className="btn btn--ghost" onClick={loadBooks}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="state-block">
          <p>No books in the catalog yet.</p>
          {isAuthenticated && <p>Be the first to add one above.</p>}
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="book-grid">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              canDelete={isAdmin}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
