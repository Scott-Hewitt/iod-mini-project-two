import React from "react";

const Pagination = ({ currentPage, totalPages, paginate }) => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const maxVisiblePages = 5;
        let startPage, endPage;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if there are fewer than maxVisiblePages
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage <= 3) {
            // Show first maxVisiblePages pages
            startPage = 1;
            endPage = maxVisiblePages;
        } else if (currentPage + 2 >= totalPages) {
            // Show last maxVisiblePages pages
            startPage = totalPages - maxVisiblePages + 1;
            endPage = totalPages;
        } else {
            // Show currentPage in middle of range
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers.map(number => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                <button className="page-link" onClick={() => paginate(number)}>
                    {number}
                </button>
            </li>
        ));
    };

    return (
        <nav>
            <ul className="pagination pagination-md justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                        <i className="bi bi-chevron-left"></i>
                    </button>
                </li>

                {renderPageNumbers()}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;