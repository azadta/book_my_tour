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

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if(totalPages<=5){
      for(let i=1;i<=totalPages;i++){
        pages.push(i)
      }
      return pages
    }
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages)
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-1.5 mt-8 sm:gap-2 px-2">
      <button
        disabled={currentPage === 1}
        onClick={handlePrev}
        className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-blue-600 active:scale-95 transition-all"
      >
        <span className="inline min-[360px]:hidden ">&lt;</span>
        <span className="hidden min-[360px]:inline ">Prev</span>
      </button>
      <div className="flex justify-center items-center  gap-1.5 sm:gap-2 px-2">
        {getPageNumbers().map((page, idx) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-1.5 sm:px-2 text-gray-400 text-sm font-bold"
              >
                ...
              </span>
            );
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-3 sm:px-4  py-1.5 sm:py-2 text-xs sm:text-sm font-semibold  rounded-lg transition-all ${currentPage === page ? "bg-green-600 text-white shadow-sm " : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95"}`}
            >
              {page}
            </button>
          );
        })}
      </div>
      <button
        disabled={currentPage === totalPages}
        onClick={handleNext}
        className="px-3 sm:px-4  py-1.5 sm:py-2 text-xs sm:text-sm font-medium  bg-blue-500 text-white rounded-lg  disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-blue-600 active:scale-95 transition-all"
      >
        <span className="inline min-[360px]:hidden ">&gt;</span>
        <span className="hidden min-[360px]:inline ">Next</span>
      </button>
    </div>
  );
};

export default Pagination;
