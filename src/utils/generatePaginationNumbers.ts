// [1,2,3,4,5,6,7,...,10]
export const generatePaginationNumbers = (
  currentPage: number,
  totalPages: number
) => {
  // if the total number of pages is less than or equal to 7, return an array of numbers from 1 to totalPages
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // if the current page is less than or equal to 3, return an array of 3 elements, ellipsis, and the last two pages
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // if the current page is between the last 3 pages, return the first two pages, ellipsis, and an array of 3 elements
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // if the current page is between the pages, return the first page, ellipsis, the current page, ellipsis, and the rest of the pages
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
