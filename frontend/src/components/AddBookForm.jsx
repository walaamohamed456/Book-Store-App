// src/components/AddBookForm.jsx

import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const BLANK = { title: '', author: '', year: '', price: '', genre: '' };

const GENRES = [
  'Fiction', 'Non-Fiction', 'Fantasy', 'Science Fiction',
  'Dystopian', 'Software Engineering', 'Programming', 'Biography', 'Other',
];

export default function AddBookForm({ onCreated }) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        year: Number(form.year),
        price: Number(form.price),
      };
      if (form.genre) payload.genre = form.genre;

      const created = await api.createBook(payload, token);
      setForm(BLANK);
      setOpen(false);
      onCreated?.(created);
    } catch (err) {
      if (err.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err.message);
      }
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button className="btn btn--stamp" onClick={() => setOpen(true)}>
        + Accession new title
      </button>
    );
  }

  return (
    <form className="book-form book-form--inline" onSubmit={handleSubmit}>
      <h2 className="book-form__title">New catalog card</h2>

      <label className="field">
        <span>Title</span>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </label>

      <label className="field">
        <span>Author</span>
        <input
          required
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
      </label>

      <div className="field-row">
        <label className="field">
          <span>Year</span>
          <input
            type="number"
            required
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />
        </label>

        <label className="field">
          <span>Price ($)</span>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </label>
      </div>

      <label className="field">
        <span>Genre</span>
        <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
          <option value="">— optional —</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="book-form__actions">
        <button type="button" className="btn btn--ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
        <button type="submit" className="btn btn--stamp" disabled={saving}>
          {saving ? 'Filing…' : 'File card'}
        </button>
      </div>
    </form>
  );
}
