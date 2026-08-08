export const DEFAULT_PAGE_SIZE = 10;

export function parsePage(value: string | undefined): number {
  const page = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function getPagination(page: number, totalItems: number, pageSize = DEFAULT_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(page, totalPages);
  return {
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    currentPage,
    totalPages,
    totalItems,
  };
}
