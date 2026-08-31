// src/components/BookCard.jsx

export default function BookCard({ book, canDelete, onDelete }) {
  return (
    <article className="card">
      <div className="card__perforation" aria-hidden="true" />
      <div className="card__id">No. {String(book._id).slice(-6).toUpperCase()}</div>

      <h2 className="card__title">{book.title}</h2>
      <p className="card__author">{book.author}</p>

      <dl className="card__facts">
        <div>
          <dt>Published</dt>
          <dd>{book.year ?? '—'}</dd>
        </div>
        <div>
          <dt>Price</dt>
          <dd>{book.price != null ? `$${Number(book.price).toFixed(2)}` : '—'}</dd>
        </div>
        <div>
          <dt>Genre</dt>
          <dd>{book.genre ?? '—'}</dd>
        </div>
      </dl>

      <div className="card__stamp">
        <span>DUE</span>
        <strong>{book.year ?? '—'}</strong>
      </div>

      {canDelete && (
        <div className="card__actions">
          <button className="btn btn--danger" onClick={() => onDelete(book)}>
            Delete
          </button>
        </div>
      )}
    </article>
  );
}
