// src/components/CenteredSearchBar.jsx

export default function CenteredSearchBar({
  placeholder = 'Search for sessions or educational resources...',
  onSearch = () => {}
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(e.target.value);
    }
  };

  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="d-flex justify-content-center my-4">
      <div className="input-group w-50">
        <input
          type="text"
          className="form-control main-searchbar"
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={handleChange}
          onKeyPress={handleKeyPress} 
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={() => {
            const val = document.querySelector('.input-group input').value;
            onSearch(val);
          }}
        >
          <i className="bi bi-search"></i>
        </button>
      </div>
    </div>
  );
}
