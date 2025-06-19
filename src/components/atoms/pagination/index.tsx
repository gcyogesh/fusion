import React from 'react';
import Link from 'next/link';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  getPageUrl: (page: number) => string;
};

const Pagination = ({ currentPage, totalPages, getPageUrl }: PaginationProps) => {
  const pages = [...Array(totalPages).keys()].map(n => n + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">

      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link href={getPageUrl(currentPage - 1)}>
          <button className="px-4 py-2 border rounded-md text-sm text-primary border-primary hover:bg-blue-100 cursor-pointer transition">
            Previous
          </button>
        </Link>
      ) : (
        <button disabled className="px-4 py-2 border rounded-md text-sm text-gray-400 border-gray-300 cursor-not-allowed">
          Previous
        </button>
      )}

      {/* Page Buttons */}
      {pages.map((page) => (
        <Link href={getPageUrl(page)} key={page}>
          <button
            className={`px-4 py-2 border rounded-md text-sm transition ${
              page === currentPage
                ? 'bg-primary text-white border-primary cursor-default'
                : 'text-gray-700 border-gray-300 hover:bg-primary hover:text-white cursor-pointer'
            }`}
          >
            {page}
          </button>
        </Link>
      ))}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link href={getPageUrl(currentPage + 1)}>
          <button className="px-4 py-2 border rounded-md text-sm text-primary border-primary hover:bg-primary hover:text-white cursor-pointer transition">
            Next
          </button>
        </Link>
      ) : (
        <button disabled className="px-4 py-2 border rounded-md text-sm text-primary border-primary cursor-not-allowed">
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;
