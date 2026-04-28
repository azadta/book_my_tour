interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  onPageChange,
  totalPages,
}: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center mt-8 space-x-2">
      <button
        disabled={currentPage === 1}
        onClick={handlePrev}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        Prev
      </button>
      {[...Array(totalPages)].map((_, idx) => {
        const page = idx + 1;
        return <button key={page} onClick={()=>onPageChange(page)} className={`px-4 py-2 rounded ${currentPage===page?'bg-green-600 text-white ':'bg-gray-200'}`}>{page}</button>;
      })}
      <button
        disabled={currentPage === totalPages}
        onClick={handleNext}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
