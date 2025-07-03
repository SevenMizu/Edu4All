import { useState } from 'react';
import { searchSessions } from '../api/sessionApi';

/**
 * A React component for searching sessions by keyword.
 * Renders an input box for the keyword, a search button, and a list of results.
 */
const SearchSessions = () => {
  // State for the search keyword input
  const [keyword, setKeyword] = useState('');
  // State for the search results
  const [results, setResults] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(false);
  // State for error message
  const [error, setError] = useState('');

  /**
   * Handles the search button click.
   * Calls the backend API to search for sessions and updates the results.
   */
  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await searchSessions(keyword);
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch sessions.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Search Sessions</h2>
      <input
        type="text"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="Enter keyword"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {results.map(session => (
          <li key={session.vaId}>
            <strong>{session.title}</strong> — {session.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSessions;