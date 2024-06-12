import "./Pagination.css"
const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const displayPageNumbers = pageNumbers.slice(
    Math.max(0, currentPage - 2),
    Math.min(currentPage + 3, pageNumbers.length)
  );

  return (
    <ul className="pagination">
      <li className="page-item">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="page-link"
        >
          Previous
        </button>
      </li>
      {displayPageNumbers.map((number) => (
        <li key={number} className="page-item">
          <button
            onClick={() => paginate(number)}
            href="#"
            className="page-link"
          >
            {number}
          </button>
        </li>
      ))}
      <li className="page-item">
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
          className="page-link"
        >
          Next
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
