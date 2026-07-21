export type PaginationParams = {
  page: number;
  perPage: number;
  skip: number;
};

export type PaginationMeta = {
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
};

export const paginate = (
  pageRaw?: string | number,
  perPageRaw?: string | number,
): PaginationParams => {
  let page = Number(pageRaw) || 1;
  let perPage = Number(perPageRaw) || 12;

  if (page < 1) {
    page = 1;
  }
  if (perPage < 1) {
    perPage = 12;
  }
  if (perPage > 100) {
    perPage = 100;
  }

  return {
    page,
    perPage,
    skip: (page - 1) * perPage,
  };
};

export const buildMeta = (
  total: number,
  page: number,
  perPage: number,
): PaginationMeta => ({
  total,
  page,
  perPage,
  lastPage: Math.max(1, Math.ceil(total / perPage)),
});
