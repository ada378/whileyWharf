import React from 'react'
import ReactPaginate from 'react-paginate'

const Pagination = ({ pageCount, currentPage, onPageChange }) => {
  if (pageCount <= 1) return null

  return (
    <ReactPaginate
      previousLabel={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
      }
      nextLabel={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
      }
      breakLabel="..."
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      containerClassName="flex items-center justify-center gap-2 mt-8"
      pageClassName="flex"
      pageLinkClassName="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200"
      activeLinkClassName="!bg-indigo-600 !text-white hover:!bg-indigo-700"
      previousClassName="flex"
      previousLinkClassName="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 transition-colors"
      nextClassName="flex"
      nextLinkClassName="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-indigo-50 transition-colors"
      disabledClassName="opacity-40 cursor-not-allowed"
      forcePage={currentPage - 1}
    />
  )
}

export default Pagination
