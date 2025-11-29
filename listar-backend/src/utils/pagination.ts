export interface PaginationParams {
  page?: number;
  perPage?: number;
}

export interface PaginationResult {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export const getPaginationParams = (query: any): { skip: number; take: number; page: number } => {
  const page = parseInt(query.page || '1', 10);
  const perPage = parseInt(query.per_page || process.env.PER_PAGE || '10', 10);
  const skip = (page - 1) * perPage;

  return { skip, take: perPage, page };
};

export const createPaginationResponse = (
  page: number,
  perPage: number,
  total: number
): PaginationResult => {
  return {
    page,
    per_page: perPage,
    total,
    total_pages: Math.ceil(total / perPage),
  };
};
