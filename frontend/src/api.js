
const API_BASE = 'https://book-store-app-production-0763.up.railway.app';
async function request(path, { token, ...options } = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch (networkErr) {
    // fetch() itself threw — the API is unreachable (server down, no CORS, etc.)
    const err = new Error('Could not reach the server. Is the API running?');
    err.status = 0;
    throw err;
  }

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = (data && data.message) || defaultMessageFor(res.status);
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return data;
}

function defaultMessageFor(status) {
  switch (status) {
    case 401:
      return 'You need to log in to do that.';
    case 403:
      return 'You are not authorized to do that.';
    case 404:
      return 'Not found.';
    case 500:
      return 'Something went wrong on the server.';
    default:
      return `Request failed with status ${status}.`;
  }
}

export const api = {
  // Books
  getBooks: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/books${qs ? `?${qs}` : ''}`);
  },
  getBook: (id) => request(`/books/${id}`),
  createBook: (book, token) =>
    request('/books', { method: 'POST', body: JSON.stringify(book), token }),
  updateBook: (id, updates, token) =>
    request(`/books/${id}`, { method: 'PUT', body: JSON.stringify(updates), token }),
  deleteBook: (id, token) => request(`/books/${id}`, { method: 'DELETE', token }),

  // Auth
  register: (payload) => request('/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/login', { method: 'POST', body: JSON.stringify(payload) }),
  getProfile: (token) => request('/profile', { token }),
};
